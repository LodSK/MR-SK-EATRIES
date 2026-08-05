"use client";

import { useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  /** Formats the animated number each frame — defaults to a plain locale-formatted integer. */
  format?: (value: number) => string;
}

/**
 * GSAP Phase — animates from 0 to `value` via a tweened proxy object
 * (the standard GSAP count-up pattern) rather than React state per
 * frame, so the animation runs on GSAP's ticker without triggering a
 * re-render on every tick. Scroll-triggered like every other reveal in
 * this phase, so cards further down a long dashboard still animate when
 * they scroll into view rather than all firing at once on mount.
 */
export function StatCard({ icon: Icon, value, label, format }: StatCardProps) {
  const valueRef = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = valueRef.current;
    if (!el) return;

    const formatValue = format ?? ((n: number) => Math.round(n).toLocaleString());

    if (prefersReducedMotion) {
      el.textContent = formatValue(value);
      return;
    }

    const counter = { current: 0 };
    const tween = gsap.to(counter, {
      current: value,
      duration: 1.4,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = formatValue(counter.current);
      },
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prefersReducedMotion]);

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary dark:bg-brand-accent/10 dark:text-brand-accent">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <div>
        <p ref={valueRef} className="font-display text-2xl font-bold leading-none">
          {format ? format(0) : "0"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
