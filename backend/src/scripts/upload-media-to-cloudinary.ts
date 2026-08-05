/**
 * Media System migration — uploads every image in frontend/public/images/
 * to Cloudinary, then rewrites frontend/src/lib/constants/media.ts so
 * every component that imports from there picks up the new hosted URLs
 * automatically. No component changes needed on either side of this run.
 *
 * Run with (from backend/, after real CLOUDINARY_* credentials are set in .env):
 *   npx ts-node --transpile-only -r tsconfig-paths/register src/scripts/upload-media-to-cloudinary.ts
 *
 * Safe to re-run — re-uploads and overwrites media.ts with fresh URLs
 * each time (Cloudinary dedupes identical uploads by default).
 */
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { env } from "@/config/env";

const looksLikePlaceholder = (value: string) => !value || value.startsWith("replace_with");

if (
  looksLikePlaceholder(env.cloudinary.cloudName) ||
  looksLikePlaceholder(env.cloudinary.apiKey) ||
  looksLikePlaceholder(env.cloudinary.apiSecret)
) {
  console.error(
    "[media-migration] CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET in backend/.env are still placeholder values — aborting. Nothing was uploaded or changed. Set real credentials from your Cloudinary dashboard first."
  );
  process.exit(1);
}

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

const PUBLIC_IMAGES_DIR = path.resolve(__dirname, "../../../frontend/public/images");
const MEDIA_CONSTANTS_FILE = path.resolve(__dirname, "../../../frontend/src/lib/constants/media.ts");

interface MediaSlot {
  /** Relative to PUBLIC_IMAGES_DIR, e.g. "menu/breakfast.jpg" */
  localPath: string;
  cloudinaryFolder: string;
}

const HERO: MediaSlot = { localPath: "hero/hero-bright-dining-room.jpg", cloudinaryFolder: "mrsk-eatries/hero" };

const CATEGORY_SLOTS: Record<string, MediaSlot> = {
  breakfast: { localPath: "menu/breakfast.jpg", cloudinaryFolder: "mrsk-eatries/menu" },
  lunch: { localPath: "menu/lunch.jpg", cloudinaryFolder: "mrsk-eatries/menu" },
  dinner: { localPath: "menu/dinner.jpg", cloudinaryFolder: "mrsk-eatries/menu" },
  burgers: { localPath: "menu/burgers.jpg", cloudinaryFolder: "mrsk-eatries/menu" },
  pizza: { localPath: "menu/pizza.jpg", cloudinaryFolder: "mrsk-eatries/menu" },
  chicken: { localPath: "menu/chicken.jpg", cloudinaryFolder: "mrsk-eatries/menu" },
  seafood: { localPath: "menu/seafood.jpg", cloudinaryFolder: "mrsk-eatries/menu" },
  desserts: { localPath: "menu/desserts.jpg", cloudinaryFolder: "mrsk-eatries/menu" },
  drinks: { localPath: "menu/drinks.jpg", cloudinaryFolder: "mrsk-eatries/menu" },
};

const ABOUT_HERO: MediaSlot = { localPath: "about/story-kitchen.jpg", cloudinaryFolder: "mrsk-eatries/about" };
const ABOUT_STORY: MediaSlot = { localPath: "about/story-kitchen.jpg", cloudinaryFolder: "mrsk-eatries/about" };

const CHEF_SLOTS: Record<string, MediaSlot> = {
  "chef-sarah": { localPath: "about/chef-sarah-boateng.jpg", cloudinaryFolder: "mrsk-eatries/about" },
  "chef-daniel": { localPath: "about/chef-daniel-owusu.jpg", cloudinaryFolder: "mrsk-eatries/about" },
  "chef-linda": { localPath: "about/chef-linda-asante.jpg", cloudinaryFolder: "mrsk-eatries/about" },
};

const GALLERY_SLOTS: Record<string, MediaSlot> = {
  "gallery-ambiance-patio": { localPath: "gallery/ambiance-patio.jpg", cloudinaryFolder: "mrsk-eatries/gallery" },
  "gallery-ambiance-kitchen": { localPath: "gallery/ambiance-kitchen.jpg", cloudinaryFolder: "mrsk-eatries/gallery" },
  "gallery-ambiance-private-dining": {
    localPath: "gallery/ambiance-private-dining.jpg",
    cloudinaryFolder: "mrsk-eatries/gallery",
  },
  "gallery-ambiance-busy-dining": {
    localPath: "gallery/ambiance-busy-dining.jpg",
    cloudinaryFolder: "mrsk-eatries/gallery",
  },
  "gallery-ambiance-bar": { localPath: "gallery/ambiance-bar.jpg", cloudinaryFolder: "mrsk-eatries/gallery" },
  "gallery-ambiance-fireplace": {
    localPath: "gallery/ambiance-fireplace.jpg",
    cloudinaryFolder: "mrsk-eatries/gallery",
  },
};

