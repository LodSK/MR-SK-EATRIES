"use client";

import * as React from "react";
import { Search, Loader2 } from "lucide-react";
import { trackOrder } from "@/lib/api/orders";
import type { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { OrderDetails } from "@/components/dashboard/OrderDetails";

export function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [order, setOrder] = React.useState<Order | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSearching(true);
    setError(null);
    setOrder(null);

    const result = await trackOrder(orderNumber.trim(), email.trim());
    setIsSearching(false);

    if (!result.success || !result.order) {
      setError(result.message);
      return;
    }
    setOrder(result.order);
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <label htmlFor="order-number" className="mb-1.5 block text-sm font-semibold">
            Order Number
          </label>
          <input
            id="order-number"
            type="text"
            required
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="e.g. MRSK-123456"
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </div>
        <div>
          <label htmlFor="order-email" className="mb-1.5 block text-sm font-semibold">
            Email Address
          </label>
          <input
            id="order-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={isSearching} className="self-start">
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Track Order
        </Button>
      </form>

      {order && <OrderDetails order={order} />}
    </div>
  );
}
