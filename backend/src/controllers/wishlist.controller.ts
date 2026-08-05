import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { Wishlist } from "@/models/Wishlist.model";

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await Wishlist.findOne({ user: req.user!.id }).populate("menuItems");
  return ApiResponse.ok(res, wishlist?.menuItems ?? []);
});

export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const { menuItemId } = req.body;
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: req.user!.id },
    { $addToSet: { menuItems: menuItemId } },
    { upsert: true, new: true }
  ).populate("menuItems");
  return ApiResponse.ok(res, wishlist.menuItems, "Added to wishlist.");
});

export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { user: req.user!.id },
    { $pull: { menuItems: req.params.menuItemId } },
    { new: true }
  ).populate("menuItems");
  return ApiResponse.ok(res, wishlist?.menuItems ?? [], "Removed from wishlist.");
});
