"use client";

import { ArrowUpDown } from "lucide-react";
import type { MenuSortOption } from "@/types/menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortDropdownProps {
  value: MenuSortOption;
  onChange: (value: MenuSortOption) => void;
}

const SORT_LABELS: Record<MenuSortOption, string> = {
  popularity: "Most Popular",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  rating: "Highest Rated",
  newest: "Newest",
};

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as MenuSortOption)}>
      <SelectTrigger className="w-full sm:w-52" aria-label="Sort menu items">
        <ArrowUpDown className="h-3.5 w-3.5 opacity-60" />
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(SORT_LABELS) as MenuSortOption[]).map((option) => (
          <SelectItem key={option} value={option}>
            {SORT_LABELS[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