const BLOG_SLOTS: Record<string, MediaSlot> = {
  "behind-the-smoke-how-we-build-our-signature-old-fashioned": {
    localPath: "blog/behind-the-smoke-how-we-build-our-signature-old-fashioned.jpg",
    cloudinaryFolder: "mrsk-eatries/blog",
  },
  "a-guide-to-our-seasonal-menu-philosophy": {
    localPath: "blog/a-guide-to-our-seasonal-menu-philosophy.jpg",
    cloudinaryFolder: "mrsk-eatries/blog",
  },
  "meet-the-kitchen-a-day-in-the-life-at-mrsk-eatries": {
    localPath: "blog/meet-the-kitchen-a-day-in-the-life-at-mrsk-eatries.jpg",
    cloudinaryFolder: "mrsk-eatries/blog",
  },
  "pairing-notes-what-to-drink-with-every-dish-on-our-menu": {
    localPath: "blog/pairing-notes-what-to-drink-with-every-dish-on-our-menu.jpg",
    cloudinaryFolder: "mrsk-eatries/blog",
  },
  "from-farm-to-table-where-our-ingredients-come-from": {
    localPath: "blog/from-farm-to-table-where-our-ingredients-come-from.jpg",
    cloudinaryFolder: "mrsk-eatries/blog",
  },
};

async function uploadOne(slot: MediaSlot): Promise<string> {
  const absolutePath = path.join(PUBLIC_IMAGES_DIR, slot.localPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing local file: ${absolutePath}`);
  }
  const result = await cloudinary.uploader.upload(absolutePath, {
    folder: slot.cloudinaryFolder,
    resource_type: "image",
  });
  return result.secure_url;
}

async function uploadRecord(slots: Record<string, MediaSlot>): Promise<Record<string, string>> {
  const entries = await Promise.all(
    Object.entries(slots).map(async ([key, slot]) => [key, await uploadOne(slot)] as const)
  );
  return Object.fromEntries(entries);
}

function tsRecord(record: Record<string, string>): string {
  const lines = Object.entries(record).map(([key, url]) => `  "${key}": "${url}",`);
  return `{\n${lines.join("\n")}\n}`;
}

async function main() {
  console.log("[media-migration] Uploading hero image...");
  const heroUrl = await uploadOne(HERO);

  console.log("[media-migration] Uploading 9 category images...");
  const categoryUrls = await uploadRecord(CATEGORY_SLOTS);

  console.log("[media-migration] Uploading about page images...");
  const aboutHeroUrl = await uploadOne(ABOUT_HERO);
  const aboutStoryUrl = await uploadOne(ABOUT_STORY);
  const chefUrls = await uploadRecord(CHEF_SLOTS);

  console.log("[media-migration] Uploading gallery ambiance images...");
  const galleryUrls = await uploadRecord(GALLERY_SLOTS);

  console.log("[media-migration] Uploading blog cover images...");
  const blogUrls = await uploadRecord(BLOG_SLOTS);

  const fileContent = `import type { MenuCategorySlug } from "@/types/menu";

/**
 * Single source of truth for every real photograph in the app — Media
 * System (Phase 3). Generated by
 * backend/src/scripts/upload-media-to-cloudinary.ts — every URL below is
 * a real Cloudinary-hosted asset (Pexels License originals, free for
 * commercial use). Re-run that script to refresh URLs; do not hand-edit
 * this file's values.
 */

export const HERO_IMAGE = "${heroUrl}";

export const CATEGORY_IMAGE: Record<MenuCategorySlug, string> = ${tsRecord(categoryUrls)} as Record<MenuCategorySlug, string>;

export const ABOUT_HERO_IMAGE = "${aboutHeroUrl}";
export const ABOUT_STORY_IMAGE = "${aboutStoryUrl}";

export const CHEF_IMAGE: Record<string, string> = ${tsRecord(chefUrls)};

export const GALLERY_AMBIANCE_IMAGE: Record<string, string> = ${tsRecord(galleryUrls)};

export const BLOG_COVER_IMAGE: Record<string, string> = ${tsRecord(blogUrls)};
`;

  fs.writeFileSync(MEDIA_CONSTANTS_FILE, fileContent, "utf-8");
  console.log(`[media-migration] Done. Rewrote ${MEDIA_CONSTANTS_FILE} with ${1 + 9 + 2 + 3 + 6 + 5} Cloudinary URLs.`);
  console.log(
    "[media-migration] Also add 'res.cloudinary.com' to next.config.ts's images.remotePatterns if it isn't already there (it already is, as of this Media System pass)."
  );
}

main().catch((error) => {
  console.error("[media-migration] Failed:", error);
  process.exit(1);
});
