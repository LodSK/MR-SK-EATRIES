"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";
import type { SubmitOrderResult } from "@/types/cart";
import { useCart } from "@/lib/hooks/useCart";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations/variants";

export function CheckoutPageContent() {
  const { items, totals, deliveryMethod, hasHydrated } = useCart();
  const [orderResult, setOrderResult] = React.useState<SubmitOrderResult | null>(null);

  const currency = items[0]?.currency ?? "GHS";

  if (orderResult) {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="section-container flex flex-col items-center gap-5 py-24 text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl font-bold">Order Placed!</h1>
        <p className="max-w-md text-muted-foreground">{orderResult.message}</p>
        <p className="font-mono text-sm text-muted-foreground">
          Order Reference: <span className="font-bold text-foreground">{orderResult.orderId}</span>
        </p>
        <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
          <Clock className="h-4 w-4 text-brand-primary dark:text-brand-accent" />
          Estimated {orderResult.estimatedDeliveryMinutes[0]}–{orderResult.estimatedDeliveryMinutes[1]}{" "}
          minutes
        </div>
        <Button asChild size="lg" variant="accent" className="mt-4">
          <Link href="/menu">Back to Menu</Link>
        </Button>
      </motion.div>
    );
  }

  // Avoid rendering the empty-cart state before the persisted cart has loaded on the client.
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
      <CheckoutForm onSuccess={setOrderResult} />
      <div className="lg:sticky lg:top-24 lg:self-start">
        <OrderSummary items={items} totals={totals} deliveryMethod={deliveryMethod} currency={currency} />
      </div>
    </div>
  );
}
