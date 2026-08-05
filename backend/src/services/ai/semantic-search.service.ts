import type { AIProvider } from "@/services/ai/ai-provider.interface";
import { PromptTemplates } from "@/services/ai/prompt-templates";
import { listMenuItems } from "@/services/menu.service";
import type { SemanticSearchResult } from "@/types/ai";

/**
 * Architecture for natural-language menu search ("something spicy",
 * "cheap lunch", "rice"). Reuses the exact same listMenuItems() the
 * regular keyword search (Sprint 6's SearchBar/CategoryFilter) already
 * calls — this is a second way to query the same real menu data, not a
 * parallel menu system.
 */
export class SemanticSearchService {
  constructor(private readonly provider: AIProvider) {}

  async search(query: string): Promise<SemanticSearchResult> {
    const { items } = await listMenuItems({ page: 1, limit: 100, sort: "popularity" });

    const menuForPrompt = items.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      isVegetarian: item.isVegetarian,
      isSpicy: item.isSpicy,
    }));

    const response = await this.provider.generate({
      systemPrompt: PromptTemplates.semanticSearch(JSON.stringify(menuForPrompt)),
      messages: [{ role: "user", content: query }],
      maxTokens: 400,
    });

    return {
      reply: response.content,
      matchedItemIds: this.extractItemIds(response.content),
    };
  }

  private extractItemIds(content: string): string[] {
    const lines = content.trim().split("\n").reverse();
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) continue;
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed.matchedItemIds)) return parsed.matchedItemIds;
      } catch {
        continue;
      }
    }
    return [];
  }
}
