import { z } from "zod";
import { DELIVERY_METHODS, PAYMENT_METHODS, ORDER_STATUSES } from "@/config/constants";

export const createOrderSchema = z
  .object({
    items: z
      .array(
        z.object({
          menuItemId: z.string().min(1),
          quantity: z.number().int().min(1).max(50),
        })
      )
      .min(1, "Cart cannot be empty."),
    couponCode: z.string().optional(),
    deliveryMethod: z.enum(DELIVERY_METHODS),
    paymentMethod: z.enum(PAYMENT_METHODS),
    customerName: z.string().min(2),
    customerEmail: z.string().email(),
    customerPhone: z.string().min(7),
    street: z.string().optional(),
    city: z.string().optional(),
    instructions: z.string().max(300).optional(),
  })
  .superRefine((values, ctx) => {
    if (values.deliveryMethod !== "pickup") {
      if (!values.street) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["street"], message: "Street address is required." });
      }
      if (!values.city) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["city"], message: "City is required." });
      }
    }
  });

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});
