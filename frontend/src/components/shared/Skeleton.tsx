"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface SkeletonProps {
  className?: string;
  /**
   * Opt-in GSAP shimmer sweep, layered on top of the existing CSS
   * `animate-pulse` rather than replacing it — dozens of pre-existing
   * `<Skeleton />` call sites (admin tables, dashboard cards, menu grids)
   * rely on the plain pulse look today, and this stays their default so
   * none of them silently change appearance. Sprint 17's new route-level
   * loading states pass `shimmer` explicitly; admin loading states
   * deliberately don't, per the "functional, not cinematic" brief for
   * that tier. No-ops under `prefers-reduced-motion`.
   */
  shimmer?: boolean;
}

export function Skeleton({ className, shimmer = false }: SkeletonProps) {
  const sweepRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = sweepRef.current;
    if (!el || !shimmer || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { xPercent: -150 },
        { xPercent: 150, duration: 1.4, ease: "power1.inOut", repeat: -1, repeatDelay: 0.3 }
      );
    }, el);

    return () => ctx.revert();
  }, [shimmer, prefersReducedMotion]);

  return (
    <div
      className={cn("relative animate-pulse overflow-hidden rounded-md bg-muted", className)}
      role="presentation"
      aria-hidden="true"
    >
      {shimmer && !prefersReducedMotion && (
        <div
          ref={sweepRef}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      )}
    </div>
  );
}
