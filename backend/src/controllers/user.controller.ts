import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import * as userService from "@/services/user.service";
import * as orderService from "@/services/order.service";
import * as reservationService from "@/services/reservation.service";
import type { Role } from "@/config/constants";

export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await userService.addUserAddress(req.user!.id, req.body);
  return ApiResponse.created(res, addresses, "Address added.");
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await userService.updateUserAddress(req.user!.id, req.params.addressId as string, req.body);
  return ApiResponse.ok(res, addresses, "Address updated.");
});

export const removeAddress = asyncHandler(async (req: Request, res: Response) => {
  const addresses = await userService.removeUserAddress(req.user!.id, req.params.addressId as string);
  return ApiResponse.ok(res, addresses, "Address removed.");
});

export const getDashboardSummary = asyncHandler(async (req: Request, res: Response) => {
  const summary = await userService.getDashboardSummary(req.user!.id);
  return ApiResponse.ok(res, summary);
});

// ── Admin ──────────────────────────────────────────────────────────

export const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const { users, meta } = await userService.listUsers(
    page,
    limit,
    req.query.role as Role | undefined,
    req.query.search as string | undefined
  );
  return ApiResponse.ok(res, users, "Success", meta);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id as string);
  return ApiResponse.ok(res, user);
});

export const getUserOrders = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const { orders, meta } = await orderService.getUserOrderHistory(req.params.id as string, page, limit);
  return ApiResponse.ok(res, orders, "Success", meta);
});

export const getUserReservations = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const { reservations, meta } = await reservationService.getUserReservations(req.params.id as string, page, limit);
  return ApiResponse.ok(res, reservations, "Success", meta);
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateUserRole(req.params.id as string, req.body.role);
  return ApiResponse.ok(res, user, "User role updated.");
});

export const setUserActive = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.setUserActive(req.params.id as string, req.body.isActive);
  return ApiResponse.ok(res, user, req.body.isActive ? "Account activated." : "Account suspended.");
});
