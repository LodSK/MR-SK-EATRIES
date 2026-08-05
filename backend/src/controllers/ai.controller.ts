import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { AIService } from "@/services/ai/ai.service";

export const chat = asyncHandler(async (req: Request, res: Response) => {
  const result = await AIService.chat(req.body, req.user?.id);
  return ApiResponse.ok(res, result, "Success");
});

export const recommend = asyncHandler(async (req: Request, res: Response) => {
  const result = await AIService.recommend({ ...req.body, userId: req.user?.id });
  return ApiResponse.ok(res, result, "Success");
});

export const search = asyncHandler(async (req: Request, res: Response) => {
  const result = await AIService.search(req.body.query);
  return ApiResponse.ok(res, result, "Success");
});

export const insights = asyncHandler(async (_req: Request, res: Response) => {
  const result = await AIService.getInsights();
  return ApiResponse.ok(res, result, "Success");
});

export const predict = asyncHandler(async (req: Request, res: Response) => {
  const result = await AIService.predict(req.body);
  return ApiResponse.ok(res, result, "Success");
});
