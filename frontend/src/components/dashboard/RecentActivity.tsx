import Link from "next/link";
import { Receipt } from "lucide-react";
import type { DashboardSummary } from "@/types/dashboard";
import { formatCurrency } from "@/lib/utils/cart";
import { EmptyState } from "@/components/shared/EmptyState";

interface RecentActivityProps {
  activity: DashboardSummary["recentActivity"];
}

const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function RecentActivity({ activity }: RecentActivityProps) {
  if (activity.length === 0) {
    return (
      <EmptyState
        icon={<Receipt className="h-6 w-6" strokeWidth={1.5} />}
        title="No recent activity"
        description="Your recent orders will show up here."
      />
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {activity.map((order) => (
        <li key={order.orderNumber} className="flex items-center justify-between gap-3 py-3">
          <div>
            <Link
              href="/account/orders"
              className="font-mono text-sm font-medium hover:text-brand-primary dark:hover:text-brand-accent"
            >
              {order.orderNumber}
            </Link>
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()} · {STATUS_LABEL[order.status] ?? order.status}
            </p>
          </div>
          <span className="text-sm font-semibold">{formatCurrency(order.grandTotal)}</span>
        </li>
      ))}
    </ul>
  );
}
