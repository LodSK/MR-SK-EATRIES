import type { CartItem, CouponResult, DeliveryMethod, DeliveryOption, OrderTotals } from "@/types/cart";

/**
 * All monetary logic for the cart lives here, deliberately isolated from
 * React and from the Zustand store. That separation is what lets Sprint 9
 * move this calculation server-side (so a client can't tamper with
 * totals) without rewriting any component — the store and components
 * would simply call an API that runs the same logic instead of running
 * it locally.
 */

export const SERVICE_CHARGE_RATE = 0.05; // 5% of subtotal
export const TAX_RATE = 0.125; // 12.5% VAT-style tax on subtotal after discount

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    method: "pickup",
    label: "Pickup",
    description: "Collect your order from the restaurant",
    fee: 0,
    etaMinutes: [15, 25],
  },
  {
    method: "standard",
    label: "Standard Delivery",
    description: "Delivered to your door",
    fee: 15,
    etaMinutes: [35, 50],
  },
  {
    method: "express",
    label: "Express Delivery",
    description: "Priority kitchen slot + dedicated rider",
    fee: 30,
    etaMinutes: [15, 25],
  },
];

export function getDeliveryOption(method: DeliveryMethod): DeliveryOption {
  const option = DELIVERY_OPTIONS.find((o) => o.method === method);
  // Falls back to pickup (fee 0) rather than throwing — a bad/unknown method
  // should never crash checkout, just default to the safest option.
  return option ?? DELIVERY_OPTIONS[0]!;
}

export function getDeliveryFee(method: DeliveryMethod): number {
  return getDeliveryOption(method).fee;
}

export function calculateItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateDiscount(subtotal: number, coupon: CouponResult | null): number {
  if (!coupon || !coupon.valid) return 0;
  return round2((subtotal * coupon.discountPercent) / 100);
}

export function calculateServiceCharge(subtotal: number): number {
  return round2(subtotal * SERVICE_CHARGE_RATE);
}

export function calculateTax(taxableAmount: number): number {
  return round2(Math.max(taxableAmount, 0) * TAX_RATE);
}

interface CalculateOrderTotalsInput {
  items: CartItem[];
  deliveryMethod: DeliveryMethod;
  coupon: CouponResult | null;
}

export function calculateOrderTotals({
  items,
  deliveryMethod,
  coupon,
}: CalculateOrderTotalsInput): OrderTotals {
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal, coupon);
  const deliveryFee = getDeliveryFee(deliveryMethod);
  const serviceCharge = calculateServiceCharge(subtotal);
  const tax = calculateTax(subtotal - discount);
  const grandTotal = round2(subtotal - discount + deliveryFee + serviceCharge + tax);

  return { subtotal, discount, deliveryFee, serviceCharge, tax, grandTotal };
}

export function formatCurrency(amount: number, currency = "GHS"): string {
  return `${currency} ${amount.toFixed(2)}`;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
