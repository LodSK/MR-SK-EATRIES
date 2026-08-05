"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import type { OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";

interface OrderStatusActionsProps {
  status: OrderStatus;
  onChange: (status: OrderStatus) => Promise<void>;
}

/** Sprint 12 asks for "Accept/Reject/Preparing/Ready/Delivered/Cancel" — mapped onto the
 *  existing ORDER_STATUSES enum (pending/preparing/ready/completed/cancelled) rather than
 *  adding parallel statuses that would mean the same thing. */
const NEXT_ACTIONS: Partial<Record<OrderStatus, { label: string; next: OrderStatus; variant?: "outline" | "default" }[]>> = {
  pending: [
    { label: "Accept", next: "preparing" },
    { label: "Reject", next: "cancelled", variant: "outline" },
  ],
  preparing: [
    { label: "Mark Ready", next: "ready" },
    { label: "Cancel", next: "cancelled", variant: "outline" },
  ],
  ready: [
    { label: "Mark Delivered", next: "completed" },
    { label: "Cancel", next: "cancelled", variant: "outline" },
  ],
};

export function OrderStatusActions({ status, onChange }: OrderStatusActionsProps) {
  const [loadingNext, setLoadingNext] = React.useState<OrderStatus | null>(null);
  const actions = NEXT_ACTIONS[status];

  if (!actions) return <span className="text-xs text-muted-foreground">No further actions</span>;

  async function handleClick(next: OrderStatus) {
    setLoadingNext(next);
    await onChange(next);
    setLoadingNext(null);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button
          key={action.next}
          size="sm"
          variant={action.variant ?? "default"}
          disabled={loadingNext !== null}
          onClick={() => handleClick(action.next)}
        >
          {loadingNext === action.next ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : action.label}
        </Button>
      ))}
    </div>
  );
}
