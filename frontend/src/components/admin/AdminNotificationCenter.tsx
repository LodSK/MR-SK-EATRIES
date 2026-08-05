"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, CalendarDays, ShoppingBag } from "lucide-react";
import { adminListOrders } from "@/lib/api/orders";
import { adminListReservations } from "@/lib/api/reservation";
import { getSystemAlerts } from "@/lib/api/admin";
import type { Order } from "@/types/order";
import type { Reservation } from "@/types/reservation";
import type { SystemAlerts } from "@/types/admin";
import { formatCurrency } from "@/lib/utils/cart";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Skeleton } from "@/components/shared/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";

export function AdminNotificationCenter() {
  const [orders, setOrders] = React.useState<Order[] | null>(null);
  const [reservations, setReservations] = React.useState<Reservation[] | null>(null);
  const [alerts, setAlerts] = React.useState<SystemAlerts | null>(null);

  React.useEffect(() => {
    adminListOrders({ limit: 5 }).then((res) => setOrders(res.orders)).catch(() => setOrders([]));
    adminListReservations({ limit: 5, sort: "newest" }).then((res) => setReservations(res.reservations)).catch(() => setReservations([]));
    getSystemAlerts().then(setAlerts).catch(() => setAlerts(null));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <DashboardCard title="System Alerts">
        {alerts === null ? (
          <Skeleton className="h-16 w-full" />
        ) : alerts.lowStockCount === 0 ? (
          <p className="text-sm text-muted-foreground">No active alerts — everything looks good.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {alerts.lowStockItems.map((item) => (
              <li key={item._id} className="flex items-center gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2.5 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  <strong>{item.name}</strong> is low on stock ({item.stockQuantity} left)
                </span>
              </li>
            ))}
          </ul>
        )}
      </DashboardCard>

      <DashboardCard title="Recent Orders">
        {orders === null ? (
          <Skeleton className="h-32 w-full" />
        ) : orders.length === 0 ? (
          <EmptyState icon={<ShoppingBag className="h-6 w-6" strokeWidth={1.5} />} title="No orders yet" description="" />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {orders.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3 py-3">
                <Link href="/admin/orders" className="font-mono text-sm hover:text-brand-primary dark:hover:text-brand-accent">
                  {order.orderNumber}
                </Link>
                <span className="text-xs capitalize text-muted-foreground">{order.status}</span>
                <span className="text-sm font-semibold">{formatCurrency(order.grandTotal)}</span>
              </li>
            ))}
          </ul>
        )}
      </DashboardCard>

      <DashboardCard title="Recent Reservations">
        {reservations === null ? (
          <Skeleton className="h-32 w-full" />
        ) : reservations.length === 0 ? (
          <EmptyState icon={<CalendarDays className="h-6 w-6" strokeWidth={1.5} />} title="No reservations yet" description="" />
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {reservations.map((reservation) => (
              <li key={reservation.id} className="flex items-center justify-between gap-3 py-3">
                <Link href="/admin/reservations" className="font-mono text-sm hover:text-brand-primary dark:hover:text-brand-accent">
                  {reservation.reservationNumber}
                </Link>
                <span className="text-xs text-muted-foreground">{reservation.fullName}</span>
                <span className="text-xs capitalize text-muted-foreground">{reservation.status}</span>
              </li>
            ))}
          </ul>
        )}
      </DashboardCard>
    </div>
  );
}
