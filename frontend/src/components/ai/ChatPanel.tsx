"use client";

import * as React from "react";
import { Sparkles, Trash2, X } from "lucide-react";
import { useAI } from "@/lib/hooks/useAI";
import { ChatMessageList } from "@/components/ai/ChatMessageList";
import { ChatInput } from "@/components/ai/ChatInput";

interface ChatPanelProps {
  ai: ReturnType<typeof useAI>;
  onClose: () => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
  titleId: string;
}

export function ChatPanel({ ai, onClose, panelRef, titleId }: ChatPanelProps) {
  const { messages, isSending, error, sendMessage, stopGenerating, regenerate, clearHistory } = ai;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:h-[600px] sm:max-h-[80vh] sm:w-[380px]"
    >
      <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white dark:bg-brand-accent dark:text-brand-secondary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 id={titleId} className="font-display text-sm font-bold leading-tight">
              MR_SK Concierge
            </h2>
            <p className="text-[11px] text-muted-foreground">Always here to help</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              aria-label="Clear conversation"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <ChatMessageList messages={messages} isSending={isSending} onRegenerate={regenerate} />

      {error && (
        <p role="alert" className="px-4 pb-1 text-xs text-destructive">
          {error}
        </p>
      )}

      <ChatInput onSend={sendMessage} onStop={stopGenerating} isSending={isSending} />
    </div>
  );
}
