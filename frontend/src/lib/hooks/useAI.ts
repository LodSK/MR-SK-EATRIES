"use client";

import * as React from "react";
import {
  sendChatMessage,
  getAIRecommendations,
  searchMenuByDescription,
  getAIInsights,
  getAIPrediction,
} from "@/lib/api/ai";
import { useCart } from "@/lib/hooks/useCart";
import type { MenuCategorySlug } from "@/types/menu";
import type {
  AIChatResult,
  AIRecommendationParams,
  AIRecommendationResult,
  AISearchResult,
  AIInsightsResult,
  AIPredictionResult,
  PredictionType,
  ReservationConfirmation,
} from "@/types/ai";

export interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  reservationConfirmation?: ReservationConfirmation;
}

const HISTORY_STORAGE_KEY = "mrsk_ai_chat_history";
const SESSION_STORAGE_KEY = "mrsk_ai_session_id";
const MAX_STORED_TURNS = 50;

function loadStoredSessionId(): string {
  if (typeof window === "undefined") return crypto.randomUUID();
  try {
    const stored = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) return stored;
  } catch {
    // localStorage unavailable (private browsing, etc.) — fall through to a fresh session.
  }
  const fresh = crypto.randomUUID();
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, fresh);
  } catch {
    // Ignore — the session just won't persist across reloads this time.
  }
  return fresh;
}

function loadStoredHistory(): ChatTurn[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatTurn[]) : [];
  } catch {
    return [];
  }
}

/**
 * No chat UI existed before Sprint 13B — this hook is now the complete
 * surface the ChatWidget consumes. Owns the client-side session id and a
 * locally-persisted transcript (Sprint 13B's "Chat History: store /
 * reload / continue previous conversation"); the server holds the
 * authoritative recent-turns window via ConversationMemory for context,
 * this is what lets the UI redraw the full conversation on reload.
 */
export function useAI() {
  const [sessionId] = React.useState(loadStoredSessionId);
  const [messages, setMessages] = React.useState<ChatTurn[]>(loadStoredHistory);
  const [isSending, setIsSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { addItem } = useCart();
  const abortControllerRef = React.useRef<AbortController | null>(null);
  const lastUserMessageRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    try {
      const trimmed = messages.slice(-MAX_STORED_TURNS);
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
    } catch {
      // Storage full or unavailable — the conversation still works, it just won't persist.
    }
  }, [messages]);

  const clearHistory = React.useCallback(() => {
    setMessages([]);
    try {
      window.localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // Ignore.
    }
  }, []);

  const stopGenerating = React.useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const sendInternal = React.useCallback(
    async (message: string, { echoUserTurn }: { echoUserTurn: boolean }): Promise<AIChatResult | null> => {
      lastUserMessageRef.current = message;
      setIsSending(true);
      setError(null);
      if (echoUserTurn) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "user", content: message, createdAt: new Date().toISOString() },
        ]);
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      const response = await sendChatMessage(message, sessionId, controller.signal);
      abortControllerRef.current = null;
      setIsSending(false);

      if (!response.success || !response.result) {
        setError(response.message);
        return null;
      }

      const { reply, cartAction, reservationConfirmation } = response.result;

      // Order Assistant hands back a structured directive, never writes to a
      // cart itself (see PROJECT_STATUS.md's Sprint 13B note) — this is the
      // one place that executes it, via the exact same addItem() every
      // Add-to-Cart button in the app already uses.
      if (cartAction && cartAction.length > 0) {
        for (const line of cartAction) {
          addItem(
            {
              id: line.menuItemId,
              name: line.name,
              slug: line.slug,
              category: line.category as MenuCategorySlug,
              price: line.price,
              currency: line.currency,
            },
            line.quantity
          );
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
          createdAt: new Date().toISOString(),
          reservationConfirmation,
        },
      ]);

      return response.result;
    },
    [sessionId, addItem]
  );

  const sendMessage = React.useCallback(
    (message: string) => sendInternal(message, { echoUserTurn: true }),
    [sendInternal]
  );

  const regenerate = React.useCallback(() => {
    if (!lastUserMessageRef.current) return Promise.resolve(null);
    // Drop the last assistant reply before re-asking, so the transcript
    // doesn't show two answers to the same question.
    setMessages((prev) => {
      const lastAssistantIdx = [...prev].map((m) => m.role).lastIndexOf("assistant");
      return lastAssistantIdx === -1 ? prev : prev.filter((_, i) => i !== lastAssistantIdx);
    });
    return sendInternal(lastUserMessageRef.current, { echoUserTurn: false });
  }, [sendInternal]);

  const getRecommendations = React.useCallback(
    async (params: AIRecommendationParams): Promise<AIRecommendationResult | null> => {
      setIsSending(true);
      setError(null);
      const response = await getAIRecommendations(params);
      setIsSending(false);
      if (!response.success || !response.result) {
        setError(response.message);
        return null;
      }
      return response.result;
    },
    []
  );

  const searchMenu = React.useCallback(async (query: string): Promise<AISearchResult | null> => {
    setIsSending(true);
    setError(null);
    const response = await searchMenuByDescription(query);
    setIsSending(false);
    if (!response.success || !response.result) {
      setError(response.message);
      return null;
    }
    return response.result;
  }, []);

  const getInsights = React.useCallback(async (): Promise<AIInsightsResult | null> => {
    setIsSending(true);
    setError(null);
    const response = await getAIInsights();
    setIsSending(false);
    if (!response.success || !response.result) {
      setError(response.message);
      return null;
    }
    return response.result;
  }, []);

  const getPrediction = React.useCallback(
    async (type: PredictionType, context?: Record<string, unknown>): Promise<AIPredictionResult | null> => {
      setIsSending(true);
      setError(null);
      const response = await getAIPrediction(type, context);
      setIsSending(false);
      if (!response.success || !response.result) {
        setError(response.message);
        return null;
      }
      return response.result;
    },
    []
  );

  return {
    sessionId,
    messages,
    isSending,
    error,
    sendMessage,
    stopGenerating,
    regenerate,
    clearHistory,
    getRecommendations,
    searchMenu,
    getInsights,
    getPrediction,
  };
}
