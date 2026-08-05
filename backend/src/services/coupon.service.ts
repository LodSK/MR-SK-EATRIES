import { Coupon, type ICoupon } from "@/models/Coupon.model";
import { ApiError } from "@/utils/ApiError";

export interface CouponValidationResult {
  code: string;
  valid: boolean;
  discountAmount: number;
  discountPercent?: number;
  message: string;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export async function validateCouponCode(rawCode: string, subtotal: number): Promise<CouponValidationResult> {
  const code = rawCode.trim().toUpperCase();
  const coupon = await Coupon.findOne({ code });

  if (!coupon || !coupon.isActive) {
    return { code, valid: false, discountAmount: 0, message: "That code isn't valid or has expired." };
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return { code, valid: false, discountAmount: 0, message: "This coupon has expired." };
  }
  if (coupon.maxUses !== undefined && coupon.usedCount >= coupon.maxUses) {
    return { code, valid: false, discountAmount: 0, message: "This coupon has reached its usage limit." };
  }
  if (subtotal < coupon.minimumSpend) {
    return {
      code,
      valid: false,
      discountAmount: 0,
      message: `Spend at least GHS ${coupon.minimumSpend} to use this code.`,
    };
  }

  const discountAmount =
    coupon.type === "percentage" ? round2((subtotal * coupon.value) / 100) : Math.min(coupon.value, subtotal);

  return {
    code,
    valid: true,
    discountAmount,
    discountPercent: coupon.type === "percentage" ? coupon.value : undefined,
    message:
      coupon.type === "percentage" ? `${coupon.value}% off applied.` : `GHS ${coupon.value} off applied.`,
  };
}

export async function listCoupons() {
  return Coupon.find().sort({ createdAt: -1 });
}

export async function createCoupon(data: Partial<ICoupon>) {
  const existing = await Coupon.findOne({ code: data.code?.toUpperCase() });
  if (existing) throw ApiError.conflict("A coupon with that code already exists.");
  return Coupon.create({ ...data, code: data.code?.toUpperCase() });
}

export async function updateCoupon(id: string, data: Partial<ICoupon>) {
  const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true });
  if (!coupon) throw ApiError.notFound("Coupon not found.");
  return coupon;
}

export async function deleteCoupon(id: string) {
  const coupon = await Coupon.findByIdAndDelete(id);
  if (!coupon) throw ApiError.notFound("Coupon not found.");
}
