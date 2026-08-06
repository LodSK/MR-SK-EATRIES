"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

const ENTER_DURATION = 0.5;
const EXIT_DURATION = 0.28;

/**
 * GSAP Phase, extended Sprint 17 — route/page transitions.
 *
 * Holds the *previous* route's already-rendered children in local state
 * while the incoming `children` prop sits unused until the exit tween
 * finishes, then swaps to it — a deliberate ~0.28s hold, not a bug.
 *
 * Sprint 17 Finalization fix: the entrance effect used to key off
 * `displayedChildren` itself. Next's App Router passes `children` as a
 * stable routing-slot reference — the same object identity across every
 * navigation, since the actual segment swap happens *inside* that
 * reference via router context, not by Next handing this component a new
 * element tree per route. That meant `children === displayedChildren` was
 * true from the first render onward, so `setDisplayedChildren(children)`
 * was always a same-reference no-op React bails out of — the entrance
 * effect's dependency never changed, so it never re-ran after the initial
 * mount. The page's real content still updated (via Next's own router
 * context, independent of this component's props), but the wrapper div
 * was left stuck at the exit tween's `opacity: 0` forever: a real page
 * permanently blank after every client-side navigation, reproduced and
 * confirmed live (computed style `opacity: 0` on the wrapper, correct
 * content already present underneath). `displayedPathname` is a plain
 * string and reliably changes value per route, so keying off that instead
 * guarantees the entrance effect actually fires.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [displayedChildren, setDisplayedChildren] = useState(children);
  const [displayedPathname, setDisplayedPathname] = useState(pathname);

  // Route changed: exit-tween the still-displayed (old) content, then swap
  // to the new children only once that finishes.
  useEffect(() => {
    if (pathname === displayedPathname) return;

    if (prefersReducedMotion || !containerRef.current) {
      setDisplayedChildren(children);
      setDisplayedPathname(pathname);
      return;
    }

    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -14,
        duration: EXIT_DURATION,
        ease: "power2.in",
        onComplete: () => {
          setDisplayedChildren(children);
          setDisplayedPathname(pathname);
        },
      });
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // New content just swapped in: entrance tween. Keyed on `displayedPathname`
  // (a primitive that reliably changes per route) rather than
  // `displayedChildren` (see the correctness note above the component).
  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: ENTER_DURATION,
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
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedPathname]);

  return <div ref={containerRef}>{displayedChildren}</div>;
}
