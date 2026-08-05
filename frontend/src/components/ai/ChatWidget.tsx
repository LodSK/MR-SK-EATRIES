"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useAI } from "@/lib/hooks/useAI";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { gsap } from "@/lib/animations/gsap";
import { ChatButton } from "@/components/ai/ChatButton";

// ChatPanel pulls in react-markdown/remark-gfm to render AI replies — real
// weight (~140KB) that has no reason to load on every page just because
// ChatWidgetLoader mounts globally. Deferred until the panel is actually
// opened, completing the "lazy load chatbot" requirement ChatWidgetLoader's
// ssr:false only got halfway to.
const ChatPanel = dynamic(() => import("@/components/ai/ChatPanel").then((mod) => mod.ChatPanel), {
  ssr: false,
});

const TITLE_ID = "mrsk-ai-concierge-title";

export function ChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const ai = useAI();

  // Notification badge shows once, before the customer has ever opened the
  // widget — a light nudge, not a persistent nag.
  const showBadge = !hasOpenedOnce && ai.messages.length === 0;

  const open = React.useCallback(() => {
    setIsOpen(true);
    setHasOpenedOnce(true);
  }, []);

  const close = React.useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus();
  }, []);

  function toggle() {
    if (isOpen) close();
    else open();
  }

  // GSAP open/close — a premium, deliberate entrance/exit rather than a
  // plain CSS fade, per the brief's explicit "GSAP open animation / GSAP
  // close animation" requirement. Skipped entirely under reduced motion.
  React.useLayoutEffect(() => {
    if (!isOpen || !panelRef.current) return;
    if (prefersReducedMotion) {
      gsap.set(panelRef.current, { opacity: 1, scale: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, scale: 0.92, y: 16, transformOrigin: "bottom right" },
      { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(1.6)" }
    );
  }, [isOpen, prefersReducedMotion]);

  function handleCloseWithAnimation() {
    if (prefersReducedMotion || !panelRef.current) {
      close();
      return;
    }
    gsap.to(panelRef.current, {
      opacity: 0,
      scale: 0.92,
      y: 16,
      duration: 0.22,
      ease: "power2.in",
      onComplete: close,
    });
  }

  // Escape closes the panel from anywhere inside it.
  React.useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleCloseWithAnimation();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Move focus into the panel when it opens, for keyboard users.
  React.useEffect(() => {
    if (isOpen) panelRef.current?.querySelector("textarea")?.focus();
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen && (
        <div className="fixed inset-0 z-[80] p-0 sm:static sm:inset-auto sm:p-0">
          <ChatPanel ai={ai} onClose={handleCloseWithAnimation} panelRef={panelRef} titleId={TITLE_ID} />
        </div>
      )}
      <ChatButton isOpen={isOpen} onClick={toggle} showBadge={showBadge} buttonRef={buttonRef} />
    </div>
  );
}
