"use client";

import * as React from "react";
import Link from "next/link";
import { PackageX } from "lucide-react";
import { adminListOrders, adminUpdateOrderStatus } from "@/lib/api/orders";
import type { Order, OrderStatus } from "@/types/order";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { formatCurrency } from "@/lib/utils/cart";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { OrderStatusActions } from "@/components/admin/OrderStatusActions";
import { Badge, type BadgeVariant } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_VARIANT: Record<OrderStatus, BadgeVariant> = {
  pending: "outline",
  preparing: "primary",
  ready: "primary",
  completed: "success",
  cancelled: "spicy",
};

export function AdminOrders() {
  const [orders, setOrders] = React.useState<Order[] | null>(null);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const debouncedSearch = useDebouncedValue(search, 300);

  const load = React.useCallback(() => {
    adminListOrders({ search: debouncedSearch || undefined, status: status === "all" ? undefined : status })
      .then((res) => setOrders(res.orders))
      .catch(() => setOrders([]));
  }, [debouncedSearch, status]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(orderId: string, next: OrderStatus) {
    const result = await adminUpdateOrderStatus(orderId, next);
    if (result.success) load();
  }

  return (
    <div className="flex flex-col gap-5">
      <AdminSearchBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by order number, name, or email…"
        filterValue={status}
        onFilterChange={setStatus}
        filterOptions={STATUS_OPTIONS}
        filterPlaceholder="All Statuses"
      />

      {orders === null ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<PackageX className="h-6 w-6" strokeWidth={1.5} />}
          title="No orders found"
          description="Try a different search or filter."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div key={order.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Link href={`/account/orders/${order.id}`} className="font-mono text-sm font-semibold hover:text-brand-primary dark:hover:text-brand-accent">
                    {order.orderNumber}
                  </Link>
                  <Badge variant={STATUS_VARIANT[order.status]}>{order.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {order.customerName} · {order.customerEmail} · {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="mt-1 text-sm font-semibold">{formatCurrency(order.grandTotal)}</p>
              </div>
              <OrderStatusActions status={order.status} onChange={(next) => handleStatusChange(order.id, next)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
