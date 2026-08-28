import type { MenuCategorySlug } from "@/types/menu";

/**
 * Single source of truth for every real photograph in the app — Media
 * System (Phase 3). Every value here is a real, royalty-free image
 * (Pexels License — free for commercial use, no attribution required),
 * currently served from `public/images/` as an interim hosting step
 * while Cloudinary credentials are still pending (see
 * PROJECT_STATUS.md's Media System section for the full manifest with
 * source URLs/photographers, and `scripts/upload-media-to-cloudinary.js`
 * for the ready-to-run migration once credentials exist).
 *
 * Migrating to Cloudinary later means changing only the values in this
 * one file — no component that imports from here needs to change.
 */

export const HERO_IMAGE = "/images/hero/hero-bright-dining-room.jpg";
export const MENU_HERO_IMAGE = "/images/menu/dinner.jpg";
export const GALLERY_HERO_IMAGE = "/images/gallery/ambiance-private-dining.jpg";

export const CATEGORY_IMAGE: Record<MenuCategorySlug, string> = {
  breakfast: "/images/menu/breakfast.jpg",
  lunch: "/images/menu/lunch.jpg",
  dinner: "/images/menu/dinner.jpg",
  burgers: "/images/menu/burgers.jpg",
  pizza: "/images/menu/pizza.jpg",
  chicken: "/images/menu/chicken.jpg",
  seafood: "/images/menu/seafood.jpg",
  desserts: "/images/menu/desserts.jpg",
  drinks: "/images/menu/drinks.jpg",
};

export const ABOUT_HERO_IMAGE = "/images/about/story-kitchen.jpg";
export const ABOUT_STORY_IMAGE = "/images/about/story-kitchen.jpg";

export const CHEF_IMAGE: Record<string, string> = {
  "chef-sarah": "/images/about/chef-sarah-boateng.jpg",
  "chef-daniel": "/images/about/chef-daniel-owusu.jpg",
  "chef-linda": "/images/about/chef-linda-asante.jpg",
};

export const GALLERY_AMBIANCE_IMAGE: Record<string, string> = {
  "gallery-ambiance-patio": "/images/gallery/ambiance-patio.jpg",
  "gallery-ambiance-kitchen": "/images/gallery/ambiance-kitchen.jpg",
  "gallery-ambiance-private-dining": "/images/gallery/ambiance-private-dining.jpg",
  "gallery-ambiance-busy-dining": "/images/gallery/ambiance-busy-dining.jpg",
  "gallery-ambiance-bar": "/images/gallery/ambiance-bar.jpg",
  "gallery-ambiance-fireplace": "/images/gallery/ambiance-fireplace.jpg",
};

/** Keyed by blog post slug — matches the seeded posts in backend/src/seed or admin-created posts by convention. */
export const BLOG_COVER_IMAGE: Record<string, string> = {
  "behind-the-smoke-how-we-build-our-signature-old-fashioned":
    "/images/blog/behind-the-smoke-how-we-build-our-signature-old-fashioned.jpg",
  "a-guide-to-our-seasonal-menu-philosophy": "/images/blog/a-guide-to-our-seasonal-menu-philosophy.jpg",
  "meet-the-kitchen-a-day-in-the-life-at-mrsk-eatries":
    "/images/blog/meet-the-kitchen-a-day-in-the-life-at-mrsk-eatries.jpg",
  "pairing-notes-what-to-drink-with-every-dish-on-our-menu":
    "/images/blog/pairing-notes-what-to-drink-with-every-dish-on-our-menu.jpg",
  "from-farm-to-table-where-our-ingredients-come-from":
    "/images/blog/from-farm-to-table-where-our-ingredients-come-from.jpg",
};

/** Real local photography used for social/editorial tiles until live social media is connected. */
export const SOCIAL_IMAGE_POOL = [
  "/images/gallery/ambiance-patio.jpg",
  "/images/menu/breakfast.jpg",
  "/images/menu/drinks.jpg",
  "/images/menu/dinner.jpg",
  "/images/gallery/ambiance-kitchen.jpg",
  "/images/menu/desserts.jpg",
  "/images/menu/pizza.jpg",
  "/images/gallery/ambiance-private-dining.jpg",
];
