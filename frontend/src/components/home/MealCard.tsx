"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Plus } from "lucide-react";
import type { FeaturedMeal } from "@/types/menu";
import { CATEGORY_IMAGE } from "@/lib/constants/media";
import { Rating } from "@/components/shared/Rating";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { fadeUp } from "@/lib/animations/variants";
import { useCart } from "@/lib/hooks/useCart";
import { useImageReveal } from "@/lib/hooks/useImageReveal";
import { gsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface MealCardProps {
  meal: FeaturedMeal;
}

const TAG_STYLES: Record<NonNullable<FeaturedMeal["tag"]>, string> = {
  New: "bg-brand-accent text-brand-secondary",
  Popular: "bg-brand-primary text-white",
  "Chef's Pick": "bg-brand-secondary text-brand-accent",
};

export function MealCard({ meal }: MealCardProps) {
  const { addItem } = useCart();
  const imageRevealRef = useImageReveal<HTMLDivElement>();
  const cardRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Sprint 17 — richer GSAP hover (lift + scale + shadow depth) replacing
  // the plain Framer `whileHover={{ y: -6 }}`; entrance stays on Framer's
  // `fadeUp` below, this only owns the hover interaction.
  function handleHoverStart() {
    if (prefersReducedMotion || !cardRef.current) return;
    gsap.to(cardRef.current, {
      y: -8,
      scale: 1.015,
      boxShadow: "0 24px 48px -12px rgb(0 0 0 / 0.25)",
      duration: 0.35,
      ease: "power2.out",
    });
  }

  function handleHoverEnd() {
    if (prefersReducedMotion || !cardRef.current) return;
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      duration: 0.35,
      ease: "power2.out",
    });
  }

  return (
    <motion.article
      ref={cardRef}
      variants={fadeUp}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <div ref={imageRevealRef} className="relative h-52 overflow-hidden">
        <Image
          src={CATEGORY_IMAGE[meal.category]}
          alt={meal.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" aria-hidden="true" />

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
          <Button
            type="button"
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() =>
              addItem({
                id: meal.id,
                name: meal.name,
                category: meal.category,
                price: meal.price,
                currency: meal.currency,
              })
            }
          >
            <Plus className="h-4 w-4" />
            Add to Order
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/menu/${meal.category}`}>View</Link>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
