"use client";

import { motion } from "framer-motion";
import type { TrustIndicator } from "@/types/about";
import { fadeUp } from "@/lib/animations/variants";

interface TrustIndicatorCardProps {
  indicator: TrustIndicator;
}

export function TrustIndicatorCard({ indicator }: TrustIndicatorCardProps) {
  const Icon = indicator.icon;

  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-7"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-secondary text-brand-accent">
          <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <span className="font-display text-3xl font-bold text-brand-primary dark:text-brand-accent">
          {indicator.stat}
        </span>
      </div>
      <h3 className="font-display text-lg font-bold">{indicator.title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{indicator.description}</p>
    </motion.div>
  );
}
