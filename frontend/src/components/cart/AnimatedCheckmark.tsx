"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface AnimatedCheckmarkProps {
  className?: string;
}

/**
 * A hand-drawn SVG checkmark (not the Lucide icon) so the path length is
 * known and `stroke-dashoffset` can animate a genuine "draw-in" rather than
 * a scale/fade. Used for order-confirmation and payment-success moments —
 * see CheckoutPageContent.tsx and CheckoutVerifyContent.tsx.
 */
export function AnimatedCheckmark({ className }: AnimatedCheckmarkProps) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;

    const length = el.getTotalLength();

    if (prefersReducedMotion) {
      gsap.set(el, { strokeDasharray: length, strokeDashoffset: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration: 0.6, delay: 0.15, ease: "power2.out" }
      );
    }, el);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        ref={pathRef}
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
