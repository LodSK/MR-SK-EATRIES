"use client";

import dynamic from "next/dynamic";

// ssr: false — the widget touches localStorage/crypto/GSAP's window checks
// immediately on mount; skipping SSR for it avoids a hydration mismatch and
// keeps it out of the initial page bundle entirely, per the brief's
// explicit "Lazy load chatbot" performance requirement.
const ChatWidget = dynamic(() => import("@/components/ai/ChatWidget").then((mod) => mod.ChatWidget), {
  ssr: false,
});

export function ChatWidgetLoader() {
  return <ChatWidget />;
}
