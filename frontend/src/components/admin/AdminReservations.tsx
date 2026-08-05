"use client";

import * as React from "react";
import { CalendarX } from "lucide-react";
import {
  adminListReservations,
  adminUpdateReservationStatus,
  cancelReservation,
} from "@/lib/api/reservation";
import type { Reservation } from "@/types/reservation";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { AdminSearchBar } from "@/components/admin/AdminSearchBar";
import { RescheduleReservationForm } from "@/components/admin/RescheduleReservationForm";
import { ReservationSummaryCard } from "@/components/reservations/ReservationSummaryCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "seated", label: "Seated" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no-show", label: "No Show" },
];

export function AdminReservations() {
  const [reservations, setReservations] = React.useState<Reservation[] | null>(null);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [reschedulingId, setReschedulingId] = React.useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search, 300);

  const load = React.useCallback(() => {
    adminListReservations({ search: debouncedSearch || undefined, status: status === "all" ? undefined : status })
      .then((res) => setReservations(res.reservations))
      .catch(() => setReservations([]));
  }, [debouncedSearch, status]);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleStatusChange(id: string, next: Reservation["status"]) {
    await adminUpdateReservationStatus(id, next);
    load();
  }

  async function handleCancel(id: string) {
    await cancelReservation(id);
    load();
  }

  return (
    <div className="flex flex-col gap-5">
      <AdminSearchBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email, phone, or reservation number…"
        filterValue={status}
        onFilterChange={setStatus}
        filterOptions={STATUS_OPTIONS}
        filterPlaceholder="All Statuses"
      />

      {reservations === null ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : reservations.length === 0 ? (
        <EmptyState
          icon={<CalendarX className="h-6 w-6" strokeWidth={1.5} />}
          title="No reservations found"
          description="Try a different search or filter."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="flex flex-col gap-3">
              <ReservationSummaryCard
                reservation={reservation}
                action={
                  <div className="flex flex-wrap gap-2">
                    {reservation.status === "pending" && (
                      <>
                        <Button size="sm" onClick={() => handleStatusChange(reservation.id, "confirmed")}>
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleCancel(reservation.id)}>
                          Reject
                        </Button>
                      </>
                    )}
                    {(reservation.status === "pending" || reservation.status === "confirmed") && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReschedulingId(reservation.id === reschedulingId ? null : reservation.id)}
                        >
                          Reschedule
                        </Button>
                        {reservation.status === "confirmed" && (
                          <Button size="sm" variant="outline" onClick={() => handleCancel(reservation.id)}>
                            Cancel
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                }
              />
              {reschedulingId === reservation.id && (
                <RescheduleReservationForm
                  reservation={reservation}
                  onDone={() => {
                    setReschedulingId(null);
                    load();
                  }}
                  onCancel={() => setReschedulingId(null)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
