import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import * as paymentMethodService from "@/services/payment-method.service";

export const getPaymentMethods = asyncHandler(async (req: Request, res: Response) => {
  const methods = await paymentMethodService.listPaymentMethods(req.user!.id);
  return ApiResponse.ok(res, methods);
});

export const createPaymentMethod = asyncHandler(async (req: Request, res: Response) => {
  const method = await paymentMethodService.createPaymentMethod(req.user!.id, req.body);
  return ApiResponse.created(res, method, "Card saved.");
});

export const setDefaultPaymentMethod = asyncHandler(async (req: Request, res: Response) => {
  const method = await paymentMethodService.setDefaultPaymentMethod(req.user!.id, req.params.id as string);
  return ApiResponse.ok(res, method, "Default card updated.");
});

export const deletePaymentMethod = asyncHandler(async (req: Request, res: Response) => {
  await paymentMethodService.deletePaymentMethod(req.user!.id, req.params.id as string);
  return ApiResponse.ok(res, null, "Card removed.");
});
