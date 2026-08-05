"use client";

import * as React from "react";
import { CheckCircle2, Loader2, Tag, X, XCircle } from "lucide-react";
import { validateCoupon } from "@/lib/api/cart";
import { useCart } from "@/lib/hooks/useCart";
import { Button } from "@/components/ui/button";

type CouponStatus = "idle" | "checking" | "success" | "error";

export function CouponInput() {
  const { coupon, totals, applyCouponResult } = useCart();
  const [code, setCode] = React.useState("");
  const [status, setStatus] = React.useState<CouponStatus>(coupon?.valid ? "success" : "idle");
  const [message, setMessage] = React.useState<string | null>(coupon?.message ?? null);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setStatus("checking");
    const result = await validateCoupon(code, totals.subtotal);
    setMessage(result.message);

    if (result.valid) {
      setStatus("success");
      applyCouponResult(result);
    } else {
      setStatus("error");
      applyCouponResult(null);
    }
  }

  function handleRemove() {
    applyCouponResult(null);
    setCode("");
    setStatus("idle");
    setMessage(null);
  }

  if (status === "success" && coupon?.valid) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span className="font-semibold">{coupon.code}</span> applied — {coupon.discountPercent}% off
        </div>
        <button
          type="button"
          onClick={handleRemove}
          aria-label="Remove coupon"
          className="text-muted-foreground hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Promo code"
            disabled={status === "checking"}
            className="h-11 w-full rounded-md border border-border bg-card pl-9 pr-3 text-sm uppercase tracking-wide outline-none transition-colors focus-visible:border-brand-primary disabled:opacity-60"
          />
        </div>
        <Button type="submit" variant="outline" disabled={status === "checking" || !code.trim()}>
          {status === "checking" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
        </Button>
      </div>

      {status === "error" && message && (
        <p className="flex items-center gap-1.5 text-xs text-destructive">
          <XCircle className="h-3.5 w-3.5" />
          {message}
        </p>
      )}
    </form>
  );
}
