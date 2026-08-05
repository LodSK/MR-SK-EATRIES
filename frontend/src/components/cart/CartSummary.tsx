import Link from "next/link";
import type { OrderTotals } from "@/types/cart";
import { PriceBreakdown } from "@/components/cart/PriceBreakdown";
import { Button } from "@/components/ui/button";

interface CartSummaryProps {
  totals: OrderTotals;
  currency: string;
  onContinueShopping?: () => void;
}

export function CartSummary({ totals, currency, onContinueShopping }: CartSummaryProps) {
  return (
    <div className="flex flex-col gap-4">
      <PriceBreakdown totals={totals} currency={currency} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button asChild variant="outline" className="flex-1" onClick={onContinueShopping}>
          <Link href="/menu">Continue Shopping</Link>
        </Button>
        <Button asChild variant="default" className="flex-1" onClick={onContinueShopping}>
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </div>
    </div>
  );
}
