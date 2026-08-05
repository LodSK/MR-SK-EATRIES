import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import * as analyticsService from "@/services/analytics.service";

export const getDashboardSummary = asyncHandler(async (_req: Request, res: Response) => {
  const summary = await analyticsService.getDashboardSummary();
  return ApiResponse.ok(res, summary);
});

export const getRevenueChart = asyncHandler(async (req: Request, res: Response) => {
  const days = Number(req.query.days ?? 14);
  const data = await analyticsService.getRevenueByDay(days);
  return ApiResponse.ok(res, data);
});

export const getOrdersChart = asyncHandler(async (req: Request, res: Response) => {
  const days = Number(req.query.days ?? 14);
  const data = await analyticsService.getOrdersByDay(days);
  return ApiResponse.ok(res, data);
});

export const getReservationsChart = asyncHandler(async (req: Request, res: Response) => {
  const days = Number(req.query.days ?? 14);
  const data = await analyticsService.getReservationsByDay(days);
  return ApiResponse.ok(res, data);
});

export const getSystemAlerts = asyncHandler(async (_req: Request, res: Response) => {
  const alerts = await analyticsService.getSystemAlerts();
  return ApiResponse.ok(res, alerts);
});
