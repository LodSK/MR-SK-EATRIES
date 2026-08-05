import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import * as couponService from "@/services/coupon.service";

export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  const result = await couponService.validateCouponCode(code, subtotal);
  return ApiResponse.ok(res, result, result.message);
});

// ── Admin ──────────────────────────────────────────────────────────

export const listCoupons = asyncHandler(async (_req: Request, res: Response) => {
  const coupons = await couponService.listCoupons();
  return ApiResponse.ok(res, coupons);
});

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await couponService.createCoupon(req.body);
  return ApiResponse.created(res, coupon, "Coupon created.");
});

export const updateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await couponService.updateCoupon(req.params.id as string, req.body);
  return ApiResponse.ok(res, coupon, "Coupon updated.");
});

export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
  await couponService.deleteCoupon(req.params.id as string);
  return ApiResponse.ok(res, null, "Coupon deleted.");
});
