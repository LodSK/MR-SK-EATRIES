"use client";

import * as React from "react";
import { PackageX } from "lucide-react";
import { getOrderById } from "@/lib/api/orders";
import type { Order } from "@/types/order";
import { OrderDetails } from "@/components/dashboard/OrderDetails";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";

export function OrderDetailsPageContent({ orderId }: { orderId: string }) {
  const [order, setOrder] = React.useState<Order | null | undefined>(undefined);

  React.useEffect(() => {
    getOrderById(orderId).then(setOrder);
  }, [orderId]);

  if (order === undefined) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (order === null) {
    return (
      <EmptyState
        icon={<PackageX className="h-6 w-6" strokeWidth={1.5} />}
        title="Order not found"
        description="This order doesn't exist or you don't have access to it."
      />
    );
  }

  return <OrderDetails order={order} />;
}
