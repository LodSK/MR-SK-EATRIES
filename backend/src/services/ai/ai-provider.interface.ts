import type { AIProviderResponse, ChatMessage } from "@/types/ai";

export interface GenerateOptions {
  systemPrompt: string;
  messages: ChatMessage[];
  maxTokens?: number;
  /** When set, asks the provider to return parseable JSON matching this shape's description — used by IntentClassifier and PredictionService rather than free-form prose. */
  forceJson?: boolean;
}

/**
 * The one seam the whole AI layer depends on. Adding a second provider
 * (OpenAI, etc.) later means writing one new class that implements this
 * interface and adding one branch to AIProviderFactory — nothing in
 * AIService, IntentClassifier, RecommendationEngine, SemanticSearchService,
 * or PredictionService changes.
 */
export interface AIProvider {
  readonly name: string;
  generate(options: GenerateOptions): Promise<AIProviderResponse>;
}
