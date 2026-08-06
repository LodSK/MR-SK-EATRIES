"use client";

import { Banknote, CreditCard, Smartphone } from "lucide-react";
import type { PaymentMethod } from "@/types/cart";
import { cn } from "@/lib/utils/cn";

interface PaymentSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const OPTIONS: { method: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
  { method: "card", label: "Card (Paystack)", icon: CreditCard },
  { method: "mobile-money", label: "Mobile Money", icon: Smartphone },
  { method: "cash", label: "Cash", icon: Banknote },
];

export function PaymentSelector({ value, onChange }: PaymentSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Payment method" className="grid grid-cols-3 gap-3">
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const selected = value === option.method;
        return (
          <button
            key={option.method}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.method)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors",
              selected
                ? "border-brand-primary bg-brand-primary/5 dark:border-brand-accent dark:bg-brand-accent/10"
                : "border-border hover:border-brand-primary/40"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                selected ? "text-brand-primary dark:text-brand-accent" : "text-muted-foreground"
              )}
            />
            <span className="text-xs font-semibold">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
