"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { MenuItem } from "@/types/menu";
import { MenuCard } from "@/components/menu/MenuCard";
import { MenuGridSkeleton } from "@/components/menu/MenuCardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { staggerContainer } from "@/lib/animations/variants";
import { gsap, Flip } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

interface MenuGridProps {
  items: MenuItem[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onResetFilters?: () => void;
}

/**
 * Smoothly re-flows cards (rather than an instant snap) when `items`
 * changes shape/order — e.g. a filter or sort applied above this grid.
 * GSAP Flip needs "before" positions captured synchronously before the
 * DOM mutates, which a props-driven child can't hook directly (React has
 * already committed the new list by the time any effect fires here) — so
 * the "before" state is instead the *previous* render's post-commit
 * snapshot, stored in a ref at the end of every layout-effect run. This
 * is Flip's standard integration pattern for externally-controlled lists,
 * not a workaround specific to this component.
 */
function useMenuGridFlip(containerRef: React.RefObject<HTMLDivElement | null>, items: MenuItem[]) {
  const prevStateRef = useRef<Flip.FlipState | null>(null);
  const isFirstRun = useRef(true);
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const targets = Array.from(el.children) as HTMLElement[];
    if (targets.length === 0) return;

    if (!isFirstRun.current && prevStateRef.current && !prefersReducedMotion) {
      // Only repositions persisting cards + fades out removed ones — newly
      // mounted cards keep their existing Framer Motion `fadeUp` entrance
      // (see MenuCard.tsx) rather than also getting a GSAP onEnter tween,
      // which would fight the same element's opacity/transform.
      Flip.from(prevStateRef.current, {
        targets,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.03,
        absolute: true,
        onLeave: (leavingEls) => gsap.to(leavingEls, { opacity: 0, scale: 0.92, duration: 0.25 }),
      });
    }

    isFirstRun.current = false;
    prevStateRef.current = Flip.getState(targets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);
}

export function MenuGrid({
  items,
  isLoading = false,
  emptyTitle = "No dishes match your filters",
  emptyDescription = "Try widening your search, clearing a filter, or browsing a different category.",
  onResetFilters,
}: MenuGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  useMenuGridFlip(gridRef, items);

  if (isLoading) {
    return <MenuGridSkeleton />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onResetFilters ? "Clear Filters" : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <>
      {/* Page heading (PageHero's h1) is followed directly by MenuCard's h3
          item names with nothing in between — a skipped heading level axe
          flags under heading-order. This introduces the grid without adding
          visible, redundant section copy under an already-descriptive hero. */}
      <h2 className="sr-only">Menu Items</h2>
      <motion.div
        ref={gridRef}
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </motion.div>
    </>
  );
}
