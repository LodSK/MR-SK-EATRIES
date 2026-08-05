import type { AIProvider } from "@/services/ai/ai-provider.interface";
import { PromptTemplates } from "@/services/ai/prompt-templates";
import type { Intent } from "@/types/ai";

export const KNOWN_INTENTS: readonly Intent[] = [
  "greeting",
  "menu_question",
  "recommendation",
  "reservation",
  "order_tracking",
  "order_placement",
  "delivery",
  "promotion",
  "complaint",
  "restaurant_information",
  "general_conversation",
  "unknown",
];

interface ClassificationResult {
  intent: Intent;
  confidence: number;
}

/**
 * Real classification via the AI provider (per the brief: "Claude should
 * classify requests"), not keyword matching. Depends only on the
 * AIProvider abstraction — works identically regardless of which
 * concrete provider AIProviderFactory hands back.
 */
export class IntentClassifierService {
  constructor(private readonly provider: AIProvider) {}

  async classify(message: string): Promise<ClassificationResult> {
    const response = await this.provider.generate({
      systemPrompt: PromptTemplates.intentClassifier(KNOWN_INTENTS),
      messages: [{ role: "user", content: message }],
      maxTokens: 100,
      forceJson: true,
    });

    return this.parseResult(response.content);
  }

  private parseResult(raw: string): ClassificationResult {
    try {
      const parsed = JSON.parse(raw.trim());
      const intent: Intent = KNOWN_INTENTS.includes(parsed.intent) ? parsed.intent : "unknown";
      const confidence = typeof parsed.confidence === "number" ? parsed.confidence : 0.5;
      return { intent, confidence };
    } catch {
      // The model didn't return valid JSON — degrade gracefully rather than throw,
      // since intent classification should never be what breaks a chat reply.
      return { intent: "unknown", confidence: 0 };
    }
  }
}
