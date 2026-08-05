import type { OrderTotals } from "@/types/cart";
import { formatCurrency } from "@/lib/utils/cart";

interface PriceBreakdownProps {
  totals: OrderTotals;
  currency?: string;
}

export function PriceBreakdown({ totals, currency = "GHS" }: PriceBreakdownProps) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex items-center justify-between text-muted-foreground">
        <span>Subtotal</span>
        <span>{formatCurrency(totals.subtotal, currency)}</span>
      </div>

      {totals.discount > 0 && (
        <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
          <span>Discount</span>
          <span>-{formatCurrency(totals.discount, currency)}</span>
        </div>
      )}

      <div className="flex items-center justify-between text-muted-foreground">
        <span>Delivery Fee</span>
        <span>{totals.deliveryFee === 0 ? "Free" : formatCurrency(totals.deliveryFee, currency)}</span>
      </div>

      <div className="flex items-center justify-between text-muted-foreground">
        <span>Service Charge</span>
        <span>{formatCurrency(totals.serviceCharge, currency)}</span>
      </div>

      <div className="flex items-center justify-between text-muted-foreground">
        <span>Estimated Tax</span>
        <span>{formatCurrency(totals.tax, currency)}</span>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-base font-bold">
        <span>Grand Total</span>
        <span className="text-brand-primary dark:text-brand-accent">
          {formatCurrency(totals.grandTotal, currency)}
        </span>
      </div>
    </div>
  );
}
