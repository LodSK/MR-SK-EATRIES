"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import type { Order } from "@/types/order";
import { formatCurrency } from "@/lib/utils/cart";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/hooks/useCart";

interface OrderCardProps {
  order: Order;
  onReorder?: (order: Order) => void;
}

const STATUS_VARIANT: Record<Order["status"], "outline" | "primary" | "success" | "secondary" | "spicy"> = {
  pending: "outline",
  preparing: "primary",
  ready: "primary",
  completed: "success",
  cancelled: "spicy",
};

export function OrderCard({ order, onReorder }: OrderCardProps) {
  const { openDrawer } = useCart();

  function handleReorder() {
    onReorder?.(order);
    openDrawer();
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-brand-accent">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <p className="font-mono text-sm font-semibold">{order.orderNumber}</p>
            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[order.status]}>{order.status}</Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        {order.items.length} {order.items.length === 1 ? "item" : "items"} · {order.paymentMethod} ·{" "}
        {order.deliveryMethod}
      </p>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="font-display text-lg font-bold">{formatCurrency(order.grandTotal)}</span>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/account/orders/${order.id}`}>View Details</Link>
          </Button>
          {order.status === "completed" && (
            <Button variant="default" size="sm" onClick={handleReorder}>
              Reorder
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
