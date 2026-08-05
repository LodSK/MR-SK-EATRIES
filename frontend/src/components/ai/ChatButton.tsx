"use client";

import * as React from "react";
import { MessageCircle, X } from "lucide-react";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  showBadge: boolean;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

export function ChatButton({ isOpen, onClick, showBadge, buttonRef }: ChatButtonProps) {
  const pulseRef = React.useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (prefersReducedMotion || isOpen || !pulseRef.current) return;
    const tween = gsap.to(pulseRef.current, {
      scale: 1.6,
      opacity: 0,
      duration: 1.8,
      repeat: -1,
      ease: "power1.out",
    });
    return () => {
      tween.kill();
    };
  }, [prefersReducedMotion, isOpen]);

  function handlePointerEnter() {
    if (prefersReducedMotion || !buttonRef.current) return;
    gsap.to(buttonRef.current, { scale: 1.08, duration: 0.2, ease: "power2.out" });
  }

  function handlePointerLeave() {
    if (prefersReducedMotion || !buttonRef.current) return;
    gsap.to(buttonRef.current, { scale: 1, duration: 0.2, ease: "power2.out" });
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      aria-label={isOpen ? "Close AI concierge" : "Open AI concierge"}
      aria-expanded={isOpen}
      className={cn(
        "relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-colors",
        "bg-brand-primary hover:bg-brand-primary-dark dark:bg-brand-accent dark:text-brand-secondary"
      )}
    >
      {!isOpen && (
        <span
          ref={pulseRef}
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-brand-primary dark:bg-brand-accent"
        />
      )}
      <span className="relative">{isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}</span>
      {showBadge && !isOpen && (
        <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive ring-2 ring-background" />
      )}
    </button>
  );
}
