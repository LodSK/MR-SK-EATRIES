import { z } from "zod";
import { MENU_CATEGORIES } from "@/config/constants";

export const menuQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  category: z.enum(MENU_CATEGORIES).optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  isVegetarian: z.coerce.boolean().optional(),
  isSpicy: z.coerce.boolean().optional(),
  tag: z.enum(["New", "Popular", "Chef's Pick"]).optional(),
  sort: z.enum(["popularity", "price-asc", "price-desc", "rating", "newest"]).optional().default("popularity"),
});

export const createMenuItemSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(1),
  longDescription: z.string().optional().default(""),
  category: z.enum(MENU_CATEGORIES),
  price: z.number().min(0),
  currency: z.string().optional().default("GHS"),
  prepTimeMinutes: z.number().min(1).optional().default(15),
  tag: z.enum(["New", "Popular", "Chef's Pick"]).optional(),
  isVegetarian: z.boolean().optional().default(false),
  isSpicy: z.boolean().optional().default(false),
  isAvailable: z.boolean().optional().default(true),
  isFeatured: z.boolean().optional().default(false),
  stockQuantity: z.number().int().min(0).optional(),
  ingredients: z.array(z.string()).optional().default([]),
  nutrition: z
    .object({
      calories: z.number().min(0),
      proteinGrams: z.number().min(0),
      carbsGrams: z.number().min(0),
      fatGrams: z.number().min(0),
    })
    .optional(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();
