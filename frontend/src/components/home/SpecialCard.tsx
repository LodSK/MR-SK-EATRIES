"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import type { SpecialOffer } from "@/types/menu";
import { CATEGORY_ICON } from "@/lib/constants/homepage-data";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations/variants";

interface SpecialCardProps {
  special: SpecialOffer;
}

export function SpecialCard({ special }: SpecialCardProps) {
  const Icon = CATEGORY_ICON[special.category];

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-primary/20 bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-primary-dark via-brand-secondary to-brand-secondary">
        <div className="bg-noise absolute inset-0 opacity-[0.05]" aria-hidden="true" />
        <Icon
          className="h-14 w-14 text-white/25 transition-transform duration-500 group-hover:scale-110"
          strokeWidth={1.25}
          aria-hidden="true"
        />

        <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-brand-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-secondary">
          <Flame className="h-3 w-3" />
          {special.badge}
        </span>

        <span className="absolute right-3 top-3 rounded-full bg-brand-primary px-3 py-1 text-[11px] font-bold text-white">
          -{special.discountPercent}%
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-bold leading-snug">{special.name}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {special.description}
        </p>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold text-brand-primary dark:text-brand-accent">
            {special.currency} {special.discountedPrice}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            {special.currency} {special.originalPrice}
          </span>
        </div>

        <Button asChild variant="default" className="mt-2 w-full">
          <Link href={`/order?item=${special.id}`}>Order Now</Link>
        </Button>
      </div>
    </motion.article>
  );
}
