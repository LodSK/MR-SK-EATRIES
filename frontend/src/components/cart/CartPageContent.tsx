"use client";

import { Trash2 } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";

export function CartPageContent() {
  const { items, totals, hasHydrated, clearCart } = useCart();
  const currency = items[0]?.currency ?? "GHS";

  if (!hasHydrated) return null;

  if (items.length === 0) {
    return (
      <div className="section-container py-24">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="section-container grid grid-cols-1 gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_400px] lg:gap-14">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Your Cart</h1>
          <button
            type="button"
            onClick={clearCart}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Cart
          </button>
        </div>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card px-6">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24 lg:self-start">
        <h2 className="mb-4 font-display text-lg font-bold">Order Summary</h2>
        <CartSummary totals={totals} currency={currency} />
      </div>
    </div>
  );
}
