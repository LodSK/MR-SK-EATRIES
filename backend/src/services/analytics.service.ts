import { Order } from "@/models/Order.model";
import { User } from "@/models/User.model";
import { Reservation } from "@/models/Reservation.model";
import { MenuItem } from "@/models/MenuItem.model";

const LOW_STOCK_THRESHOLD = 10;

export async function getDashboardSummary() {
  const [
    totalOrders,
    totalUsers,
    totalReservations,
    totalMenuItems,
    revenueAgg,
    statusBreakdown,
    topItems,
    todayReservations,
    upcomingReservations,
    newCustomersThisWeek,
    activeCustomers,
  ] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Reservation.countDocuments(),
    MenuItem.countDocuments(),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, totalRevenue: { $sum: "$grandTotal" } } },
    ]),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    MenuItem.find().sort({ popularityScore: -1 }).limit(5).select("name popularityScore price category"),
    Reservation.countDocuments({
      date: { $gte: startOfToday(), $lt: endOfToday() },
      status: { $nin: ["cancelled"] },
    }),
    Reservation.countDocuments({ date: { $gte: startOfToday() }, status: { $in: ["pending", "confirmed"] } }),
    User.countDocuments({ role: "customer", createdAt: { $gte: daysAgo(7) } }),
    User.countDocuments({ role: "customer", isActive: true }),
  ]);

  return {
    totalOrders,
    totalUsers,
    totalReservations,
    totalMenuItems,
    totalRevenue: revenueAgg[0]?.totalRevenue ?? 0,
    ordersByStatus: statusBreakdown.reduce<Record<string, number>>((acc, row) => {
      acc[row._id as string] = row.count;
      return acc;
    }, {}),
    topMenuItems: topItems,
    reservationSummary: {
      today: todayReservations,
      upcoming: upcomingReservations,
    },
    customerSummary: {
      total: totalUsers,
      active: activeCustomers,
      newThisWeek: newCustomersThisWeek,
    },
  };
}

export async function getRevenueByDay(days = 14) {
  const since = daysAgo(days);

  return Order.aggregate([
    { $match: { createdAt: { $gte: since }, status: { $ne: "cancelled" } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$grandTotal" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
}

export async function getOrdersByDay(days = 14) {
  const since = daysAgo(days);

  return Order.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
}

export async function getReservationsByDay(days = 14) {
  const since = daysAgo(days);

  return Reservation.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
}

/**
 * Notification Center's "System Alerts" — computed on read from existing
 * data (low stock) rather than a stored notification-per-admin design,
 * since these are facts about current state, not events to acknowledge
 * one at a time.
 */
export async function getSystemAlerts() {
  const lowStockItems = await MenuItem.find({
    isAvailable: true,
    stockQuantity: { $lte: LOW_STOCK_THRESHOLD },
  })
    .select("name stockQuantity")
    .limit(10);

  return {
    lowStockItems,
    lowStockCount: lowStockItems.length,
  };
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfToday(): Date {
  const d = startOfToday();
  d.setDate(d.getDate() + 1);
  return d;
}

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}
