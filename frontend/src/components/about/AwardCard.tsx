"use client";

import { motion } from "framer-motion";
import type { AwardItem } from "@/types/about";
import { fadeUp } from "@/lib/animations/variants";

interface AwardCardProps {
  award: AwardItem;
}

export function AwardCard({ award }: AwardCardProps) {
  const Icon = award.icon;

  return (
    <motion.article
      variants={fadeUp}
      className="flex flex-col items-center gap-3 rounded-2xl border border-brand-accent/30 bg-card p-6 text-center transition-colors duration-300 hover:border-brand-accent"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-accent/15 text-brand-accent">
        <Icon className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h3 className="font-display text-base font-bold leading-snug">{award.title}</h3>
      <p className="text-xs text-muted-foreground">{award.issuer}</p>
      <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-bold text-muted-foreground">
        {award.year}
      </span>
    </motion.article>
  );
}
