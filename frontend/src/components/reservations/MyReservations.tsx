"use client";

import * as React from "react";
import { CalendarX, Loader2 } from "lucide-react";
import type { Reservation } from "@/types/reservation";
import { getMyReservations, cancelReservation } from "@/lib/api/reservation";
import { ReservationSummaryCard } from "@/components/reservations/ReservationSummaryCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/Skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

type Tab = "upcoming" | "past" | "cancelled";

const TABS: { value: Tab; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
];

export function MyReservations() {
  const [reservations, setReservations] = React.useState<Reservation[] | null>(null);
  const [tab, setTab] = React.useState<Tab>("upcoming");
  const [cancellingId, setCancellingId] = React.useState<string | null>(null);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const load = React.useCallback(() => {
    getMyReservations()
      .then(setReservations)
      .catch(() => setReservations([]));
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function handleCancel(id: string) {
    setCancellingId(id);
    setActionError(null);
    const result = await cancelReservation(id);
    if (result.success) {
      load();
    } else {
      setActionError(result.message);
    }
    setCancellingId(null);
  }

  const filtered = React.useMemo(() => {
    if (!reservations) return [];
    const now = Date.now();
    return reservations.filter((r) => {
      const isPast = new Date(r.date).getTime() < now;
      if (tab === "cancelled") return r.status === "cancelled" || r.status === "no-show";
      if (r.status === "cancelled" || r.status === "no-show") return false;
      return tab === "upcoming" ? !isPast : isPast;
    });
  }, [reservations, tab]);

  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" aria-label="Reservation history" className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              tab === t.value
                ? "border-brand-primary bg-brand-primary text-white dark:border-brand-accent dark:bg-brand-accent dark:text-brand-secondary"
                : "border-border text-muted-foreground hover:border-brand-primary/40"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {actionError && <p className="text-sm text-destructive">{actionError}</p>}

      {reservations === null ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarX className="h-6 w-6" strokeWidth={1.5} />}
          title={`No ${tab} reservations`}
          description={
            tab === "upcoming" ? "Book a table and it'll show up here." : "Nothing to show in this tab yet."
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((reservation) => (
            <ReservationSummaryCard
              key={reservation.id}
              reservation={reservation}
              action={
                tab === "upcoming" &&
                reservation.status !== "cancelled" &&
                reservation.status !== "completed" &&
                reservation.status !== "no-show" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={cancellingId === reservation.id}
                    onClick={() => handleCancel(reservation.id)}
                  >
                    {cancellingId === reservation.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      "Cancel Reservation"
                    )}
                  </Button>
                ) : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
