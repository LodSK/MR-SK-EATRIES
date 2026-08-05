import type { Request, Response } from "express";
import { Types } from "mongoose";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { Review } from "@/models/Review.model";
import { MenuItem } from "@/models/MenuItem.model";

async function recalculateItemRating(menuItemId: string) {
  const stats = await Review.aggregate([
    { $match: { menuItem: new Types.ObjectId(menuItemId), isApproved: true } },
    { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const { avgRating = 0, count = 0 } = stats[0] ?? {};
  await MenuItem.findByIdAndUpdate(menuItemId, {
    rating: Math.round(avgRating * 10) / 10,
    reviewCount: count,
  });
}

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { menuItemId, rating, comment } = req.body;

  const existing = await Review.findOne({ user: req.user!.id, menuItem: menuItemId });
  if (existing) throw ApiError.conflict("You've already reviewed this item.");

  const review = await Review.create({ user: req.user!.id, menuItem: menuItemId, rating, comment });
  await recalculateItemRating(menuItemId);

  return ApiResponse.created(res, review, "Review submitted.");
});

export const getMenuItemReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await Review.find({ menuItem: req.params.menuItemId, isApproved: true })
    .populate("user", "fullName avatarUrl")
    .sort({ createdAt: -1 });
  return ApiResponse.ok(res, reviews);
});

// ── Admin ──────────────────────────────────────────────────────────

export const listAllReviews = asyncHandler(async (_req: Request, res: Response) => {
  const reviews = await Review.find().populate("user", "fullName").populate("menuItem", "name").sort({ createdAt: -1 });
  return ApiResponse.ok(res, reviews);
});

export const moderateReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, { new: true });
  if (!review) throw ApiError.notFound("Review not found.");
  await recalculateItemRating(review.menuItem.toString());
  return ApiResponse.ok(res, review, "Review updated.");
});
