import type { MenuCategorySlug } from "@/types/menu";

export type DeliveryMethod = "pickup" | "standard" | "express";

export type PaymentMethod = "card" | "mobile-money" | "cash";

export interface CartItem {
  /** Menu item id (or a composed id once customization is supported). */
  id: string;
  name: string;
  /** Optional — lets the cart deep-link back to the item's detail page when available. */
  slug?: string;
  category: MenuCategorySlug;
  price: number;
  currency: string;
  quantity: number;
}

export interface CouponResult {
  code: string;
  valid: boolean;
  discountPercent: number;
  message: string;
}

export interface DeliveryOption {
  method: DeliveryMethod;
  label: string;
  description: string;
  fee: number;
  /** [min, max] minutes */
  etaMinutes: [number, number];
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  serviceCharge: number;
  tax: number;
  grandTotal: number;
}

export interface CheckoutFormValues {
  fullName: string;
  email: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  street?: string;
  city?: string;
  instructions?: string;
  paymentMethod: PaymentMethod;
}

export interface SubmitOrderResult {
  success: boolean;
  orderId: string;
  message: string;
  estimatedDeliveryMinutes: [number, number];
  /** Set only for "card" orders — the Paystack hosted checkout URL the
   * browser must be redirected to next; the order isn't confirmed yet. */
  requiresRedirect?: string;
}
