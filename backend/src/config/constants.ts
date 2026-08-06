export const ROLES = ["customer", "staff", "manager", "admin"] as const;
export type Role = (typeof ROLES)[number];

/** Roles with elevated (admin-area) access — used by the `authorize` middleware for admin routes. */
export const STAFF_ROLES: Role[] = ["staff", "manager", "admin"];

export const ORDER_STATUSES = ["pending", "preparing", "ready", "completed", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_METHODS = ["card", "mobile-money", "cash"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** "card" orders start "pending" and move to "paid"/"failed" once Paystack
 * confirms the transaction; "cash"/"mobile-money" orders are collected
 * outside this app (at pickup/delivery) and are never online-verified, so
 * they're created "paid" — this only changes what's tracked/displayed, not
 * the order fulfillment workflow (`status`), which stays untouched. */
export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const DELIVERY_METHODS = ["pickup", "standard", "express"] as const;
export type DeliveryMethod = (typeof DELIVERY_METHODS)[number];

export const DELIVERY_FEES: Record<DeliveryMethod, number> = {
  pickup: 0,
  standard: 15,
  express: 30,
};

export const SERVICE_CHARGE_RATE = 0.05;
export const TAX_RATE = 0.125;

export const RESERVATION_STATUSES = ["pending", "confirmed", "seated", "completed", "cancelled", "no-show"] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

/** Configurable booking slots — single source of truth for both validation and availability lookup. */
export const RESERVATION_TIME_SLOTS = [
  "12:00", "12:30", "13:00",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
] as const;
export const TABLES_PER_SLOT = 8;
/** Minimum notice (hours) required for a customer to self-service cancel; staff/admin bypass this. */
export const RESERVATION_CANCELLATION_NOTICE_HOURS = 2;

export const MENU_CATEGORIES = [
  "breakfast",
  "lunch",
  "dinner",
  "burgers",
  "pizza",
  "chicken",
  "seafood",
  "desserts",
  "drinks",
] as const;
export type MenuCategorySlug = (typeof MENU_CATEGORIES)[number];

export const COUPON_TYPES = ["percentage", "fixed"] as const;
export type CouponType = (typeof COUPON_TYPES)[number];
