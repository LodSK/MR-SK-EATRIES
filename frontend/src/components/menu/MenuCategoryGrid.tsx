"use client";

import type { FoodCategory } from "@/types/menu";
import { CategoryCard } from "@/components/home/CategoryCard";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

interface MenuCategoryGridProps {
  categories: FoodCategory[];
}

/**
 * Client wrapper around the (server-rendered) category grid on `/menu` —
 * `useScrollReveal` needs a ref, so the stagger-reveal container has to be
 * a client component. Visual treatment matches the homepage Categories
 * section's stagger-in for continuity between the two pages.
 */
export function MenuCategoryGrid({ categories }: MenuCategoryGridProps) {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.08 });

  return (
    <div ref={ref} className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
      {categories.map((category) => (
        <CategoryCard key={category.slug} category={category} />
      ))}
    </div>
  );
}
