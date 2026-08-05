export interface AdminDashboardSummary {
  totalOrders: number;
  totalUsers: number;
  totalReservations: number;
  totalMenuItems: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  topMenuItems: { name: string; popularityScore: number; price: number; category: string }[];
  reservationSummary: { today: number; upcoming: number };
  customerSummary: { total: number; active: number; newThisWeek: number };
}

export interface ChartPoint {
  _id: string;
  revenue?: number;
  orders?: number;
  count?: number;
}

export interface SystemAlerts {
  lowStockItems: { _id: string; name: string; stockQuantity: number }[];
  lowStockCount: number;
}

export interface AdminCustomer {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}
