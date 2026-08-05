import { env } from "@/config/env";
import { ApiError } from "@/utils/ApiError";
import { ClaudeProvider } from "@/services/ai/claude.provider";
import { GeminiProvider } from "@/services/ai/gemini.provider";
import { GroqProvider } from "@/services/ai/groq.provider";
import type { AIProvider } from "@/services/ai/ai-provider.interface";

let cachedProvider: AIProvider | null = null;

/**
 * Lazily constructs and caches the active provider — lazy so that a
 * missing API key only breaks AI routes when they're actually called, not
 * at server boot (the rest of the app must keep working even if AI is
 * unconfigured).
 *
 * Adding a provider is exactly this: one new class implementing
 * AIProvider, one new case here. Nothing in AIService, IntentClassifier,
 * RecommendationEngine, SemanticSearchService, or PredictionService — or
 * any controller/route — changes when the active provider changes.
 */
export function getAIProvider(): AIProvider {
  if (cachedProvider) return cachedProvider;

  switch (env.ai.provider) {
    case "groq":
      cachedProvider = new GroqProvider();
      return cachedProvider;
    case "gemini":
      cachedProvider = new GeminiProvider();
      return cachedProvider;
    case "claude":
      cachedProvider = new ClaudeProvider();
      return cachedProvider;
    default:
      throw ApiError.internal(
        `Unknown AI_PROVIDER "${env.ai.provider}". Supported: "groq", "gemini", "claude".`
      );
  }
}
