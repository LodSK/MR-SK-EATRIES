import { randomUUID } from "crypto";
import { getAIProvider } from "@/services/ai/ai-provider.factory";
import { IntentClassifierService } from "@/services/ai/intent-classifier.service";
import { RecommendationEngineService } from "@/services/ai/recommendation-engine.service";
import { SemanticSearchService } from "@/services/ai/semantic-search.service";
import { PredictionService } from "@/services/ai/prediction.service";
import { ConversationMemory } from "@/services/ai/conversation-memory.service";
import { PromptTemplates } from "@/services/ai/prompt-templates";
import { getSettings } from "@/services/settings.service";
import { getUserOrderHistory } from "@/services/order.service";
import { createReservation } from "@/services/reservation.service";
import { searchMenuItems } from "@/services/menu.service";
import { User } from "@/models/User.model";
import { getDashboardSummary } from "@/services/analytics.service";
import type {
  AIChatRequest,
  AIChatResult,
  AIInsightsResult,
  CartActionItem,
  PredictionRequest,
  PredictionResult,
  RecommendationContext,
  RecommendationResult,
  ReservationConfirmation,
  SemanticSearchResult,
} from "@/types/ai";

/**
 * The single entry point every AI controller calls. Everything else in
 * services/ai/ is a collaborator this class composes — no controller
 * talks to IntentClassifierService, ClaudeProvider, or ConversationMemory
 * directly, mirroring how the rest of the backend keeps controllers thin
 * and services as the only business-logic layer.
 *
 * Sprint 13B additive extension: "reservation" and "order_placement"
 * intents now do real, multi-step work (extract structured details via
 * the existing forceJson pattern, then either execute or ask a
 * clarifying question) rather than only describing existing data. See
 * PROJECT_STATUS.md's Sprint 13B section for the full reasoning —
 * reservations execute server-side (reusing reservation.service.ts's
 * createReservation, since reservations are fully backend-owned), while
 * cart actions are returned as a structured `cartAction` for the
 * frontend to execute via the real, client-owned cart (useCart()).
 */
class AIServiceImpl {
  private get provider() {
    return getAIProvider();
  }

  async chat(request: AIChatRequest, userId?: string): Promise<AIChatResult> {
    const sessionId = request.sessionId || randomUUID();
    const classifier = new IntentClassifierService(this.provider);
    const { intent } = await classifier.classify(request.message);

    ConversationMemory.append(sessionId, { role: "user", content: request.message });
    const history = ConversationMemory.get(sessionId);

    if (intent === "recommendation") {
      // Reuses the same recommendation pipeline /ai/recommend uses — chat
      // messages don't carry structured budget/dietary context, so this
      // calls it with just what's known (the signed-in user, if any),
      // rather than duplicating recommendation logic inline here.
      const { reply } = await this.recommend({ userId });
      ConversationMemory.append(sessionId, { role: "assistant", content: reply });
      return { reply, intent, sessionId };
    }

    if (intent === "order_placement") {
      return this.handleOrderPlacement(request.message, sessionId, intent);
    }

    if (intent === "reservation") {
      return this.handleReservationRequest(history, sessionId, intent, userId);
    }

    const systemPrompt = await this.buildSystemPromptForIntent(intent, userId);

    const response = await this.provider.generate({
      systemPrompt,
      messages: history,
      maxTokens: 500,
    });

    ConversationMemory.append(sessionId, { role: "assistant", content: response.content });

    return { reply: response.content, intent, sessionId };
  }

  async recommend(context: RecommendationContext): Promise<RecommendationResult> {
    return new RecommendationEngineService(this.provider).recommend(context);
  }

  async search(query: string): Promise<SemanticSearchResult> {
    return new SemanticSearchService(this.provider).search(query);
  }

  async predict(request: PredictionRequest): Promise<PredictionResult> {
    return new PredictionService(this.provider).predict(request);
  }

  async getInsights(): Promise<AIInsightsResult> {
    const summary = await getDashboardSummary();
    const response = await this.provider.generate({
      systemPrompt: PromptTemplates.analyticsAssistant(JSON.stringify(summary)),
      messages: [{ role: "user", content: "Summarize current restaurant performance." }],
      maxTokens: 400,
    });
    return { summary: response.content, generatedAt: new Date().toISOString() };
  }

