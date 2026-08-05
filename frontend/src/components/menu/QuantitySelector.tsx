"use client";

import * as React from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  /** When provided, the component is fully controlled by the parent (e.g. the cart). */
  value?: number;
  min?: number;
  max?: number;
  onChange?: (quantity: number) => void;
  size?: "sm" | "md";
}

export function QuantitySelector({ value, min = 1, max = 20, onChange, size = "md" }: QuantitySelectorProps) {
  const isControlled = value !== undefined;
  const [internalQuantity, setInternalQuantity] = React.useState(min);
  const quantity = isControlled ? value : internalQuantity;

  function update(next: number) {
    const clamped = Math.min(max, Math.max(min, next));
    if (!isControlled) setInternalQuantity(clamped);
    onChange?.(clamped);
  }

  const buttonSize = size === "sm" ? "h-7 w-7" : "h-9 w-9";
  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <div className="flex items-center gap-3 rounded-full border border-border p-1">
      <button
        type="button"
        onClick={() => update(quantity - 1)}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className={`flex ${buttonSize} items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted disabled:opacity-30`}
      >
        <Minus className={iconSize} />
      </button>
      <span className="w-6 text-center text-sm font-bold" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => update(quantity + 1)}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className={`flex ${buttonSize} items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted disabled:opacity-30`}
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}
