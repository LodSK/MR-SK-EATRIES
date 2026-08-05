"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * GSAP Phase — route/page transitions. Keyed on `pathname` so React
 * remounts this wrapper on every navigation, which combined with the
 * mount-time GSAP tween gives a clean fade+rise entrance per route.
 *
 * Deliberately entrance-only, not a full crossfade/exit choreography —
 * the App Router doesn't hand you the outgoing page to animate out
 * without extra routing infrastructure (a dedicated transition router),
 * and a half-working exit animation would be worse than a clean,
 * reliable entrance. Scope boundary noted here rather than left
 * unstated.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        // GSAP leaves the tweened properties as inline styles (e.g. a
        // `transform: matrix(...)`) once the animation completes. Left in
        // place, that transform makes this wrapper a new containing block
        // for every `position: absolute` descendant on the page (the Hero
        // background image, PageHero backgrounds, etc.), breaking their
        // `inset-0` positioning against their own nearest positioned
        // ancestor. clearProps strips the inline style after the tween so
        // the wrapper goes back to fully un-styled once the animation is
        // done — caught by actually loading the homepage in a browser,
        // not by code review (it compiled and looked correct on paper).
        clearProps: "transform,opacity",
      }
    );
  }, [pathname, prefersReducedMotion]);

  return (
    <div key={pathname} ref={containerRef}>
      {children}
    </div>
  );
}
