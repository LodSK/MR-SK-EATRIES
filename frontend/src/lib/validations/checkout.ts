import { z } from "zod";

export const checkoutSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name."),
    email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
    phone: z.string().min(7, "Enter a valid phone number."),
    deliveryMethod: z.enum(["pickup", "standard", "express"]),
    street: z.string().optional(),
    city: z.string().optional(),
    instructions: z.string().max(300, "Keep instructions under 300 characters.").optional(),
    paymentMethod: z.enum(["card", "mobile-money", "cash"]),
  })
  .superRefine((values, ctx) => {
    if (values.deliveryMethod !== "pickup") {
      if (!values.street || values.street.trim().length < 4) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["street"],
          message: "Enter a delivery address.",
        });
      }
      if (!values.city || values.city.trim().length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["city"],
          message: "Enter your city.",
        });
      }
    }
  });

export type CheckoutSchemaValues = z.infer<typeof checkoutSchema>;
