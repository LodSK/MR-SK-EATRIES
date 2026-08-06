import type { CartItem, CheckoutFormValues, CouponResult, SubmitOrderResult } from "@/types/cart";
import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";

/**
 * Sprint 9: real Express/MongoDB backend replaces the Sprint 7 placeholder.
 *
 * One necessary signature change, called out explicitly: `submitOrder`
 * gained a second parameter, `items`. The Sprint 7 placeholder only ever
 * received checkout form values — never the cart contents — because a
 * fake order didn't need them. A real order cannot be created without
 * knowing what's being ordered, so this is the one unavoidable exception
 * to "no component changes necessary": `CheckoutForm.tsx` now passes
 * `items` from `useCart()` alongside the form values it already sent.
 */

export async function validateCoupon(code: string, subtotal: number): Promise<CouponResult> {
  try {
    const { data } = await httpClient.post("/coupons/validate", { code, subtotal });
    const result = data.data;
    return {
      code: result.code,
      valid: result.valid,
      discountPercent: result.discountPercent ?? 0,
      message: data.message,
    };
  } catch (error) {
    return {
      code: code.trim().toUpperCase(),
      valid: false,
      discountPercent: 0,
      message: getApiErrorMessage(error, "That code isn't valid or has expired."),
    };
  }
}

export async function submitOrder(
  values: CheckoutFormValues,
  items: CartItem[]
): Promise<SubmitOrderResult> {
  try {
    const { data } = await httpClient.post("/orders", {
      items: items.map((item) => ({ menuItemId: item.id, quantity: item.quantity })),
      deliveryMethod: values.deliveryMethod,
      paymentMethod: values.paymentMethod,
      customerName: values.fullName,
      customerEmail: values.email,
      customerPhone: values.phone,
      street: values.street,
      city: values.city,
      instructions: values.instructions,
    });

    const order = data.data;

    // "card" orders aren't confirmed yet — start the Paystack transaction
    // right away and send the caller the checkout URL instead of a
    // confirmation message. Guest orders authenticate this call the same
    // way order lookups do elsewhere: a matching ?email= query param.
    if (values.paymentMethod === "card") {
      const emailParam = order.guestEmail ? `?email=${encodeURIComponent(order.guestEmail)}` : "";
      const { data: payment } = await httpClient.post(`/orders/${order._id}/pay/initialize${emailParam}`);

      return {
        success: true,
        orderId: order.orderNumber,
        message: "Redirecting you to Paystack…",
        estimatedDeliveryMinutes: order.estimatedDeliveryMinutes,
        requiresRedirect: payment.data.authorizationUrl,
      };
    }

    return {
      success: true,
      orderId: order.orderNumber,
      message: "Your order has been placed.",
      estimatedDeliveryMinutes: order.estimatedDeliveryMinutes,
    };
  } catch (error) {
    return {
      success: false,
      orderId: "",
      message: getApiErrorMessage(error, "We couldn't place your order. Please try again."),
      estimatedDeliveryMinutes: [30, 45],
    };
  }
}
