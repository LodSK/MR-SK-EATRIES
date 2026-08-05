import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().min(1, "Give this address a label.").default("Home"),
  street: z.string().min(2, "Enter a street address."),
  city: z.string().min(1, "Enter a city."),
  notes: z.string().max(200).optional(),
  isDefault: z.boolean().optional().default(false),
});

export type AddressSchemaValues = z.infer<typeof addressSchema>;
