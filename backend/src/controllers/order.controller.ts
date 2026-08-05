import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import * as orderService from "@/services/order.service";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.createOrder({ ...req.body, userId: req.user?.id });
  return ApiResponse.created(res, order, "Order placed.");
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(req.params.id as string, {
    userId: req.user?.id,
    role: req.user?.role,
    email: req.query.email as string | undefined,
  });
  return ApiResponse.ok(res, order);
});

export const trackOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.getOrderByNumber(req.params.orderNumber as string, {
    userId: req.user?.id,
    role: req.user?.role,
    email: req.query.email as string | undefined,
  });
  return ApiResponse.ok(res, order);
});

export const getOrderHistory = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const { orders, meta } = await orderService.getUserOrderHistory(req.user!.id, page, limit);
  return ApiResponse.ok(res, orders, "Success", meta);
});

// ── Admin ──────────────────────────────────────────────────────────

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const { orders, meta } = await orderService.listAllOrders(
    page,
    limit,
    req.query.status as string | undefined,
    req.query.search as string | undefined
  );
  return ApiResponse.ok(res, orders, "Success", meta);
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.updateOrderStatus(req.params.id as string, req.body.status);
  return ApiResponse.ok(res, order, "Order status updated.");
});
