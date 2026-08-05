"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import type { SpecialOffer } from "@/types/menu";
import { CATEGORY_IMAGE } from "@/lib/constants/media";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations/variants";
import { useCart } from "@/lib/hooks/useCart";
import { useImageReveal } from "@/lib/hooks/useImageReveal";

interface SpecialCardProps {
  special: SpecialOffer;
}

export function SpecialCard({ special }: SpecialCardProps) {
  const { addItem } = useCart();
  const imageRevealRef = useImageReveal<HTMLDivElement>();

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-brand-primary/20 bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      <div ref={imageRevealRef} className="relative h-44 overflow-hidden">
        <Image
          src={CATEGORY_IMAGE[special.category]}
          alt={special.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" aria-hidden="true" />

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

        <Button
          type="button"
          variant="default"
          className="mt-2 w-full"
          onClick={() =>
            addItem({
              id: special.id,
              name: special.name,
              category: special.category,
              price: special.discountedPrice,
              currency: special.currency,
            })
          }
        >
          Order Now
        </Button>
      </div>
    </motion.article>
  );
}
