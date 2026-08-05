"use client";

import * as React from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  CalendarDays,
  Users,
  UtensilsCrossed,
  Ticket,
  Plus,
} from "lucide-react";
import { getAdminDashboardSummary, getRevenueChart } from "@/lib/api/admin";
import type { AdminDashboardSummary, ChartPoint } from "@/types/admin";
import { formatCurrency } from "@/lib/utils/cart";
import { StatCard } from "@/components/dashboard/StatCard";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { AnalyticsAreaChart } from "@/components/admin/AnalyticsAreaChart";
import { PopularMealsList } from "@/components/admin/PopularMealsList";
import { Skeleton } from "@/components/shared/Skeleton";

export function AdminOverview() {
  const [summary, setSummary] = React.useState<AdminDashboardSummary | null>(null);
  const [revenue, setRevenue] = React.useState<ChartPoint[] | null>(null);

  React.useEffect(() => {
    getAdminDashboardSummary().then(setSummary).catch(() => setSummary(null));
    getRevenueChart(14).then(setRevenue).catch(() => setRevenue([]));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="font-display text-2xl font-bold">Restaurant Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">Live snapshot of orders, reservations, and revenue.</p>
      </div>

      {!summary ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard icon={DollarSign} value={summary.totalRevenue} format={formatCurrency} label="Total Revenue" />
          <StatCard icon={ShoppingBag} value={summary.totalOrders} label="Total Orders" />
          <StatCard icon={CalendarDays} value={summary.reservationSummary.today} label="Today's Reservations" />
          <StatCard icon={Users} value={summary.customerSummary.total} label="Total Customers" />
          <StatCard icon={UtensilsCrossed} value={summary.totalMenuItems} label="Menu Items" />
        </div>
      )}

      <div>
        <h3 className="mb-4 font-display text-lg font-bold">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <QuickActionCard icon={Plus} label="Add Menu Item" href="/admin/menu" />
          <QuickActionCard icon={ShoppingBag} label="View Orders" href="/admin/orders" />
          <QuickActionCard icon={CalendarDays} label="View Reservations" href="/admin/reservations" />
          <QuickActionCard icon={Ticket} label="New Coupon" href="/admin/coupons" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <DashboardCard title="Revenue (Last 14 Days)">
          {revenue === null ? (
            <Skeleton className="h-56 w-full" />
          ) : (
            <AnalyticsAreaChart data={revenue} dataKey="revenue" color="#C62828" valuePrefix="GHS " />
          )}
        </DashboardCard>

        <DashboardCard title="Popular Meals">
          {!summary ? <Skeleton className="h-56 w-full" /> : <PopularMealsList items={summary.topMenuItems} />}
        </DashboardCard>
      </div>

      {summary && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/admin/orders"
            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-brand-primary/40"
          >
            <p className="text-xs font-semibold text-muted-foreground">Orders by Status</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {Object.entries(summary.ordersByStatus).map(([status, count]) => (
                <span key={status} className="capitalize text-muted-foreground">
                  {status}: <span className="font-semibold text-foreground">{count}</span>
                </span>
              ))}
            </div>
          </Link>
          <Link
            href="/admin/reservations"
            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-brand-primary/40"
          >
            <p className="text-xs font-semibold text-muted-foreground">Reservations</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Today: <span className="font-semibold text-foreground">{summary.reservationSummary.today}</span>
              {" · "}
              Upcoming: <span className="font-semibold text-foreground">{summary.reservationSummary.upcoming}</span>
            </p>
          </Link>
          <Link
            href="/admin/users"
            className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-brand-primary/40"
          >
            <p className="text-xs font-semibold text-muted-foreground">Customers</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Active: <span className="font-semibold text-foreground">{summary.customerSummary.active}</span>
              {" · "}
              New this week:{" "}
              <span className="font-semibold text-foreground">{summary.customerSummary.newThisWeek}</span>
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}
