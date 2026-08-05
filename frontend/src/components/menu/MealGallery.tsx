import Image from "next/image";
import type { MenuCategorySlug } from "@/types/menu";
import { CATEGORY_IMAGE } from "@/lib/constants/media";

interface MealGalleryProps {
  name: string;
  category: MenuCategorySlug;
}

/**
 * One real photo per category (see PROJECT_STATUS.md's Media System
 * section) — not per individual dish yet, so this deliberately shows a
 * single hero image rather than faking a multi-photo gallery with
 * repeated thumbnails of the same picture. Per-dish photography can be
 * added later via the existing admin upload flow (MenuItem.images);
 * this component would then prefer that over the category fallback.
 */
export function MealGallery({ name, category }: MealGalleryProps) {
  return (
    <div className="relative h-72 overflow-hidden rounded-2xl sm:h-96">
      <Image
        src={CATEGORY_IMAGE[category]}
        alt={name}
        fill
        priority
        className="object-cover"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    </div>
  );
}
