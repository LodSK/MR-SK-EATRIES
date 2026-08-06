"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface AnimatedCrossProps {
  className?: string;
}

/** Failure-state companion to AnimatedCheckmark.tsx — same draw-in technique, two strokes in sequence. */
export function AnimatedCross({ className }: AnimatedCrossProps) {
  const path1Ref = useRef<SVGPathElement | null>(null);
  const path2Ref = useRef<SVGPathElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el1 = path1Ref.current;
    const el2 = path2Ref.current;
    if (!el1 || !el2) return;

    const len1 = el1.getTotalLength();
    const len2 = el2.getTotalLength();

    if (prefersReducedMotion) {
      gsap.set(el1, { strokeDasharray: len1, strokeDashoffset: 0 });
      gsap.set(el2, { strokeDasharray: len2, strokeDashoffset: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.15 })
        .fromTo(el1, { strokeDasharray: len1, strokeDashoffset: len1 }, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" })
        .fromTo(el2, { strokeDasharray: len2, strokeDashoffset: len2 }, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, "-=0.05");
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path ref={path1Ref} d="M6 6l12 12" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
      <path ref={path2Ref} d="M18 6L6 18" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
    </svg>
  );
}
