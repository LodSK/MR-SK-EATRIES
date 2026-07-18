export type MealTag = "New" | "Popular" | "Chef's Pick";

export type MenuCategorySlug = "breakfast" | "lunch" | "dinner" | "desserts" | "drinks";

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
