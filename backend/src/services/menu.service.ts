import type { FilterQuery } from "mongoose";
import { MenuItem, type IMenuItem } from "@/models/MenuItem.model";
import { Category } from "@/models/Category.model";
import { ApiError } from "@/utils/ApiError";
import { buildPaginationMeta } from "@/utils/ApiResponse";

export interface MenuQueryOptions {
  page: number;
  limit: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  tag?: string;
  sort: "popularity" | "price-asc" | "price-desc" | "rating" | "newest";
  /** Admin listings need to see unavailable items too; public listings never do. */
  includeUnavailable?: boolean;
}

const SORT_MAP: Record<MenuQueryOptions["sort"], Record<string, 1 | -1>> = {
  popularity: { popularityScore: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
  rating: { rating: -1 },
  newest: { createdAt: -1 },
};

export async function listMenuItems(options: MenuQueryOptions) {
  const filter: FilterQuery<IMenuItem> = options.includeUnavailable ? {} : { isAvailable: true };

  if (options.category) filter.category = options.category;
  if (options.tag) filter.tag = options.tag;
  if (options.isVegetarian !== undefined) filter.isVegetarian = options.isVegetarian;
  if (options.isSpicy !== undefined) filter.isSpicy = options.isSpicy;
  if (options.minPrice !== undefined || options.maxPrice !== undefined) {
    filter.price = {
      ...(options.minPrice !== undefined && { $gte: options.minPrice }),
      ...(options.maxPrice !== undefined && { $lte: options.maxPrice }),
    };
  }
  if (options.search) {
    filter.$text = { $search: options.search };
  }

  const skip = (options.page - 1) * options.limit;

  const [items, total] = await Promise.all([
    MenuItem.find(filter).sort(SORT_MAP[options.sort]).skip(skip).limit(options.limit),
    MenuItem.countDocuments(filter),
  ]);

  return { items, meta: buildPaginationMeta(options.page, options.limit, total) };
}

export async function getMenuItemBySlug(slug: string) {
  const item = await MenuItem.findOne({ slug, isAvailable: true });
  if (!item) throw ApiError.notFound("Menu item not found.");
  return item;
}

export async function getRelatedMenuItems(item: IMenuItem, limit = 3) {
  return MenuItem.find({
    category: item.category,
    _id: { $ne: item._id },
    isAvailable: true,
  }).limit(limit);
}

export async function searchMenuItems(query: string, limit = 20) {
  if (!query.trim()) return MenuItem.find({ isAvailable: true }).limit(limit);
  return MenuItem.find({ $text: { $search: query }, isAvailable: true }).limit(limit);
}

export async function getFeaturedMenuItems(limit = 6) {
  const featured = await MenuItem.find({ isAvailable: true, isFeatured: true })
    .sort({ popularityScore: -1 })
    .limit(limit);

  if (featured.length >= limit) return featured;

  // Not enough explicitly-featured items yet — fill the rest by popularity,
  // excluding ones already included, so admins can adopt isFeatured gradually.
  const remaining = limit - featured.length;
  const fallback = await MenuItem.find({
    isAvailable: true,
    isFeatured: { $ne: true },
  })
    .sort({ popularityScore: -1 })
    .limit(remaining);

  return [...featured, ...fallback];
}

export async function getPopularMenuItems(limit = 10) {
  return MenuItem.find({ isAvailable: true }).sort({ reviewCount: -1, rating: -1 }).limit(limit);
}

export async function listCategories() {
  return Category.find().sort({ displayOrder: 1 });
}
