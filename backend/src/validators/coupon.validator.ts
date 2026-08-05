import { z } from "zod";
import { COUPON_TYPES } from "@/config/constants";

export const validateCouponSchema = z.object({
  code: z.string().min(1),
  subtotal: z.number().min(0),
});

export const createCouponSchema = z.object({
  code: z.string().min(3),
  type: z.enum(COUPON_TYPES),
  value: z.number().min(0),
  minimumSpend: z.number().min(0).optional().default(0),
  maxUses: z.number().min(1).optional(),
  expiresAt: z.coerce.date().optional(),
});

export const updateCouponSchema = createCouponSchema.partial().extend({
  isActive: z.boolean().optional(),
});
