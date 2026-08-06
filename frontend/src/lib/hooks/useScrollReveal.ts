"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface ScrollRevealOptions {
  /** Pixels to translate up from on enter. Default 32. */
  y?: number;
  duration?: number;
  delay?: number;
  /** ScrollTrigger `start` value. Default "top 82%". */
  start?: string;
  /** Stagger between children (only applied when the container has multiple children). */
  stagger?: number;
}

/**
 * Attach the returned ref to a container. Its direct children (or the
 * element itself, if it has none) will fade + rise into view once they
 * cross the given scroll threshold. Used for section-level reveals
 * (feature grids, timelines, menu cards) rather than page-load motion.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const targets = el.children.length > 0 ? Array.from(el.children) : [el];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: options.y ?? 32 },
        {
          opacity: 1,
          y: 0,
          duration: options.duration ?? 0.9,
          delay: options.delay ?? 0,
          ease: "power3.out",
          stagger: options.stagger ?? 0.12,
          scrollTrigger: {
            trigger: el,
            start: options.start ?? "top 82%",
          },
        }
      );
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return ref;
}

/** Call once from a top-level client component if a route needs manual ScrollTrigger recalculation. */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}
