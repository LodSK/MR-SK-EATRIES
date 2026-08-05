"use client";

import { motion } from "framer-motion";
import type { MenuItem } from "@/types/menu";
import { MenuCard } from "@/components/menu/MenuCard";
import { MenuGridSkeleton } from "@/components/menu/MenuCardSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { staggerContainer } from "@/lib/animations/variants";

interface MenuGridProps {
  items: MenuItem[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onResetFilters?: () => void;
}

export function MenuGrid({
  items,
  isLoading = false,
  emptyTitle = "No dishes match your filters",
  emptyDescription = "Try widening your search, clearing a filter, or browsing a different category.",
  onResetFilters,
}: MenuGridProps) {
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
