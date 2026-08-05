"use client";

import { CheckCircle2, Circle, Clock, Download, MapPin, Store } from "lucide-react";
import type { Order, OrderStatus } from "@/types/order";
import { formatCurrency } from "@/lib/utils/cart";
import { PriceBreakdown } from "@/components/cart/PriceBreakdown";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const TIMELINE_STEPS: OrderStatus[] = ["pending", "preparing", "ready", "completed"];
const STEP_LABEL: Record<OrderStatus, string> = {
  pending: "Order Placed",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

function downloadReceipt(order: Order) {
  const lines = [
    `MR_SK EATRIES — Receipt`,
    `Order: ${order.orderNumber}`,
    `Date: ${new Date(order.createdAt).toLocaleString()}`,
    ``,
    ...order.items.map(
      (item) => `${item.quantity} × ${item.name} — ${formatCurrency(item.price * item.quantity, item.currency)}`
    ),
    ``,
    `Subtotal: ${formatCurrency(order.subtotal)}`,
    order.discount > 0 ? `Discount: -${formatCurrency(order.discount)}` : null,
    `Delivery Fee: ${formatCurrency(order.deliveryFee)}`,
    `Service Charge: ${formatCurrency(order.serviceCharge)}`,
    `Tax: ${formatCurrency(order.tax)}`,
    `Grand Total: ${formatCurrency(order.grandTotal)}`,
    ``,
    `Payment: ${order.paymentMethod}`,
    `Delivery: ${order.deliveryMethod}`,
  ].filter(Boolean);

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${order.orderNumber}-receipt.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function OrderDetails({ order }: { order: Order }) {
  const isCancelled = order.status === "cancelled";
  const currentStepIndex = TIMELINE_STEPS.indexOf(order.status);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-muted-foreground">{order.orderNumber}</p>
          <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => downloadReceipt(order)}>
          <Download className="h-3.5 w-3.5" />
          Download Receipt
        </Button>
      </div>

      {!isCancelled ? (
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-6">
          {TIMELINE_STEPS.map((step, i) => {
            const isDone = i <= currentStepIndex;
            return (
              <div key={step} className="flex flex-1 flex-col items-center gap-2 text-center">
                <div className="flex w-full items-center">
                  {i > 0 && (
                    <div className={cn("h-0.5 flex-1", isDone ? "bg-brand-primary dark:bg-brand-accent" : "bg-border")} />
                  )}
                  {isDone ? (
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-brand-primary dark:text-brand-accent" />
                  ) : (
                    <Circle className="h-6 w-6 shrink-0 text-border" />
                  )}
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div
                      className={cn("h-0.5 flex-1", i < currentStepIndex ? "bg-brand-primary dark:bg-brand-accent" : "bg-border")}
                    />
                  )}
                </div>
                <span className={cn("text-xs font-medium", isDone ? "text-foreground" : "text-muted-foreground")}>
                  {STEP_LABEL[step]}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-center text-sm font-medium text-destructive">
          This order was cancelled.
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-base font-bold">Items</h2>
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.menuItem} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold">
                {formatCurrency(item.price * item.quantity, item.currency)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-3 flex items-center gap-2 font-display text-base font-bold">
            {order.deliveryMethod === "pickup" ? <Store className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
            {order.deliveryMethod === "pickup" ? "Pickup" : "Delivery"}
          </h2>
          {order.deliveryAddress ? (
            <p className="text-sm text-muted-foreground">
              {order.deliveryAddress.street}, {order.deliveryAddress.city}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Collect from the restaurant.</p>
          )}
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Estimated {order.estimatedDeliveryMinutes[0]}–{order.estimatedDeliveryMinutes[1]} min
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-3 font-display text-base font-bold">Payment</h2>
          <Badge variant="outline" className="capitalize">
            {order.paymentMethod}
          </Badge>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-4 font-display text-base font-bold">Receipt Summary</h2>
        <PriceBreakdown totals={order} />
      </div>
    </div>
  );
}