  /**
   * Resolves the customer's request against the REAL menu (never invents
   * a dish or id) and hands back a structured cartAction — this service
   * never writes to a cart itself, since the real cart is client-owned
   * (Sprint 7's useCart()/Zustand), not this backend's cart endpoints.
   */
  private async handleOrderPlacement(
    message: string,
    sessionId: string,
    intent: AIChatResult["intent"]
  ): Promise<AIChatResult> {
    const candidates = await searchMenuItems(message, 30);
    interface MenuItemForCart {
      _id: { toString(): string };
      name: string;
      slug: string;
      category: string;
      price: number;
      currency: string;
    }
    const candidateById = new Map<string, MenuItemForCart>(
      candidates.map((item): [string, MenuItemForCart] => [item._id.toString(), item as unknown as MenuItemForCart])
    );
    const menuForPrompt = candidates.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      price: item.price,
      category: item.category,
    }));

    const response = await this.provider.generate({
      systemPrompt: PromptTemplates.orderExtraction(JSON.stringify(menuForPrompt), message),
      messages: [{ role: "user", content: message }],
      maxTokens: 300,
      forceJson: true,
    });

    const parsed = this.safeParseJson(response.content);
    const rawItems = Array.isArray(parsed?.items) ? (parsed!.items as { menuItemId?: unknown; quantity?: unknown }[]) : [];

    const items: CartActionItem[] = rawItems
      .map((raw) => {
        const menuItem = typeof raw.menuItemId === "string" ? candidateById.get(raw.menuItemId) : undefined;
        const quantity = typeof raw.quantity === "number" && raw.quantity > 0 ? raw.quantity : 1;
        if (!menuItem) return null;
        return {
          menuItemId: menuItem._id.toString(),
          name: menuItem.name,
          slug: menuItem.slug,
          category: menuItem.category,
          price: menuItem.price,
          currency: menuItem.currency,
          quantity,
        };
      })
      .filter((item): item is CartActionItem => item !== null);

    const reply =
      items.length > 0
        ? `Added to your cart: ${items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}.`
        : (parsed?.clarifyingQuestion as string | undefined) ??
          "I couldn't quite match that to a dish on our menu — could you tell me which item you'd like?";

    ConversationMemory.append(sessionId, { role: "assistant", content: reply });

    return { reply, intent, sessionId, cartAction: items.length > 0 ? items : undefined };
  }

  /**
   * Extracts booking details across however many turns it takes, then
   * executes via the existing createReservation() the moment everything
   * required is known — reusing Sprint 10's real capacity check and
   * validation, not a parallel booking path.
   */
  private async handleReservationRequest(
    history: { role: "user" | "assistant"; content: string }[],
    sessionId: string,
    intent: AIChatResult["intent"],
    userId?: string
  ): Promise<AIChatResult> {
    const account = userId ? await User.findById(userId).select("fullName email phone") : null;
    const conversationText = history.map((m) => `${m.role}: ${m.content}`).join("\n");
    const todayIso = new Date().toISOString().slice(0, 10);

    const response = await this.provider.generate({
      systemPrompt: PromptTemplates.reservationExtraction(conversationText, todayIso),
      messages: [{ role: "user", content: conversationText }],
      maxTokens: 300,
      forceJson: true,
    });

    const parsed = this.safeParseJson(response.content) ?? {};
    const fullName = (parsed.fullName as string | null) ?? account?.fullName ?? null;
    const email = (parsed.email as string | null) ?? account?.email ?? null;
    const phone = (parsed.phone as string | null) ?? account?.phone ?? null;
    const partySize = parsed.partySize as number | null;
    const date = parsed.date as string | null;
    const time = parsed.time as string | null;

    const isReady = Boolean(fullName && email && phone && partySize && date && time);

    if (!isReady) {
      const reply =
        (parsed.clarifyingQuestion as string | undefined) ??
        "Could you share the date, time, and party size for your reservation?";
      ConversationMemory.append(sessionId, { role: "assistant", content: reply });
      return { reply, intent, sessionId };
    }

    try {
      const reservation = await createReservation({
        userId,
        fullName: fullName as string,
        email: email as string,
        phone: phone as string,
        partySize: partySize as number,
        date: new Date(date as string),
        time: time as string,
      });

      const confirmation: ReservationConfirmation = {
        reservationNumber: reservation.reservationNumber,
        date: reservation.date.toISOString(),
        time: reservation.time,
        partySize: reservation.partySize,
      };

      const reply = `You're booked! Table for ${partySize} on ${date} at ${time}. Confirmation number: ${reservation.reservationNumber}.`;
      ConversationMemory.append(sessionId, { role: "assistant", content: reply });
      return { reply, intent, sessionId, reservationConfirmation: confirmation };
    } catch (error) {
      // createReservation() throws ApiError.conflict when the slot is full — the
      // existing Sprint 10 capacity check is what's actually protecting this,
      // not anything new here.
      const reply =
        error instanceof Error
          ? error.message
          : "I couldn't complete that booking — please try a different time.";
      ConversationMemory.append(sessionId, { role: "assistant", content: reply });
      return { reply, intent, sessionId };
    }
  }

  private safeParseJson(raw: string): Record<string, unknown> | null {
    try {
      return JSON.parse(raw.trim());
    } catch {
      return null;
    }
  }

  private async buildSystemPromptForIntent(intent: string, userId?: string): Promise<string> {
    switch (intent) {
      case "order_tracking":
      case "delivery": {
        const recentOrders = userId ? await getUserOrderHistory(userId, 1, 1) : null;
        return PromptTemplates.orderAssistant(JSON.stringify(recentOrders?.orders ?? []));
      }
      case "greeting":
      case "menu_question":
      case "promotion":
      case "complaint":
      case "restaurant_information":
      case "general_conversation":
      case "unknown":
      default: {
        const settings = await getSettings();
        return PromptTemplates.restaurantAssistant(JSON.stringify(settings));
      }
    }
  }
}

export const AIService = new AIServiceImpl();
