import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { MenuItem } from "@/models/MenuItem.model";
import { uniqueSlug } from "@/utils/slugify";
import * as menuService from "@/services/menu.service";

export const getMenuItems = asyncHandler(async (req: Request, res: Response) => {
  const { items, meta } = await menuService.listMenuItems(req.query as unknown as menuService.MenuQueryOptions);
  return ApiResponse.ok(res, items, "Success", meta);
});

export const getMenuItemBySlug = asyncHandler(async (req: Request, res: Response) => {
  const item = await menuService.getMenuItemBySlug(req.params.slug as string);
  const related = await menuService.getRelatedMenuItems(item);
  return ApiResponse.ok(res, { item, related });
});

export const searchMenu = asyncHandler(async (req: Request, res: Response) => {
  const results = await menuService.searchMenuItems((req.query.q as string) ?? "");
  return ApiResponse.ok(res, results);
});

export const getFeaturedMenu = asyncHandler(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit ?? 6);
  const items = await menuService.getFeaturedMenuItems(limit);
  return ApiResponse.ok(res, items);
});

export const getPopularMenu = asyncHandler(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit ?? 10);
  const items = await menuService.getPopularMenuItems(limit);
  return ApiResponse.ok(res, items);
});

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await menuService.listCategories();
  return ApiResponse.ok(res, categories);
});

// ── Admin ──────────────────────────────────────────────────────────

export const getAdminMenuItems = asyncHandler(async (req: Request, res: Response) => {
  const { items, meta } = await menuService.listMenuItems({
    ...(req.query as unknown as menuService.MenuQueryOptions),
    includeUnavailable: true,
  });
  return ApiResponse.ok(res, items, "Success", meta);
});

export const createMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const slug = await uniqueSlug(req.body.name, async (s) => !!(await MenuItem.exists({ slug: s })));
  const item = await MenuItem.create({ ...req.body, slug });
  return ApiResponse.created(res, item, "Menu item created.");
});

export const updateMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id as string, req.body, { new: true });
  if (!item) throw ApiError.notFound("Menu item not found.");
  return ApiResponse.ok(res, item, "Menu item updated.");
});

export const deleteMenuItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id as string);
  if (!item) throw ApiError.notFound("Menu item not found.");
  return ApiResponse.ok(res, null, "Menu item deleted.");
});
