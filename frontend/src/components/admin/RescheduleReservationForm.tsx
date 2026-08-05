"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import type { Reservation } from "@/types/reservation";
import { adminRescheduleReservation } from "@/lib/api/reservation";
import { AvailabilitySelector } from "@/components/reservations/AvailabilitySelector";
import { Button } from "@/components/ui/button";

interface RescheduleReservationFormProps {
  reservation: Reservation;
  onDone: () => void;
  onCancel: () => void;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function RescheduleReservationForm({ reservation, onDone, onCancel }: RescheduleReservationFormProps) {
  const [date, setDate] = React.useState(reservation.date.slice(0, 10));
  const [time, setTime] = React.useState(reservation.time);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);
    const result = await adminRescheduleReservation(reservation.id, date, time);
    setIsSubmitting(false);
    if (result.success) {
      onDone();
    } else {
      setError(result.message);
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-4">
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">New Date</label>
        <input
          type="date"
          min={todayIsoDate()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary sm:w-56"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">New Time</label>
        <AvailabilitySelector date={date} value={time} onChange={setTime} />
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm Reschedule"}
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
