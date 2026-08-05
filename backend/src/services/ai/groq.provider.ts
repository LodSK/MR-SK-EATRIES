import Groq from "groq-sdk";
import { env } from "@/config/env";
import { ApiError } from "@/utils/ApiError";
import type { AIProvider, GenerateOptions } from "@/services/ai/ai-provider.interface";
import type { AIProviderResponse } from "@/types/ai";
import { logger } from "@/config/logger";

/**
 * The single point of contact with the real Groq API. Uses the official
 * groq-sdk against its OpenAI-compatible Chat Completions endpoint, not a
 * hand-rolled fetch call. No other file in the backend imports this SDK —
 * everything else goes through the AIProvider interface, so this class is
 * the only thing that would need to change if Groq's SDK surface changes.
 *
 * Added as a third provider alongside Gemini/Claude specifically because
 * Gemini's free tier caps out at 20 requests/day for this project's key —
 * too restrictive for active development. Groq's free tier is far more
 * generous for the fast open-weight models (Llama 3.3, etc.) it serves.
 */
export class GroqProvider implements AIProvider {
  readonly name = "groq";
  private readonly client: Groq;

  constructor() {
    if (!env.ai.groqApiKey) {
      throw ApiError.internal(
        "AI is not configured — GROQ_API_KEY is missing. Set it in the backend's .env before using any /ai/* route."
      );
    }
    this.client = new Groq({ apiKey: env.ai.groqApiKey });
  }

  async generate(options: GenerateOptions): Promise<AIProviderResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: env.ai.groqModel,
        messages: [
          { role: "system" as const, content: options.systemPrompt },
          ...options.messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        max_completion_tokens: options.maxTokens ?? env.ai.maxTokens,
        ...(options.forceJson ? { response_format: { type: "json_object" as const } } : {}),
      });

      const choice = response.choices[0];

      return {
        content: choice?.message?.content ?? "",
        model: response.model,
        stopReason: choice?.finish_reason ?? null,
        usage: {
          inputTokens: response.usage?.prompt_tokens ?? 0,
          outputTokens: response.usage?.completion_tokens ?? 0,
        },
      };
    } catch (error) {
      // Never leak SDK internals (which can include request details) to the client.
      logger.error("[GroqProvider] Groq API call failed", { error: error instanceof Error ? error.message : error });
      throw isRateLimitError(error)
        ? ApiError.tooManyRequests(
            "The AI assistant is getting a lot of requests right now. Please wait a moment and try again."
          )
        : ApiError.internal("The AI assistant is temporarily unavailable. Please try again shortly.");
    }
  }
}

/** Same rate-limit-vs-outage distinction GeminiProvider/ClaudeProvider make — a 429 here is routine and retryable, not a real failure. */
function isRateLimitError(error: unknown): boolean {
  const status = (error as { status?: number } | null)?.status;
  if (status === 429) return true;
  const message = error instanceof Error ? error.message : "";
  return /rate.?limit|quota/i.test(message);
}
