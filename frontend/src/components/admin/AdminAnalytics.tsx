"use client";

import * as React from "react";
import { getRevenueChart, getOrdersChart, getReservationsChart } from "@/lib/api/admin";
import type { ChartPoint } from "@/types/admin";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { AnalyticsAreaChart } from "@/components/admin/AnalyticsAreaChart";
import { Skeleton } from "@/components/shared/Skeleton";
import { cn } from "@/lib/utils/cn";

const PERIODS = [
  { label: "Weekly", days: 7 },
  { label: "Monthly", days: 30 },
];

export function AdminAnalytics() {
  const [days, setDays] = React.useState(30);
  const [revenue, setRevenue] = React.useState<ChartPoint[] | null>(null);
  const [orders, setOrders] = React.useState<ChartPoint[] | null>(null);
  const [reservations, setReservations] = React.useState<ChartPoint[] | null>(null);

  React.useEffect(() => {
    setRevenue(null);
    setOrders(null);
    setReservations(null);
    getRevenueChart(days).then(setRevenue).catch(() => setRevenue([]));
    getOrdersChart(days).then(setOrders).catch(() => setOrders([]));
    getReservationsChart(days).then(setReservations).catch(() => setReservations([]));
  }, [days]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Analytics</h2>
          <p className="mt-1 text-sm text-muted-foreground">Revenue, orders, and reservations over time.</p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map((period) => (
            <button
              key={period.days}
              type="button"
              onClick={() => setDays(period.days)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                days === period.days
                  ? "border-brand-primary bg-brand-primary text-white dark:border-brand-accent dark:bg-brand-accent dark:text-brand-secondary"
                  : "border-border text-muted-foreground hover:border-brand-primary/40"
              )}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <DashboardCard title="Revenue">
        {revenue === null ? <Skeleton className="h-56 w-full" /> : <AnalyticsAreaChart data={revenue} dataKey="revenue" color="#C62828" valuePrefix="GHS " />}
      </DashboardCard>

      <DashboardCard title="Orders">
        {orders === null ? <Skeleton className="h-56 w-full" /> : <AnalyticsAreaChart data={orders} dataKey="orders" color="#FFD54F" />}
      </DashboardCard>

      <DashboardCard title="Reservations">
        {reservations === null ? <Skeleton className="h-56 w-full" /> : <AnalyticsAreaChart data={reservations} dataKey="count" color="#111111" />}
      </DashboardCard>
    </div>
  );
}
