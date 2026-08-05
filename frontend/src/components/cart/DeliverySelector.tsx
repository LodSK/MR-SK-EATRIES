"use client";

import { Bike, Clock, Store, Zap } from "lucide-react";
import type { DeliveryMethod } from "@/types/cart";
import { DELIVERY_OPTIONS, formatCurrency } from "@/lib/utils/cart";
import { cn } from "@/lib/utils/cn";

interface DeliverySelectorProps {
  value: DeliveryMethod;
  onChange: (method: DeliveryMethod) => void;
  currency?: string;
}

const METHOD_ICON: Record<DeliveryMethod, typeof Store> = {
  pickup: Store,
  standard: Bike,
  express: Zap,
};

export function DeliverySelector({ value, onChange, currency = "GHS" }: DeliverySelectorProps) {
  return (
    <div role="radiogroup" aria-label="Delivery method" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {DELIVERY_OPTIONS.map((option) => {
        const Icon = METHOD_ICON[option.method];
        const selected = value === option.method;
        return (
          <button
            key={option.method}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.method)}
            className={cn(
              "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
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
            <span className="text-sm font-bold">{option.label}</span>
            <span className="text-xs text-muted-foreground">{option.description}</span>
            <div className="mt-1 flex items-center justify-between w-full text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                {option.etaMinutes[0]}–{option.etaMinutes[1]} min
              </span>
              <span className="font-semibold">
                {option.fee === 0 ? "Free" : formatCurrency(option.fee, currency)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
