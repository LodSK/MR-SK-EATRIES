"use client";

import * as React from "react";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function TypingIndicator() {
  const dotsRef = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (prefersReducedMotion || !dotsRef.current) return;
    const dots = dotsRef.current.querySelectorAll("span");
    const tween = gsap.to(dots, {
      y: -4,
      duration: 0.4,
      stagger: 0.15,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return () => {
      tween.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <div className="flex w-fit items-center gap-2 rounded-2xl rounded-bl-sm bg-muted px-4 py-3">
      <div ref={dotsRef} className="flex items-center gap-1" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
      </div>
      <span className="sr-only">The assistant is typing…</span>
    </div>
  );
}
