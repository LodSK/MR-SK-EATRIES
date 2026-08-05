import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";
import type {
  AIChatResult,
  AIInsightsResult,
  AIPredictionResult,
  AIRecommendationParams,
  AIRecommendationResult,
  AISearchResult,
  PredictionType,
} from "@/types/ai";

/**
 * The frontend never communicates with Anthropic directly — every one of
 * these calls goes through the backend's /ai/* routes exactly like any
 * other lib/api/*.ts file goes through the backend, via the shared
 * httpClient. No API key exists anywhere in frontend code.
 */

export async function sendChatMessage(
  message: string,
  sessionId: string,
  signal?: AbortSignal
): Promise<{ success: boolean; message: string; result?: AIChatResult }> {
  try {
    const { data } = await httpClient.post("/ai/chat", { message, sessionId }, { signal });
    return { success: true, message: data.message, result: data.data };
  } catch (error) {
    if (error instanceof Error && error.name === "CanceledError") {
      return { success: false, message: "Generation stopped." };
    }
    return { success: false, message: getApiErrorMessage(error, "The AI assistant is unavailable right now.") };
  }
}

export async function getAIRecommendations(
  params: AIRecommendationParams
): Promise<{ success: boolean; message: string; result?: AIRecommendationResult }> {
  try {
    const { data } = await httpClient.post("/ai/recommend", params);
    return { success: true, message: data.message, result: data.data };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function searchMenuByDescription(
  query: string
): Promise<{ success: boolean; message: string; result?: AISearchResult }> {
  try {
    const { data } = await httpClient.post("/ai/search", { query });
    return { success: true, message: data.message, result: data.data };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

/** Staff/admin only — the backend enforces this; a customer token will get a 403. */
export async function getAIInsights(): Promise<{ success: boolean; message: string; result?: AIInsightsResult }> {
  try {
    const { data } = await httpClient.get("/ai/insights");
    return { success: true, message: data.message, result: data.data };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

/** Staff/admin only — the backend enforces this; a customer token will get a 403. */
export async function getAIPrediction(
  type: PredictionType,
  context?: Record<string, unknown>
): Promise<{ success: boolean; message: string; result?: AIPredictionResult }> {
  try {
    const { data } = await httpClient.post("/ai/predict", { type, context });
    return { success: true, message: data.message, result: data.data };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
