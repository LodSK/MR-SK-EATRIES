"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import type { Coupon, CouponPayload, CouponType } from "@/types/coupon";
import { createCoupon, updateCoupon } from "@/lib/api/coupons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormMessage } from "@/components/auth/FormMessage";
import { Button } from "@/components/ui/button";

interface CouponFormProps {
  initialCoupon?: Coupon;
  onDone: () => void;
  onCancel: () => void;
}

export function CouponForm({ initialCoupon, onDone, onCancel }: CouponFormProps) {
  const [values, setValues] = React.useState<CouponPayload>({
    code: initialCoupon?.code ?? "",
    type: initialCoupon?.type ?? "percentage",
    value: initialCoupon?.value ?? 10,
    minimumSpend: initialCoupon?.minimumSpend ?? 0,
    maxUses: initialCoupon?.maxUses,
    expiresAt: initialCoupon?.expiresAt?.slice(0, 10),
    isActive: initialCoupon?.isActive ?? true,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function set<K extends keyof CouponPayload>(key: K, value: CouponPayload[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const result = initialCoupon
      ? await updateCoupon(initialCoupon.id, values)
      : await createCoupon({ ...values, code: values.code.toUpperCase() });
    setIsSubmitting(false);
    if (result.success) {
      onDone();
    } else {
      setError(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      {error && <FormMessage type="error">{error}</FormMessage>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Code</label>
          <input
            type="text"
            required
            value={values.code}
            onChange={(e) => set("code", e.target.value.toUpperCase())}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm uppercase outline-none focus-visible:border-brand-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Type</label>
          <Select value={values.type} onValueChange={(v) => set("type", v as CouponType)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
            Value {values.type === "percentage" ? "(%)" : "(GHS)"}
          </label>
          <input
            type="number"
            min={0}
            required
            value={values.value}
            onChange={(e) => set("value", Number(e.target.value))}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Min. Spend (GHS)</label>
          <input
            type="number"
            min={0}
            value={values.minimumSpend}
            onChange={(e) => set("minimumSpend", Number(e.target.value))}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Usage Limit</label>
          <input
            type="number"
            min={0}
            placeholder="Unlimited"
            value={values.maxUses ?? ""}
            onChange={(e) => set("maxUses", e.target.value ? Number(e.target.value) : undefined)}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Expiry Date (optional)</label>
          <input
            type="date"
            value={values.expiresAt ?? ""}
            onChange={(e) => set("expiresAt", e.target.value || undefined)}
            className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </div>
        <label className="flex items-center gap-2 self-end pb-2.5 text-sm">
          <Checkbox checked={values.isActive} onCheckedChange={(v) => set("isActive", v === true)} />
          Active
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : initialCoupon ? "Save Changes" : "Create Coupon"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
