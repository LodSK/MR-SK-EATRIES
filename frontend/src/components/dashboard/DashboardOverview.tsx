"use client";

import * as React from "react";
import { CalendarDays, Gift, Heart, Package, RotateCcw, ShoppingBag, User } from "lucide-react";
import { getDashboardSummary } from "@/lib/api/dashboard";
import { getOrderHistory } from "@/lib/api/orders";
import type { DashboardSummary } from "@/types/dashboard";
import { useAuth } from "@/lib/hooks/useAuth";
import { useCart } from "@/lib/hooks/useCart";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Skeleton } from "@/components/shared/Skeleton";

export function DashboardOverview() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [summary, setSummary] = React.useState<DashboardSummary | null>(null);

  React.useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

  async function handleReorderLast() {
    const history = await getOrderHistory(1, 1);
    const lastOrder = history[0];
    if (!lastOrder) return;
    lastOrder.items.forEach((item) => {
      addItem(
        { id: item.menuItem, name: item.name, category: "dinner", price: item.price, currency: item.currency },
        item.quantity
      );
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-2xl font-bold">Welcome back, {user?.fullName.split(" ")[0]}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Here's what's happening with your account.</p>
      </div>

      {!summary ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard icon={ShoppingBag} value={summary.totalOrders} label="Total Orders" />
          <StatCard icon={Package} value={summary.completedOrders} label="Completed Orders" />
          <StatCard icon={CalendarDays} value={summary.activeReservations} label="Active Reservations" />
          <StatCard icon={Heart} value={summary.favoriteCount} label="Favorite Meals" />
          <StatCard icon={Gift} value={summary.loyaltyPoints} label="Loyalty Points" />
        </div>
      )}

      <div>
        <h3 className="mb-4 font-display text-lg font-bold">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <QuickActionCard icon={RotateCcw} label="Reorder Last Meal" href="/account/orders" onClick={handleReorderLast} />
          <QuickActionCard icon={CalendarDays} label="Book Reservation" href="/reservations" />
          <QuickActionCard icon={ShoppingBag} label="View Orders" href="/account/orders" />
          <QuickActionCard icon={User} label="Edit Profile" href="/account/profile" />
        </div>
      </div>

      <DashboardCard title="Recent Activity">
        <RecentActivity activity={summary?.recentActivity ?? []} />
      </DashboardCard>
    </div>
  );
}
