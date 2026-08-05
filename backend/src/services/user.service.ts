import { User, type Address } from "@/models/User.model";
import { Order } from "@/models/Order.model";
import { Reservation } from "@/models/Reservation.model";
import { Wishlist } from "@/models/Wishlist.model";
import { ApiError } from "@/utils/ApiError";
import { buildPaginationMeta } from "@/utils/ApiResponse";
import type { Role } from "@/config/constants";

export async function addUserAddress(userId: string, address: Omit<Address, "isDefault"> & { isDefault?: boolean }) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("Account not found.");

  if (address.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  user.addresses.push({ ...address, isDefault: address.isDefault ?? user.addresses.length === 0 } as Address);
  await user.save();
  return user.addresses;
}

export async function updateUserAddress(userId: string, addressId: string, patch: Partial<Address>) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("Account not found.");

  const address = user.addresses.find((a) => a._id?.toString() === addressId);
  if (!address) throw ApiError.notFound("Address not found.");

  if (patch.isDefault) {
    user.addresses.forEach((a) => (a.isDefault = false));
  }
  Object.assign(address, patch);
  await user.save();
  return user.addresses;
}

export async function removeUserAddress(userId: string, addressId: string) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("Account not found.");

  user.addresses = user.addresses.filter((a) => a._id?.toString() !== addressId) as typeof user.addresses;
  await user.save();
  return user.addresses;
}

export async function listUsers(page: number, limit: number, role?: Role, search?: string) {
  const filter: Record<string, unknown> = {};
  if (role) filter.role = role;
  if (search) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [{ fullName: regex }, { email: regex }];
  }
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);
  return { users, meta: buildPaginationMeta(page, limit, total) };
}

export async function getUserById(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("Account not found.");
  return user;
}

export async function updateUserRole(userId: string, role: Role) {
  const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
  if (!user) throw ApiError.notFound("Account not found.");
  return user;
}

export async function setUserActive(userId: string, isActive: boolean) {
  const user = await User.findByIdAndUpdate(userId, { isActive }, { new: true });
  if (!user) throw ApiError.notFound("Account not found.");
  return user;
}

/**
 * Powers the Dashboard Overview. Reuses the existing Order/Reservation/
 * Wishlist models directly rather than introducing a new aggregation
 * layer — this is a read-only summary, not new business logic.
 */
export async function getDashboardSummary(userId: string) {
  const [totalOrders, completedOrders, activeReservations, wishlist, recentOrders] = await Promise.all([
    Order.countDocuments({ user: userId }),
    Order.countDocuments({ user: userId, status: "completed" }),
    Reservation.countDocuments({ user: userId, status: { $in: ["pending", "confirmed"] } }),
    Wishlist.findOne({ user: userId }),
    Order.find({ user: userId }).sort({ createdAt: -1 }).limit(5).select("orderNumber status grandTotal createdAt"),
  ]);

  return {
    totalOrders,
    completedOrders,
    activeReservations,
    favoriteCount: wishlist?.menuItems.length ?? 0,
    // Loyalty points are an explicit placeholder per Sprint 11's scope — no points system exists yet.
    loyaltyPoints: 0,
    recentActivity: recentOrders,
  };
}
