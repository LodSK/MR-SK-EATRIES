import { User } from "@/models/User.model";
import { MenuItem } from "@/models/MenuItem.model";
import { ApiError } from "@/utils/ApiError";

export async function getCart(userId: string) {
  const user = await User.findById(userId).populate("cart.menuItem");
  if (!user) throw ApiError.notFound("Account not found.");
  return user.cart;
}

export async function addToCart(userId: string, menuItemId: string, quantity: number) {
  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem || !menuItem.isAvailable) throw ApiError.badRequest("Item is unavailable.");

  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("Account not found.");

  const existing = user.cart.find((line) => line.menuItem.toString() === menuItemId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    user.cart.push({ menuItem: menuItem._id, quantity });
  }
  await user.save();
  return user.populate("cart.menuItem");
}

export async function updateCartLine(userId: string, menuItemId: string, quantity: number) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("Account not found.");

  if (quantity <= 0) {
    user.cart = user.cart.filter((line) => line.menuItem.toString() !== menuItemId) as typeof user.cart;
  } else {
    const existing = user.cart.find((line) => line.menuItem.toString() === menuItemId);
    if (!existing) throw ApiError.notFound("Item not in cart.");
    existing.quantity = quantity;
  }
  await user.save();
  return user.populate("cart.menuItem");
}

export async function removeFromCart(userId: string, menuItemId: string) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("Account not found.");

  user.cart = user.cart.filter((line) => line.menuItem.toString() !== menuItemId) as typeof user.cart;
  await user.save();
  return user.populate("cart.menuItem");
}

export async function clearCart(userId: string) {
  const user = await User.findByIdAndUpdate(userId, { cart: [] }, { new: true });
  if (!user) throw ApiError.notFound("Account not found.");
  return user.cart;
}
