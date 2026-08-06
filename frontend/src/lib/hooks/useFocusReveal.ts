"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Distance-from-viewport-center focus state — not a one-shot scroll
 * reveal like `useScrollReveal`. Built for "spotlight moving through a
 * dark room" pacing: content softens/dims when off-center and sharpens
 * back into focus as it nears center, in both scroll directions, rather
 * than arriving once and staying static. The caller drives the actual
 * visual change via its own className/CSS transition on `inFocus` — kept
 * declarative (Tailwind transition classes) rather than animated here,
 * so easing stays consistent with the rest of the component.
 */
export function useFocusReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.55) {
  const ref = useRef<T | null>(null);
  const [inFocus, setInFocus] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setInFocus(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let ticking = false;

    function update() {
      const rect = el!.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const dist = Math.abs(elCenter - viewportCenter);
      setInFocus(dist < window.innerHeight * threshold);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [prefersReducedMotion, threshold]);

  return { ref, inFocus };
}
