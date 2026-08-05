"use client";

import type { MenuFilterState } from "@/types/menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

type TagFilterKey = "onlyPopular" | "onlyChefsPick" | "onlyNew" | "onlyVegetarian" | "onlySpicy";

interface FilterPanelProps {
  filters: MenuFilterState;
  priceBounds: [number, number];
  currency: string;
  onChange: (patch: Partial<MenuFilterState>) => void;
}

const TAG_CHECKBOXES: { key: TagFilterKey; label: string }[] = [
  { key: "onlyPopular", label: "Popular" },
  { key: "onlyChefsPick", label: "Chef's Pick" },
  { key: "onlyNew", label: "New" },
  { key: "onlyVegetarian", label: "Vegetarian" },
  { key: "onlySpicy", label: "Spicy" },
];

export function FilterPanel({ filters, priceBounds, currency, onChange }: FilterPanelProps) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold">Price Range</span>
          <span className="text-xs text-muted-foreground">
            {currency} {filters.minPrice} – {currency} {filters.maxPrice}
          </span>
        </div>
        <Slider
          min={priceBounds[0]}
          max={priceBounds[1]}
          step={1}
          value={[filters.minPrice, filters.maxPrice]}
          onValueChange={([min, max]) => onChange({ minPrice: min, maxPrice: max })}
          aria-label="Price range"
        />
      </div>

      <div>
        <span className="mb-3 block text-sm font-semibold">Tags</span>
        <div className="flex flex-col gap-3">
          {TAG_CHECKBOXES.map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <Checkbox
                checked={Boolean(filters[key])}
                onCheckedChange={(checked) =>
                  onChange({ [key]: checked === true } as Partial<MenuFilterState>)
                }
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
