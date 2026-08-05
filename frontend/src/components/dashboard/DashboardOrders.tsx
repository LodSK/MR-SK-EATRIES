"use client";

import * as React from "react";
import { PackageX } from "lucide-react";
import { getOrderHistory } from "@/lib/api/orders";
import type { Order, OrderStatus } from "@/types/order";
import { useCart } from "@/lib/hooks/useCart";
import { OrderCard } from "@/components/dashboard/OrderCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { cn } from "@/lib/utils/cn";

const FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function DashboardOrders() {
  const [orders, setOrders] = React.useState<Order[] | null>(null);
  const [filter, setFilter] = React.useState<OrderStatus | "all">("all");
  const { addItem, openDrawer } = useCart();

  React.useEffect(() => {
    getOrderHistory()
      .then(setOrders)
      .catch(() => setOrders([]));
  }, []);

  function handleReorder(order: Order) {
    order.items.forEach((item) => {
      addItem(
        { id: item.menuItem, name: item.name, category: "dinner", price: item.price, currency: item.currency },
        item.quantity
      );
    });
    openDrawer();
  }

  const filtered = orders?.filter((o) => filter === "all" || o.status === filter) ?? [];

  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" aria-label="Filter orders" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              filter === f.value
                ? "border-brand-primary bg-brand-primary text-white dark:border-brand-accent dark:bg-brand-accent dark:text-brand-secondary"
                : "border-border text-muted-foreground hover:border-brand-primary/40"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {orders === null ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<PackageX className="h-6 w-6" strokeWidth={1.5} />}
          title="No orders here"
          description="Orders matching this filter will show up here."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} onReorder={handleReorder} />
          ))}
        </div>
      )}
    </div>
  );
}
