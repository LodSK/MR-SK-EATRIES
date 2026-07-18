"use client";

import { HOME_STATS } from "@/lib/constants/homepage-data";
import { StatCounter } from "@/components/home/StatCounter";

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-brand-secondary py-20 sm:py-24">
      <div className="bg-noise absolute inset-0 opacity-[0.04]" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-primary/20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="section-container relative grid grid-cols-2 gap-10 lg:grid-cols-4">
        {HOME_STATS.map((stat) => (
          <StatCounter key={stat.label} stat={stat} />
        ))}
      </div>
    </section>
  );
}
