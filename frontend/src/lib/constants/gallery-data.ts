import type { MenuCategorySlug } from "@/types/menu";

export type GalleryFilter = MenuCategorySlug | "ambiance" | "all";

export interface GalleryItem {
  id: string;
  caption: string;
  filter: GalleryFilter;
  /** Drives which real photo renders — see lib/constants/media.ts's CATEGORY_IMAGE. */
  category?: MenuCategorySlug;
  /** For "ambiance" items (no category) — key into media.ts's GALLERY_AMBIANCE_IMAGE. */
  ambianceImageKey?: string;
  tall?: boolean;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: "g1", caption: "Golden hour on the patio", filter: "ambiance", ambianceImageKey: "gallery-ambiance-patio", tall: true },
  { id: "g2", caption: "Weekend brunch spread", filter: "breakfast", category: "breakfast" },
  { id: "g3", caption: "Smoked old fashioned, tableside", filter: "drinks", category: "drinks" },
  { id: "g4", caption: "Fresh off the wood-fired grill", filter: "dinner", category: "dinner" },
  { id: "g5", caption: "The open kitchen at service", filter: "ambiance", ambianceImageKey: "gallery-ambiance-kitchen", tall: true },
  { id: "g6", caption: "Chocolate fondant, always a yes", filter: "desserts", category: "desserts" },
  { id: "g7", caption: "Handcrafted wood-fired pizza", filter: "lunch", category: "pizza" },
  { id: "g8", caption: "Private dining room, set for six", filter: "ambiance", ambianceImageKey: "gallery-ambiance-private-dining" },
  { id: "g9", caption: "Sunday reservations, fully booked", filter: "ambiance", ambianceImageKey: "gallery-ambiance-busy-dining", tall: true },
  { id: "g10", caption: "Seasonal cocktail menu launch", filter: "drinks", category: "drinks" },
  { id: "g11", caption: "Slow-smoked chicken, resting", filter: "dinner", category: "chicken" },
  { id: "g12", caption: "The bar at golden hour", filter: "ambiance", ambianceImageKey: "gallery-ambiance-bar" },
  { id: "g13", caption: "Catch of the day, plated", filter: "dinner", category: "seafood" },
  { id: "g14", caption: "Behind the pass this morning", filter: "breakfast", category: "breakfast" },
  { id: "g15", caption: "Burger night, done right", filter: "lunch", category: "burgers", tall: true },
  { id: "g16", caption: "Fireside seating, evening service", filter: "ambiance", ambianceImageKey: "gallery-ambiance-fireplace" },
];

export const GALLERY_FILTERS: { value: GalleryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "ambiance", label: "Ambiance" },
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "drinks", label: "Drinks" },
  { value: "desserts", label: "Desserts" },
];
