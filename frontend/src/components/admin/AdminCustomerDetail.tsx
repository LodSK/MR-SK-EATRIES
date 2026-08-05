"use client";

import * as React from "react";
import { UserX } from "lucide-react";
import { getCustomer, getCustomerOrders, getCustomerReservations, setCustomerActive } from "@/lib/api/adminUsers";
import type { AdminCustomer } from "@/types/admin";
import type { Order } from "@/types/order";
import type { Reservation } from "@/types/reservation";
import { InitialsAvatar } from "@/components/shared/InitialsAvatar";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { OrderCard } from "@/components/dashboard/OrderCard";
import { ReservationSummaryCard } from "@/components/reservations/ReservationSummaryCard";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils/auth";

export function AdminCustomerDetail({ customerId }: { customerId: string }) {
  const [customer, setCustomer] = React.useState<AdminCustomer | null | undefined>(undefined);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [reservations, setReservations] = React.useState<Reservation[]>([]);

  const load = React.useCallback(() => {
    getCustomer(customerId).then(setCustomer);
    getCustomerOrders(customerId).then(setOrders).catch(() => setOrders([]));
    getCustomerReservations(customerId).then(setReservations).catch(() => setReservations([]));
  }, [customerId]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleToggleActive() {
    if (!customer) return;
    await setCustomerActive(customer.id, !customer.isActive);
    load();
  }

  if (customer === undefined) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (customer === null) {
    return (
      <EmptyState
        icon={<UserX className="h-6 w-6" strokeWidth={1.5} />}
        title="Customer not found"
        description="This account may have been removed."
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <InitialsAvatar initials={getInitials(customer.fullName)} size="lg" />
          <div>
            <h2 className="font-display text-xl font-bold">{customer.fullName}</h2>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
            {customer.phone && <p className="text-sm text-muted-foreground">{customer.phone}</p>}
            <p className="mt-1 text-xs text-muted-foreground">
              Joined {new Date(customer.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={customer.isActive ? "success" : "spicy"}>
            {customer.isActive ? "Active" : "Suspended"}
          </Badge>
          <Button variant="outline" onClick={handleToggleActive}>
            {customer.isActive ? "Suspend Account" : "Activate Account"}
          </Button>
        </div>
      </div>

      <DashboardCard title={`Order History (${orders.length})`}>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </DashboardCard>

      <DashboardCard title={`Reservation History (${reservations.length})`}>
        {reservations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reservations yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {reservations.map((reservation) => (
              <ReservationSummaryCard key={reservation.id} reservation={reservation} />
            ))}
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
