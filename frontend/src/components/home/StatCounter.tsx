"use client";

import { useInView } from "react-intersection-observer";
import type { StatItem } from "@/types/home";
import { useCountUp } from "@/lib/hooks/useCountUp";

interface StatCounterProps {
  stat: StatItem;
}

export function StatCounter({ stat }: StatCounterProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });
  const value = useCountUp({ end: stat.value, start: inView, duration: 1800 });
  const Icon = stat.icon;

  return (
    <div ref={ref} className="flex flex-col items-center gap-3 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-brand-accent">
        <Icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <span className="font-display text-4xl font-bold text-white sm:text-5xl">
        {value.toLocaleString()}
        {stat.suffix}
      </span>
      <span className="text-sm font-medium uppercase tracking-wide text-white/60">
        {stat.label}
      </span>
    </div>
  );
}
