"use client";

import * as React from "react";
import { ArrowUp, Square } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isSending: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onStop, isSending, disabled }: ChatInputProps) {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || isSending || disabled) return;
    onSend(trimmed);
    setValue("");
    requestAnimationFrame(autoResize);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 border-t border-border p-3">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          autoResize();
        }}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Ask about the menu, book a table, or place an order…"
        disabled={disabled}
        aria-label="Message"
        className="max-h-[120px] flex-1 resize-none rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus-visible:border-brand-primary disabled:opacity-60"
      />
      <button
        type={isSending ? "button" : "submit"}
        onClick={isSending ? onStop : undefined}
        disabled={disabled || (!isSending && value.trim().length === 0)}
        aria-label={isSending ? "Stop generating" : "Send message"}
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-40",
          isSending
            ? "bg-destructive text-white hover:bg-destructive/90"
            : "bg-brand-primary text-white hover:bg-brand-primary-dark dark:bg-brand-accent dark:text-brand-secondary"
        )}
      >
        {isSending ? <Square className="h-3.5 w-3.5 fill-current" /> : <ArrowUp className="h-4 w-4" />}
      </button>
    </form>
  );
}
