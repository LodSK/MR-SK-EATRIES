import type { Order } from "@/types/order";

export interface DashboardSummary {
  totalOrders: number;
  completedOrders: number;
  activeReservations: number;
  favoriteCount: number;
  loyaltyPoints: number;
  recentActivity: Pick<Order, "orderNumber" | "status" | "grandTotal" | "createdAt">[];
}
