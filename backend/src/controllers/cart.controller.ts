import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import * as cartService from "@/services/cart.service";

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.getCart(req.user!.id);
  return ApiResponse.ok(res, cart);
});

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { menuItemId, quantity } = req.body;
  const user = await cartService.addToCart(req.user!.id, menuItemId, quantity ?? 1);
  return ApiResponse.ok(res, user.cart, "Added to cart.");
});

export const updateCartLine = asyncHandler(async (req: Request, res: Response) => {
  const { menuItemId, quantity } = req.body;
  const user = await cartService.updateCartLine(req.user!.id, menuItemId, quantity);
  return ApiResponse.ok(res, user.cart, "Cart updated.");
});

export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const user = await cartService.removeFromCart(req.user!.id, req.params.menuItemId as string);
  return ApiResponse.ok(res, user.cart, "Item removed.");
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.clearCart(req.user!.id);
  return ApiResponse.ok(res, cart, "Cart cleared.");
});
