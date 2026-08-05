/**
 * Every intent Claude can classify a request into. Kept as a plain union
 * (not a Mongoose-backed enum, since nothing here is persisted as its own
 * document) — mirrors how the brief lists them.
 */
export type Intent =
  | "greeting"
  | "menu_question"
  | "recommendation"
  | "reservation"
  | "order_tracking"
  | "order_placement"
  | "delivery"
  | "promotion"
  | "complaint"
  | "restaurant_information"
  | "general_conversation"
  | "unknown";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/** What every AIProvider implementation must return — provider-agnostic, so AIService never sees Claude-specific response shapes. */
export interface AIProviderResponse {
  content: string;
  model: string;
  stopReason: string | null;
  usage: { inputTokens: number; outputTokens: number };
}

export interface AIChatRequest {
  message: string;
  sessionId: string;
}

/** One resolved line item the Order Assistant wants added — the frontend executes this via the existing useCart().addItem(), since the real cart is client-owned (Sprint 7), not this backend's unused cart endpoints. Carries every field addItem() requires (category/price/currency), not just an id, so the frontend never needs a second round trip to resolve them. */
export interface CartActionItem {
  menuItemId: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  currency: string;
  quantity: number;
}

export interface ReservationConfirmation {
  reservationNumber: string;
  date: string;
  time: string;
  partySize: number;
}

export interface AIChatResult {
  reply: string;
  intent: Intent;
  sessionId: string;
  /** Present only when intent is "order_placement" and the AI resolved real menu items to add. */
  cartAction?: CartActionItem[];
  /** Present only when intent is "reservation" and a reservation was actually created this turn. */
  reservationConfirmation?: ReservationConfirmation;
}

export interface RecommendationContext {
  userId?: string;
  budget?: number;
  dietaryRestrictions?: string[];
  timeOfDay?: "breakfast" | "lunch" | "dinner" | "late-night";
}

export interface RecommendationResult {
  reply: string;
  recommendedItemIds: string[];
}

export interface SemanticSearchResult {
  reply: string;
  matchedItemIds: string[];
}

export type PredictionType = "prep-time" | "kitchen-load" | "delivery-time" | "sales-forecast";

export interface PredictionRequest {
  type: PredictionType;
  context?: Record<string, unknown>;
}

export interface PredictionResult {
  type: PredictionType;
  summary: string;
  data: Record<string, unknown>;
}

export interface AIInsightsResult {
  summary: string;
  generatedAt: string;
}
