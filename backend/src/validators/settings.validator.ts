import { z } from "zod";

const openingHoursSlotSchema = z.object({
  days: z.string().min(1),
  time: z.string().min(1),
});

export const updateSettingsSchema = z.object({
  restaurantName: z.string().min(1).optional(),
  tagline: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  openingHours: z.array(openingHoursSlotSchema).optional(),
  isOnlineOrderingEnabled: z.boolean().optional(),
  isReservationsEnabled: z.boolean().optional(),
  delivery: z
    .object({
      pickupFee: z.number().min(0).optional(),
      standardFee: z.number().min(0).optional(),
      expressFee: z.number().min(0).optional(),
    })
    .optional(),
  taxRate: z.number().min(0).max(1).optional(),
  serviceChargeRate: z.number().min(0).max(1).optional(),
  currency: z.string().min(1).optional(),
});
