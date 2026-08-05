export type MealTag = "New" | "Popular" | "Chef's Pick";

export type MenuCategorySlug =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "burgers"
  | "pizza"
  | "chicken"
  | "seafood"
  | "desserts"
  | "drinks";

export interface FeaturedMeal {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  category: MenuCategorySlug;
  tag?: MealTag;
}

export interface FoodCategory {
  slug: MenuCategorySlug;
  name: string;
  description: string;
  itemCount: number;
}

export interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  category: MenuCategorySlug;
  originalPrice: number;
  discountedPrice: number;
  currency: string;
  discountPercent: number;
  badge: string;
}

export interface NutritionInfo {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

/**
 * Full menu item entity — the canonical shape for the dynamic Menu System
 * (Sprint 6). Distinct from `FeaturedMeal` (a lightweight homepage preview
 * type from Sprint 3) because the detail page needs considerably more
 * data. Every field here is plain, serializable data — no functions or
 * icon components — so this type is always safe to pass from a Server
 * Component to a Client Component.
 */
export interface MenuItem {
  id: string;
  /** URL slug for the detail route: /menu/[category]/[slug] */
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: MenuCategorySlug;
  price: number;
  currency: string;
  rating: number;
  reviewCount: number;
  prepTimeMinutes: number;
  tag?: MealTag;
  isVegetarian: boolean;
  isSpicy: boolean;
  isAvailable: boolean;
  isFeatured: boolean;
  stockQuantity: number;
  /** Drives the "Popularity" sort option — independent of the review count. */
  popularityScore: number;
  /** ISO date string — drives the "Newest" sort option. */
  createdAt: string;
  ingredients: string[];
  nutrition: NutritionInfo;
  /** Number of placeholder gallery tiles to render on the detail page. */
  galleryCount: number;
}

export type MenuSortOption = "popularity" | "price-asc" | "price-desc" | "rating" | "newest";

export interface MenuFilterState {
  search: string;
  category: MenuCategorySlug | "all";
  minPrice: number;
  maxPrice: number;
  onlyPopular: boolean;
  onlyChefsPick: boolean;
  onlyNew: boolean;
  onlyVegetarian: boolean;
  onlySpicy: boolean;
  sort: MenuSortOption;
}
