import { z } from "zod";

export const createPaymentMethodSchema = z.object({
  nickname: z.string().min(1, "Give this card a nickname.").max(40),
  maskedNumber: z
    .string()
    .regex(/^\d{4}$/, "Enter the last 4 digits only.")
    .transform((v) => `•••• ${v}`),
  brand: z.string().min(1).optional().default("Card"),
  expiryMonth: z.number().int().min(1).max(12),
  expiryYear: z.number().int().min(new Date().getFullYear()),
  isDefault: z.boolean().optional().default(false),
});

export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>;
