"use client";

import { CreditCard, Star, Trash2 } from "lucide-react";
import type { PaymentMethod } from "@/types/paymentMethod";
import { Button } from "@/components/ui/button";

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PaymentMethodCard({ method, onSetDefault, onDelete }: PaymentMethodCardProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-secondary text-brand-accent">
          <CreditCard className="h-5 w-5" />
        </div>
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold">
            {method.nickname}
            {method.isDefault && (
              <span className="flex items-center gap-1 rounded-full bg-brand-accent/15 px-2 py-0.5 text-[10px] font-bold text-brand-accent">
                <Star className="h-2.5 w-2.5 fill-current" />
                Default
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground">
            {method.brand} {method.maskedNumber} · Expires {String(method.expiryMonth).padStart(2, "0")}/
            {method.expiryYear}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!method.isDefault && (
          <Button variant="outline" size="sm" onClick={() => onSetDefault(method.id)}>
            Set Default
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(method.id)}
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
