"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/types/cart";
import { CATEGORY_ICON } from "@/lib/constants/category-icons";
import { formatCurrency } from "@/lib/utils/cart";
import { useCart } from "@/lib/hooks/useCart";
import { QuantitySelector } from "@/components/menu/QuantitySelector";

interface CartItemProps {
  item: CartItemType;
  /** Compact layout for the drawer; roomier for the full /cart page. */
  compact?: boolean;
}

export function CartItem({ item, compact = false }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const Icon = CATEGORY_ICON[item.category];
  const lineTotal = item.price * item.quantity;

  const nameContent = item.slug ? (
    <Link
      href={`/menu/${item.category}/${item.slug}`}
      className="font-semibold hover:text-brand-primary dark:hover:text-brand-accent"
    >
      {item.name}
    </Link>
  ) : (
    <span className="font-semibold">{item.name}</span>
  );

  return (
    <div className="flex items-center gap-3 py-4">
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-secondary via-brand-secondary to-brand-primary-dark ${
          compact ? "h-14 w-14" : "h-16 w-16"
        }`}
        aria-hidden="true"
      >
        <Icon className={compact ? "h-6 w-6 text-white/30" : "h-7 w-7 text-white/30"} strokeWidth={1.25} />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-snug">{nameContent}</p>
          <button
            type="button"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name} from cart`}
            className="shrink-0 text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground">{formatCurrency(item.price, item.currency)} each</p>

        <div className="mt-1 flex items-center justify-between">
          <QuantitySelector
            value={item.quantity}
            min={1}
            max={20}
            size="sm"
            onChange={(quantity) => updateQuantity(item.id, quantity)}
          />
          <span className="text-sm font-bold">{formatCurrency(lineTotal, item.currency)}</span>
        </div>
      </div>
    </div>
  );
}
