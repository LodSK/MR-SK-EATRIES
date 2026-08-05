import { GoogleGenAI } from "@google/genai";
import { env } from "@/config/env";
import { ApiError } from "@/utils/ApiError";
import type { AIProvider, GenerateOptions } from "@/services/ai/ai-provider.interface";
import type { AIProviderResponse } from "@/types/ai";
import { logger } from "@/config/logger";

/**
 * The single point of contact with the real Google Gemini API. Uses the
 * official @google/genai SDK against the standard generateContent call. No
 * other file in the backend imports this SDK — everything else goes
 * through the AIProvider interface, so this class is the only thing that
 * would need to change if Google's SDK surface changes.
 */
export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  private readonly client: GoogleGenAI;

  constructor() {
    if (!env.ai.geminiApiKey) {
      throw ApiError.internal(
        "AI is not configured — GEMINI_API_KEY is missing. Set it in the backend's .env before using any /ai/* route."
      );
    }
    this.client = new GoogleGenAI({ apiKey: env.ai.geminiApiKey });
  }

  async generate(options: GenerateOptions): Promise<AIProviderResponse> {
    try {
      const response = await this.client.models.generateContent({
        model: env.ai.geminiModel,
        contents: options.messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        config: {
          systemInstruction: options.systemPrompt,
          maxOutputTokens: options.maxTokens ?? env.ai.maxTokens,
          // Newer Gemini models "think" by default, spending part of
          // maxOutputTokens on hidden reasoning before any visible text —
          // with the short budgets used here (300-500 tokens, tuned for a
          // quick chat reply or a one-line JSON extraction) that reliably
          // ate the whole budget and left a truncated, sometimes-garbled
          // response with no visible answer. Every call site in this app
          // wants a fast, short, direct answer, never multi-step reasoning,
          // so thinking is disabled outright rather than budgeted per call.
          thinkingConfig: { thinkingBudget: 0 },
          ...(options.forceJson ? { responseMimeType: "application/json" } : {}),
        },
      });

      const usage = response.usageMetadata;
      const finishReason = response.candidates?.[0]?.finishReason;

      return {
        content: response.text ?? "",
        model: env.ai.geminiModel,
        stopReason: finishReason ? String(finishReason) : null,
        usage: {
          inputTokens: usage?.promptTokenCount ?? 0,
          outputTokens: usage?.candidatesTokenCount ?? 0,
        },
      };
    } catch (error) {
      // Never leak SDK internals (which can include request details) to the client.
      logger.error("[GeminiProvider] Gemini API call failed", { error: error instanceof Error ? error.message : error });
      throw isRateLimitError(error)
        ? ApiError.tooManyRequests(
            "The AI assistant is getting a lot of requests right now. Please wait a moment and try again."
          )
        : ApiError.internal("The AI assistant is temporarily unavailable. Please try again shortly.");
    }
  }
}

/**
 * Google's free-tier per-minute quota (RESOURCE_EXHAUSTED, HTTP 429) is a
 * routine, retryable condition, not an outage — surfacing it under the
 * same generic "temporarily unavailable" message as a real failure would
 * be actively misleading, since this one clears itself in seconds.
 */
function isRateLimitError(error: unknown): boolean {
  const status = (error as { status?: number } | null)?.status;
  if (status === 429) return true;
  const message = error instanceof Error ? error.message : "";
  return /RESOURCE_EXHAUSTED|rate.?limit|quota/i.test(message);
}
