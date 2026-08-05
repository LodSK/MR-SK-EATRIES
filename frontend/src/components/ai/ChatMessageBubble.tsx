"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy, RotateCcw } from "lucide-react";
import type { ChatTurn } from "@/lib/hooks/useAI";
import { ReservationConfirmationCard } from "@/components/ai/ReservationConfirmationCard";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

interface ChatMessageBubbleProps {
  turn: ChatTurn;
  isLatestAssistantReply?: boolean;
  onRegenerate?: () => void;
}

const markdownComponents = {
  p: ({ children }: { children?: React.ReactNode }) => <p className="leading-relaxed">{children}</p>,
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-1.5 list-disc space-y-0.5 pl-4">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-1.5 list-decimal space-y-0.5 pl-4">{children}</ol>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-primary underline underline-offset-2 dark:text-brand-accent"
    >
      {children}
    </a>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="rounded bg-black/10 px-1 py-0.5 font-mono text-[0.85em] dark:bg-white/10">{children}</code>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="my-1.5 overflow-x-auto rounded-lg bg-black/85 p-3 text-xs text-white/90">{children}</pre>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-1.5 overflow-x-auto">
      <table className="w-full border-collapse text-xs">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="border-b border-border px-2 py-1.5 text-left font-semibold">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="border-b border-border/60 px-2 py-1.5">{children}</td>
  ),
};

function ChatMessageBubbleImpl({ turn, isLatestAssistantReply, onRegenerate }: ChatMessageBubbleProps) {
  const [copied, setCopied] = React.useState(false);
  const isUser = turn.role === "user";
  const containerRef = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  React.useLayoutEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" }
    );
    // Runs once per mount — each ChatTurn has a stable unique id used as the
    // list key, so this component only mounts fresh for genuinely new
    // messages, never re-fires on unrelated re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(turn.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — fail silently, not worth surfacing an error for this.
    }
  }

  return (
    <div ref={containerRef} className={cn("group flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
          isUser
            ? "rounded-br-sm bg-brand-primary text-white dark:bg-brand-accent dark:text-brand-secondary"
            : "rounded-bl-sm bg-muted text-foreground"
        )}
      >
        {isUser ? (
          <p className="leading-relaxed">{turn.content}</p>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {turn.content}
          </ReactMarkdown>
        )}
        {turn.reservationConfirmation && (
          <ReservationConfirmationCard confirmation={turn.reservationConfirmation} />
        )}
      </div>

      {!isUser && (
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy response"
            className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </button>
          {isLatestAssistantReply && onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              aria-label="Regenerate response"
              className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Memoized — ChatMessageList re-renders on every isSending toggle (to show/
 * hide the typing indicator); without this, every bubble in a long
 * conversation would re-render on each toggle even though their own props
 * never changed.
 */
export const ChatMessageBubble = React.memo(ChatMessageBubbleImpl);
