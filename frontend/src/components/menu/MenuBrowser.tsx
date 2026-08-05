"use client";

import * as React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { FoodCategory, MenuFilterState, MenuItem } from "@/types/menu";
import { filterAndSortMenuItems, createDefaultMenuFilters } from "@/lib/utils/filterMenuItems";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { SearchBar } from "@/components/menu/SearchBar";
import { CategoryFilter } from "@/components/menu/CategoryFilter";
import { SortDropdown } from "@/components/menu/SortDropdown";
import { FilterPanel } from "@/components/menu/FilterPanel";
import { MenuGrid } from "@/components/menu/MenuGrid";
import { Button } from "@/components/ui/button";

interface MenuBrowserProps {
  items: MenuItem[];
  categories?: FoodCategory[];
  priceBounds: [number, number];
  currency: string;
  /** When set, the category filter is hidden and locked to this value (used on /menu/[category]). */
  lockedCategory?: MenuFilterState["category"];
}

export function MenuBrowser({
  items,
  categories = [],
  priceBounds,
  currency,
  lockedCategory,
}: MenuBrowserProps) {
  const defaultFilters = React.useMemo(
    () => createDefaultMenuFilters(priceBounds, lockedCategory ?? "all"),
    [priceBounds, lockedCategory]
  );

  const [searchInput, setSearchInput] = React.useState("");
  const [filters, setFilters] = React.useState<MenuFilterState>(defaultFilters);
  const [showFilters, setShowFilters] = React.useState(false);

  const debouncedSearch = useDebouncedValue(searchInput, 250);

  const activeFilters = React.useMemo<MenuFilterState>(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  );

  const results = React.useMemo(
    () => filterAndSortMenuItems(items, activeFilters),
    [items, activeFilters]
  );

  function patchFilters(patch: Partial<MenuFilterState>) {
    setFilters((prev) => ({ ...prev, ...patch }));
  }

  function resetFilters() {
    setSearchInput("");
    setFilters(defaultFilters);
  }

  const hasActiveFilters =
    filters.onlyPopular ||
    filters.onlyChefsPick ||
    filters.onlyNew ||
    filters.onlyVegetarian ||
    filters.onlySpicy ||
    filters.minPrice !== priceBounds[0] ||
    filters.maxPrice !== priceBounds[1];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <SearchBar value={searchInput} onChange={setSearchInput} className="flex-1" />
        <div className="flex items-center gap-2">
          <SortDropdown value={filters.sort} onChange={(sort) => patchFilters({ sort })} />
          <Button
            type="button"
            variant={hasActiveFilters ? "default" : "outline"}
            size="default"
            onClick={() => setShowFilters((v) => !v)}
            className="shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {!lockedCategory && (
        <CategoryFilter
          categories={categories}
          active={filters.category}
          onChange={(category) => patchFilters({ category })}
        />
      )}

      {showFilters && (
        <div className="relative">
          <FilterPanel
            filters={filters}
            priceBounds={priceBounds}
            currency={currency}
            onChange={patchFilters}
          />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-primary hover:underline dark:text-brand-accent"
            >
              <X className="h-3 w-3" />
              Clear all filters
            </button>
          )}
        </div>
      )}

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {results.length} {results.length === 1 ? "dish" : "dishes"} found
      </p>

      <MenuGrid items={results} onResetFilters={resetFilters} />
    </div>
  );
}
