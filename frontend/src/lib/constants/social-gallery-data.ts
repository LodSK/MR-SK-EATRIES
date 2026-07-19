import type { MenuCategorySlug } from "@/types/menu";

export interface SocialPost {
  id: string;
  caption: string;
  category: MenuCategorySlug;
  /** Some grid cells span two rows for a masonry feel — purely presentational. */
  tall?: boolean;
}

/**
 * Placeholder gallery entries styled as designed gradient tiles (matching
 * the rest of the site's no-stock-photo approach) until real photography
 * and a live Instagram Graph API feed are wired in.
 */
export const SOCIAL_POSTS: SocialPost[] = [
  { id: "p1", caption: "Golden hour on the patio 🌇", category: "dinner", tall: true },
  { id: "p2", caption: "Saturday brunch, sorted", category: "breakfast" },
  { id: "p3", caption: "Fresh off the grill", category: "lunch" },
  { id: "p4", caption: "Smoked old fashioned, tableside", category: "drinks" },
  { id: "p5", caption: "Chocolate fondant, always a yes", category: "desserts", tall: true },
  { id: "p6", caption: "Sunday reservations filling fast", category: "dinner" },
  { id: "p7", caption: "Behind the pass this morning", category: "breakfast" },
  { id: "p8", caption: "New seasonal cocktail menu", category: "drinks" },
];
