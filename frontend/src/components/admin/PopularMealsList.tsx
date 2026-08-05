import { PriceTag } from "@/components/menu/PriceTag";
import { EmptyState } from "@/components/shared/EmptyState";
import { TrendingUp } from "lucide-react";
import type { AdminDashboardSummary } from "@/types/admin";

export function PopularMealsList({ items }: { items: AdminDashboardSummary["topMenuItems"] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<TrendingUp className="h-6 w-6" strokeWidth={1.5} />}
        title="No data yet"
        description="Popular meals will appear here as orders come in."
      />
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {items.map((item, i) => (
        <li key={item.name} className="flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-secondary text-xs font-bold text-brand-accent">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs capitalize text-muted-foreground">{item.category}</p>
            </div>
          </div>
          <PriceTag price={item.price} currency="GHS" size="sm" />
        </li>
      ))}
    </ul>
  );
}
