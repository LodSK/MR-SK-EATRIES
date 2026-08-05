import type { CartItem as CartItemType, DeliveryMethod, OrderTotals } from "@/types/cart";
import { getDeliveryOption } from "@/lib/utils/cart";
import { CartItem } from "@/components/cart/CartItem";
import { CouponInput } from "@/components/cart/CouponInput";
import { PriceBreakdown } from "@/components/cart/PriceBreakdown";
import { Clock } from "lucide-react";

interface OrderSummaryProps {
  items: CartItemType[];
  totals: OrderTotals;
  deliveryMethod: DeliveryMethod;
  currency: string;
}

export function OrderSummary({ items, totals, deliveryMethod, currency }: OrderSummaryProps) {
  const delivery = getDeliveryOption(deliveryMethod);

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
      <h2 className="font-display text-lg font-bold">Order Summary</h2>

      <div className="max-h-72 divide-y divide-border overflow-y-auto">
        {items.map((item) => (
          <CartItem key={item.id} item={item} compact />
        ))}
      </div>

      <CouponInput />

      <PriceBreakdown totals={totals} currency={currency} />

      <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm">
        <Clock className="h-4 w-4 text-brand-primary dark:text-brand-accent" />
        <span>
          Estimated {delivery.method === "pickup" ? "ready" : "delivery"} time:{" "}
          <strong>
            {delivery.etaMinutes[0]}–{delivery.etaMinutes[1]} min
          </strong>
        </span>
      </div>
    </div>
  );
}
