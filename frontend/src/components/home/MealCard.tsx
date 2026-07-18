"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Plus } from "lucide-react";
import type { FeaturedMeal } from "@/types/menu";
import { CATEGORY_ICON } from "@/lib/constants/homepage-data";
import { Rating } from "@/components/shared/Rating";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { fadeUp } from "@/lib/animations/variants";

interface MealCardProps {
  meal: FeaturedMeal;
}

const TAG_STYLES: Record<NonNullable<FeaturedMeal["tag"]>, string> = {
  New: "bg-brand-accent text-brand-secondary",
  Popular: "bg-brand-primary text-white",
  "Chef's Pick": "bg-brand-secondary text-brand-accent",
};

export function MealCard({ meal }: MealCardProps) {
  const Icon = CATEGORY_ICON[meal.category];

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl"
    >
      {/* Media — designed placeholder until food photography is added */}
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-secondary via-brand-secondary to-brand-primary-dark">
        <div className="bg-noise absolute inset-0 opacity-[0.05]" aria-hidden="true" />
        <Icon
          className="h-16 w-16 text-white/25 transition-transform duration-500 group-hover:scale-110 group-hover:text-white/35"
          strokeWidth={1.25}
          aria-hidden="true"
        />

        {meal.tag && (
          <span
            className={cn(
              "absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide",
              TAG_STYLES[meal.tag]
            )}
          >
            {meal.tag}
          </span>
        )}

        <button
          type="button"
          aria-label={`Add ${meal.name} to wishlist`}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
        >
          {/* Wired to the wishlist store in Sprint 7 */}
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold leading-snug">{meal.name}</h3>
          <span className="whitespace-nowrap font-display text-lg font-bold text-brand-primary dark:text-brand-accent">
            {meal.currency} {meal.price}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {meal.description}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <Rating value={meal.rating} reviewCount={meal.reviewCount} />
          <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold capitalize text-muted-foreground">
            {meal.category}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link href={`/order?item=${meal.id}`}>
              <Plus className="h-4 w-4" />
              Add to Order
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/menu/${meal.category}#${meal.id}`}>View</Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
