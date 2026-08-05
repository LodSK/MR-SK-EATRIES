import type { AIProvider } from "@/services/ai/ai-provider.interface";
import { PromptTemplates } from "@/services/ai/prompt-templates";
import { getPopularMenuItems, listMenuItems } from "@/services/menu.service";
import { getUserOrderHistory } from "@/services/order.service";
import type { RecommendationContext, RecommendationResult } from "@/types/ai";

/**
 * Architecture-only per the brief — the pipeline is real and callable
 * today (available menu + popularity are live data), but the deeper
 * personalization signals (favorite categories derived from order
 * history, weather) are wired to reuse existing services now and are
 * ready to be enriched further without changing this class's shape.
 */
export class RecommendationEngineService {
  constructor(private readonly provider: AIProvider) {}

  async recommend(context: RecommendationContext): Promise<RecommendationResult> {
    const [availableItems, popularItems, orderHistory] = await Promise.all([
      listMenuItems({ page: 1, limit: 50, sort: "popularity" }),
      getPopularMenuItems(10),
      context.userId ? getUserOrderHistory(context.userId, 1, 10) : Promise.resolve(null),
    ]);

    const menuForPrompt = availableItems.items.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      category: item.category,
      price: item.price,
      isVegetarian: item.isVegetarian,
      isSpicy: item.isSpicy,
      tag: item.tag,
    }));

    const favoriteCategories = this.deriveFavoriteCategories(orderHistory?.orders ?? []);

    const contextForPrompt = {
      budget: context.budget,
      dietaryRestrictions: context.dietaryRestrictions ?? [],
      timeOfDay: context.timeOfDay,
      favoriteCategories,
      popularItemIds: popularItems.map((item) => item._id.toString()),
      // Weather signal is future-ready: once a weather provider is wired up,
      // it plugs in here without touching the prompt template or this method's signature.
      weather: undefined,
    };

    const response = await this.provider.generate({
      systemPrompt: PromptTemplates.recommendationAssistant(
        JSON.stringify(menuForPrompt),
        JSON.stringify(contextForPrompt)
      ),
      messages: [{ role: "user", content: "Recommend something for me." }],
      maxTokens: 500,
    });

    return {
      reply: response.content,
      recommendedItemIds: this.extractItemIds(response.content, "recommendedItemIds"),
    };
  }

  private deriveFavoriteCategories(orders: { items: { name: string }[] }[]): string[] {
    // Order line items don't carry category directly (see OrderItem sub-schema)
    // — this stays a light-weight placeholder signal until Sprint 13B/C, when
    // real usage data makes a proper aggregation worth building.
    return orders.length > 0 ? ["frequently-ordered"] : [];
  }

  private extractItemIds(content: string, key: string): string[] {
    // Claude is asked to end its reply with a JSON line — scan from the
    // bottom up for the first line that parses as JSON containing this key,
    // rather than a brace-counting regex (which can't handle nested JSON
    // correctly anyway).
    const lines = content.trim().split("\n").reverse();
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) continue;
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed[key])) return parsed[key];
      } catch {
        continue;
      }
    }
    return [];
  }
}
