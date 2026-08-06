import { randomUUID } from "crypto";
import { MenuItem } from "@/models/MenuItem.model";
import { Order, type IOrder } from "@/models/Order.model";
import { Coupon } from "@/models/Coupon.model";
import { ApiError } from "@/utils/ApiError";
import { buildPaginationMeta } from "@/utils/ApiResponse";
import { STAFF_ROLES, type DeliveryMethod, type PaymentMethod, type Role } from "@/config/constants";
import { validateCouponCode } from "@/services/coupon.service";
import { sendOrderConfirmationEmail } from "@/services/email.service";
import { getSettings } from "@/services/settings.service";
import { initializeTransaction, verifyTransaction } from "@/services/paystack.service";
import { env } from "@/config/env";
import { logger } from "@/config/logger";

interface RequesterContext {
  userId?: string;
  role?: Role;
  /** For guest (no account) lookups — must match the order's guestEmail. */
  email?: string;
}

function isStaff(role?: Role): boolean {
  return !!role && (STAFF_ROLES as readonly string[]).includes(role);
}

/**
 * Throws if the requester doesn't own this order and isn't staff+. Mirrors
 * reservation.service.ts's assertCanAccess exactly — this is the fix for
 * the guest-lookup over-exposure flagged since the Sprint 9 audit: a fully
 * unauthenticated request with a guessed/leaked order ID used to get the
 * complete order back unconditionally. Now it needs the matching guest
 * email, exactly like reservations already required.
 */
function assertCanAccess(order: IOrder, requester: RequesterContext) {
  if (isStaff(requester.role)) return;
  if (requester.userId && order.user?.toString() === requester.userId) return;
  if (
    !order.user &&
    order.guestEmail &&
    requester.email &&
    requester.email.trim().toLowerCase() === order.guestEmail.toLowerCase()
  ) {
    return;
  }
  throw ApiError.forbidden("You do not have permission to access this order.");
}

interface CreateOrderInput {
  userId?: string;
  items: { menuItemId: string; quantity: number }[];
  couponCode?: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  street?: string;
  city?: string;
  instructions?: string;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Recalculates the entire order total server-side from the current
 * database price of each item — the client's displayed total is never
 * trusted. This directly closes the pricing-tamper gap flagged as
 * technical debt after Sprint 7.
 */
export async function createOrder(input: CreateOrderInput) {
  if (input.items.length === 0) throw ApiError.badRequest("Cart cannot be empty.");

  const menuItemIds = input.items.map((i) => i.menuItemId);
  const menuItems = await MenuItem.find({ _id: { $in: menuItemIds }, isAvailable: true });

  const orderItems = input.items.map((cartItem) => {
    const menuItem = menuItems.find((m) => m._id.toString() === cartItem.menuItemId);
    if (!menuItem) throw ApiError.badRequest(`Item ${cartItem.menuItemId} is unavailable.`);
    if (menuItem.stockQuantity < cartItem.quantity) {
      throw ApiError.badRequest(`${menuItem.name} doesn't have enough stock.`);
    }
    return {
      menuItem: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: cartItem.quantity,
      currency: menuItem.currency,
    };
  });

  const subtotal = round2(orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0));

  let discount = 0;
  let appliedCouponCode: string | undefined;
  if (input.couponCode) {
    const result = await validateCouponCode(input.couponCode, subtotal);
    if (result.valid) {
      discount = result.discountAmount;
      appliedCouponCode = result.code;
    }
  }

  const settings = await getSettings();
  const deliveryFeeMap: Record<DeliveryMethod, number> = {
    pickup: settings.delivery.pickupFee,
    standard: settings.delivery.standardFee,
    express: settings.delivery.expressFee,
  };
  const deliveryFee = deliveryFeeMap[input.deliveryMethod];
  const serviceCharge = round2(subtotal * settings.serviceChargeRate);
  const tax = round2(Math.max(subtotal - discount, 0) * settings.taxRate);
  const grandTotal = round2(subtotal - discount + deliveryFee + serviceCharge + tax);

  const orderNumber = `MRSK-${Math.floor(100000 + Math.random() * 900000)}`;
  const etaMap: Record<DeliveryMethod, [number, number]> = {
    pickup: [15, 25],
    standard: [35, 50],
    express: [15, 25],
  };

  // "card" orders aren't confirmed until Paystack verifies payment;
  // cash/mobile-money are collected outside this app and are treated as
  // paid immediately, exactly as before this field existed.
  const paymentStatus = input.paymentMethod === "card" ? "pending" : "paid";

  const order = await Order.create({
    orderNumber,
    user: input.userId,
    guestEmail: input.userId ? undefined : input.customerEmail,
    items: orderItems,
    subtotal,
    discount,
    deliveryFee,
    serviceCharge,
    tax,
    grandTotal,
    couponCode: appliedCouponCode,
    deliveryMethod: input.deliveryMethod,
    paymentMethod: input.paymentMethod,
    paymentStatus,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
    deliveryAddress: input.street ? { street: input.street, city: input.city, notes: input.instructions } : undefined,
    instructions: input.instructions,
    estimatedDeliveryMinutes: etaMap[input.deliveryMethod],
  });

  // Stock is reserved at order creation regardless of payment method — this
  // matches the pre-existing behavior exactly and avoids overselling while
  // a card order sits on Paystack's checkout page.
  await Promise.all(
    orderItems.map((item) =>
      MenuItem.updateOne({ _id: item.menuItem }, { $inc: { stockQuantity: -item.quantity, popularityScore: 1 } })
    )
  );

