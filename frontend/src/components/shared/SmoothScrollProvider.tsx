"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * GSAP Phase — global smooth scrolling, synced to ScrollTrigger so every
 * existing `useScrollReveal` (and every new ScrollTrigger-driven
 * animation this phase adds) stays correctly positioned against the
 * smoothed scroll position rather than the raw, unsmoothed one.
 * Skipped entirely when the visitor prefers reduced motion — smooth
 * scroll is a "nice to have" GSAP is explicitly told never to force on
 * anyone who's asked their OS not to animate things.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, [prefersReducedMotion]);

  return <>{children}</>;
}
