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
  cartAction?: CartActionItem[];
  reservationConfirmation?: ReservationConfirmation;
}

export interface AIRecommendationParams {
  budget?: number;
  dietaryRestrictions?: string[];
  timeOfDay?: "breakfast" | "lunch" | "dinner" | "late-night";
}

export interface AIRecommendationResult {
  reply: string;
  recommendedItemIds: string[];
}

export interface AISearchResult {
  reply: string;
  matchedItemIds: string[];
}

export type PredictionType = "prep-time" | "kitchen-load" | "delivery-time" | "sales-forecast";

export interface AIPredictionResult {
  type: PredictionType;
  summary: string;
  data: Record<string, unknown>;
}

export interface AIInsightsResult {
  summary: string;
  generatedAt: string;
}
