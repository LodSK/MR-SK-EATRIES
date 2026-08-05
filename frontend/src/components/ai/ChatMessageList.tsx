"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import type { ChatTurn } from "@/lib/hooks/useAI";
import { ChatMessageBubble } from "@/components/ai/ChatMessageBubble";
import { TypingIndicator } from "@/components/ai/TypingIndicator";

interface ChatMessageListProps {
  messages: ChatTurn[];
  isSending: boolean;
  onRegenerate: () => void;
}

export function ChatMessageList({ messages, isSending, onRegenerate }: ChatMessageListProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isSending]);

  const lastAssistantIndex = [...messages].map((m) => m.role).lastIndexOf("assistant");

  if (messages.length === 0 && !isSending) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-secondary text-brand-accent">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="font-display text-sm font-bold">Ask me anything</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Menu questions, recommendations, reservations, or your order — I've got real, live answers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4" role="log" aria-live="polite">
      {messages.map((turn, index) => (
        <ChatMessageBubble
          key={turn.id}
          turn={turn}
          isLatestAssistantReply={turn.role === "assistant" && index === lastAssistantIndex && !isSending}
          onRegenerate={onRegenerate}
        />
      ))}
      {isSending && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
