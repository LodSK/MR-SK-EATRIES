"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * GSAP Phase — "food image reveal": a clip-path wipe (bottom-to-top)
 * on scroll-into-view, distinct from the fade/rise reveals used
 * elsewhere in the app. Attach the returned ref to the image's
 * (overflow-hidden, position-relative) wrapper element.
 */
export function useImageReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return ref;
}
