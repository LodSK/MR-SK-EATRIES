import { z } from "zod";

export const addAddressSchema = z.object({
  label: z.string().optional().default("Home"),
  street: z.string().min(2),
  city: z.string().min(1),
  notes: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
});

export const updateAddressSchema = addAddressSchema.partial();

export const createReviewSchema = z.object({
  menuItemId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(1000),
});
