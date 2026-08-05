import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";
import type { Coupon, CouponPayload } from "@/types/coupon";

function normalize(raw: Coupon & { _id?: string }): Coupon {
  return { ...raw, id: raw.id ?? raw._id ?? "" };
}

export async function listCoupons(): Promise<Coupon[]> {
  const { data } = await httpClient.get("/admin/coupons");
  return (data.data as Coupon[]).map(normalize);
}

export async function createCoupon(payload: CouponPayload): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.post("/admin/coupons", payload);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function updateCoupon(
  id: string,
  payload: Partial<CouponPayload>
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.patch(`/admin/coupons/${id}`, payload);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function deleteCoupon(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.delete(`/admin/coupons/${id}`);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
