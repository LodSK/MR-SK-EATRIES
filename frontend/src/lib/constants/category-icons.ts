import {
  Beef,
  Coffee,
  Drumstick,
  Fish,
  GlassWater,
  IceCream2,
  Pizza,
  Sandwich,
  UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { MenuCategorySlug } from "@/types/menu";

/**
 * Single source of truth mapping every menu category to its icon.
 * Consumed by the homepage (Categories, Featured Meals, Today's Specials,
 * Instagram Gallery) and the Menu System (Sprint 6) alike.
 */
export const CATEGORY_ICON: Record<MenuCategorySlug, LucideIcon> = {
  breakfast: Coffee,
  lunch: Sandwich,
  dinner: UtensilsCrossed,
  burgers: Beef,
  pizza: Pizza,
  chicken: Drumstick,
  seafood: Fish,
  desserts: IceCream2,
  drinks: GlassWater,
};
