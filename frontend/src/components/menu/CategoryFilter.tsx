"use client";

import type { FoodCategory, MenuCategorySlug } from "@/types/menu";
import { cn } from "@/lib/utils/cn";

interface CategoryFilterProps {
  categories: FoodCategory[];
  active: MenuCategorySlug | "all";
  onChange: (category: MenuCategorySlug | "all") => void;
}

export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div role="tablist" aria-label="Filter by category" className="flex flex-wrap gap-2">
      <button
        type="button"
        role="tab"
        aria-selected={active === "all"}
        onClick={() => onChange("all")}
        className={cn(
          "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          active === "all"
            ? "border-brand-primary bg-brand-primary text-white dark:border-brand-accent dark:bg-brand-accent dark:text-brand-secondary"
            : "border-border text-muted-foreground hover:border-brand-primary/50 hover:text-foreground"
        )}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.slug}
          type="button"
          role="tab"
          aria-selected={active === category.slug}
          onClick={() => onChange(category.slug)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            active === category.slug
              ? "border-brand-primary bg-brand-primary text-white dark:border-brand-accent dark:bg-brand-accent dark:text-brand-secondary"
              : "border-border text-muted-foreground hover:border-brand-primary/50 hover:text-foreground"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