  if (appliedCouponCode) {
    await Coupon.updateOne({ code: appliedCouponCode }, { $inc: { usedCount: 1 } });
  }

  // Card orders get their confirmation email once payment is actually
  // verified (see markOrderPaid) — sending it now would confirm an order
  // that might never get paid for.
  if (paymentStatus === "paid") {
    await sendOrderConfirmationEmail(order.customerEmail, order.orderNumber, order.grandTotal, "GHS").catch((err) =>
      logger.error("[email] order confirmation failed", { error: err instanceof Error ? err.message : err })
    );
  }

  return order;
}

/**
 * Starts a Paystack transaction for an existing "card" order and returns
 * the hosted checkout URL to redirect the browser to. Idempotent-ish: a
 * second call before payment completes just issues a fresh reference
 * (Paystack references must be unique per attempt; the order keeps only
 * the latest one).
 */
export async function initializeOrderPayment(orderId: string, requester: RequesterContext) {
  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound("Order not found.");
  assertCanAccess(order, requester);

  if (order.paymentMethod !== "card") {
    throw ApiError.badRequest("This order isn't a card payment.");
  }
  if (order.paymentStatus === "paid") {
    throw ApiError.badRequest("This order has already been paid for.");
  }

  const reference = `MRSK-PAY-${order.orderNumber}-${randomUUID().slice(0, 8)}`;
  const result = await initializeTransaction({
    email: order.customerEmail,
    amountInPesewas: Math.round(order.grandTotal * 100),
    reference,
    callbackUrl: `${env.clientUrl}/checkout/verify`,
    metadata: { orderId: order._id.toString(), orderNumber: order.orderNumber },
  });

  order.paymentReference = result.reference;
  await order.save();

  return { authorizationUrl: result.authorizationUrl, reference: result.reference };
}

/**
 * Marks an order paid exactly once — both the browser's post-payment
 * redirect (checkout/verify) and (once deployed) a Paystack webhook can
 * legitimately call this for the same reference, and only the first
 * should send the confirmation email / mutate anything.
 */
async function markOrderPaidIfUnpaid(order: IOrder): Promise<boolean> {
  if (order.paymentStatus === "paid") return false;

  order.paymentStatus = "paid";
  order.paidAt = new Date();
  await order.save();

  await sendOrderConfirmationEmail(order.customerEmail, order.orderNumber, order.grandTotal, "GHS").catch((err) =>
    logger.error("[email] order confirmation failed", { error: err instanceof Error ? err.message : err })
  );

  return true;
}

/**
 * Re-fetches the transaction from Paystack directly (never trusts the
 * client's redirect query params alone) and cross-checks the paid amount
 * against the order's own grandTotal before marking anything paid — closes
 * the same class of client-trust gap createOrder's own comment already
 * calls out for pricing.
 */
export async function verifyOrderPayment(reference: string) {
  const order = await Order.findOne({ paymentReference: reference });
  if (!order) throw ApiError.notFound("Order not found for this payment reference.");

  const result = await verifyTransaction(reference);
  const expectedAmount = Math.round(order.grandTotal * 100);

  if (result.status !== "success" || result.amount !== expectedAmount) {
    if (order.paymentStatus !== "paid") {
      order.paymentStatus = "failed";
      await order.save();
    }
    return { order, paid: false };
  }

  await markOrderPaidIfUnpaid(order);
  return { order, paid: true };
}

/** Used by the Paystack webhook — same verification path, keyed by the
 * reference the webhook payload names, but treats "order not found" as a
 * silent no-op (webhooks can arrive for events unrelated to this app,
 * e.g. a test ping) rather than surfacing a 404 to Paystack. */
export async function handlePaystackWebhookEvent(reference: string): Promise<void> {
  const order = await Order.findOne({ paymentReference: reference });
  if (!order) return;

  const result = await verifyTransaction(reference);
  const expectedAmount = Math.round(order.grandTotal * 100);
  if (result.status === "success" && result.amount === expectedAmount) {
    await markOrderPaidIfUnpaid(order);
  }
}

export async function getOrderById(id: string, requester: RequesterContext) {
  const order = await Order.findById(id);
  if (!order) throw ApiError.notFound("Order not found.");
  assertCanAccess(order, requester);
  return order;
}

/**
 * Powers the public "Track Order" page — guests only ever know their
 * human-friendly orderNumber (from the confirmation screen/email), not
 * the internal Mongo _id, so this is a separate lookup path rather than
 * asking a guest to find their _id. Same assertCanAccess scoping as
 * getOrderById — a guest still needs the matching email.
 */
export async function getOrderByNumber(orderNumber: string, requester: RequesterContext) {
  const order = await Order.findOne({ orderNumber });
  if (!order) throw ApiError.notFound("Order not found.");
  assertCanAccess(order, requester);
  return order;
}

export async function getUserOrderHistory(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments({ user: userId }),
  ]);
  return { orders, meta: buildPaginationMeta(page, limit, total) };
}

export async function listAllOrders(page: number, limit: number, status?: string, search?: string) {
  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (search) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [{ orderNumber: regex }, { customerName: regex }, { customerEmail: regex }];
  }

  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ]);
  return { orders, meta: buildPaginationMeta(page, limit, total) };
}

export async function updateOrderStatus(id: string, status: string) {
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
  if (!order) throw ApiError.notFound("Order not found.");
  return order;
}
