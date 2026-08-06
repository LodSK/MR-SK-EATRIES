import axios from "axios";
import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";
import type { Order } from "@/types/order";

function normalizeOrder(raw: Order & { _id?: string }): Order {
  return { ...raw, id: raw.id ?? raw._id ?? "" };
}

export async function getOrderHistory(page = 1, limit = 20): Promise<Order[]> {
  const { data } = await httpClient.get("/orders/history", { params: { page, limit } });
  return (data.data as Order[]).map(normalizeOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const { data } = await httpClient.get(`/orders/${id}`);
    return normalizeOrder(data.data);
  } catch {
    return null;
  }
}

export function getOrderErrorMessage(error: unknown): string {
  return getApiErrorMessage(error, "We couldn't load this order.");
}

/** Guest order tracking by human-friendly order number + email — see the backend's getOrderByNumber. */
export async function trackOrder(
  orderNumber: string,
  email: string
): Promise<{ success: boolean; message: string; order?: Order }> {
  try {
    const { data } = await httpClient.get(`/orders/track/${encodeURIComponent(orderNumber)}`, {
      params: { email },
    });
    return { success: true, message: data.message, order: normalizeOrder(data.data) };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "We couldn't find an order matching those details."),
    };
  }
}

/** Called by the /checkout/verify page after Paystack redirects back —
 * re-checks the transaction against Paystack directly rather than trusting
 * the redirect's own query params. */
export async function verifyPayment(
  reference: string
): Promise<{ success: boolean; paid: boolean; message: string; order?: Order }> {
  try {
    // 60s: generous enough to ride out a Render free-tier cold start
    // (documented as 30-60s) rather than timing out mid-boot and reporting
    // a false failure. httpClient has no default timeout, so without this
    // a genuinely stuck connection would hang the /checkout/verify page's
    // spinner indefinitely with no way out.
    const { data } = await httpClient.get("/orders/pay/verify", { params: { reference }, timeout: 60000 });
    return { success: true, paid: data.data.paid, message: data.message, order: normalizeOrder(data.data.order) };
  } catch (error) {
    const isTimeout = axios.isAxiosError(error) && error.code === "ECONNABORTED";
    return {
      success: false,
      paid: false,
      message: isTimeout
        ? "This is taking longer than expected. Your payment may still be processing — check your order history in a moment before retrying."
        : getApiErrorMessage(error, "We couldn't verify this payment."),
    };
  }
}

// ── Admin ──────────────────────────────────────────────────────────

export async function adminListOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<{ orders: Order[]; total: number }> {
  const { data } = await httpClient.get("/admin/orders", { params });
  return { orders: (data.data as Order[]).map(normalizeOrder), total: data.meta?.total ?? data.data.length };
}

export async function adminUpdateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.patch(`/admin/orders/${id}/status`, { status });
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
