"use client";

import * as React from "react";
import { Pencil, Plus, Ticket, Trash2 } from "lucide-react";
import { listCoupons, deleteCoupon } from "@/lib/api/coupons";
import type { Coupon } from "@/types/coupon";
import { CouponForm } from "@/components/admin/CouponForm";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";

export function AdminCoupons() {
  const [coupons, setCoupons] = React.useState<Coupon[] | null>(null);
  const [formState, setFormState] = React.useState<"closed" | "create" | Coupon>("closed");

  const load = React.useCallback(() => {
    listCoupons()
      .then(setCoupons)
      .catch(() => setCoupons([]));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    await deleteCoupon(id);
    load();
  }

  function handleFormDone() {
    setFormState("closed");
    load();
  }

  function isExpired(coupon: Coupon): boolean {
    return !!coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
  }

  return (
    <div className="flex flex-col gap-5">
      {formState !== "closed" ? (
        <CouponForm
          initialCoupon={formState === "create" ? undefined : formState}
          onDone={handleFormDone}
          onCancel={() => setFormState("closed")}
        />
      ) : (
        <Button onClick={() => setFormState("create")} className="w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      )}

      {coupons === null ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : coupons.length === 0 ? (
        <EmptyState
          icon={<Ticket className="h-6 w-6" strokeWidth={1.5} />}
          title="No coupons yet"
          description="Create your first coupon code."
        />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {coupons.map((coupon) => (
            <div key={coupon.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold">{coupon.code}</span>
                  {!coupon.isActive && <Badge variant="spicy">Inactive</Badge>}
                  {isExpired(coupon) && <Badge variant="outline">Expired</Badge>}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {coupon.type === "percentage" ? `${coupon.value}% off` : `GHS ${coupon.value} off`}
                  {coupon.minimumSpend > 0 && ` · Min. spend GHS ${coupon.minimumSpend}`}
                  {" · "}
                  Used {coupon.usedCount}
                  {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                  {coupon.expiresAt && ` · Expires ${new Date(coupon.expiresAt).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setFormState(coupon)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(coupon.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
