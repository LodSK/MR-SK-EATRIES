import Anthropic from "@anthropic-ai/sdk";
import { env } from "@/config/env";
import { ApiError } from "@/utils/ApiError";
import type { AIProvider, GenerateOptions } from "@/services/ai/ai-provider.interface";
import type { AIProviderResponse } from "@/types/ai";
import { logger } from "@/config/logger";

/**
 * The single point of contact with the real Anthropic Claude API. Uses the
 * official @anthropic-ai/sdk (not a hand-rolled fetch call) against the
 * standard Messages API. No other file in the backend imports this SDK —
 * everything else goes through the AIProvider interface, so this class is
 * the only thing that would need to change if Anthropic's SDK surface
 * changes.
 */
export class ClaudeProvider implements AIProvider {
  readonly name = "claude";
  private readonly client: Anthropic;

  constructor() {
    if (!env.ai.anthropicApiKey) {
      throw ApiError.internal(
        "AI is not configured — ANTHROPIC_API_KEY is missing. Set it in the backend's .env before using any /ai/* route."
      );
    }
    this.client = new Anthropic({ apiKey: env.ai.anthropicApiKey });
  }

  async generate(options: GenerateOptions): Promise<AIProviderResponse> {
    try {
      const response = await this.client.messages.create({
        model: env.ai.anthropicModel,
        max_tokens: options.maxTokens ?? env.ai.maxTokens,
        system: options.forceJson
          ? `${options.systemPrompt}\n\nRespond with ONLY valid JSON — no prose, no markdown code fences, no explanation before or after the JSON object.`
          : options.systemPrompt,
        messages: options.messages.map((m) => ({ role: m.role, content: m.content })),
      });

      const textBlock = response.content.find((block) => block.type === "text");

      return {
        content: textBlock && "text" in textBlock ? textBlock.text : "",
        model: response.model,
        stopReason: response.stop_reason,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
      };
    } catch (error) {
      // Never leak SDK internals (which can include request details) to the client.
      logger.error("[ClaudeProvider] Anthropic API call failed", { error: error instanceof Error ? error.message : error });
      const status = (error as { status?: number } | null)?.status;
      throw status === 429
        ? ApiError.tooManyRequests(
            "The AI assistant is getting a lot of requests right now. Please wait a moment and try again."
          )
        : ApiError.internal("The AI assistant is temporarily unavailable. Please try again shortly.");
    }
  }
}
