import { Calendar, Clock, MapPin, Users } from "lucide-react";
import type { Reservation } from "@/types/reservation";
import { ReservationStatusBadge } from "@/components/reservations/ReservationStatusBadge";

interface ReservationSummaryCardProps {
  reservation: Reservation;
  action?: React.ReactNode;
}

export function ReservationSummaryCard({ reservation, action }: ReservationSummaryCardProps) {
  // Locale pinned — see BlogCard.tsx's comment on the same pattern (avoids
  // a server/client hydration-mismatch if this ever renders during SSR).
  const formattedDate = new Date(reservation.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-muted-foreground">{reservation.reservationNumber}</p>
          <h3 className="font-display text-lg font-bold">{reservation.fullName}</h3>
        </div>
        <ReservationStatusBadge status={reservation.status} />
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        <span className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-brand-primary dark:text-brand-accent" />
          {formattedDate}
        </span>
        <span className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-brand-primary dark:text-brand-accent" />
          {reservation.time}
        </span>
        <span className="flex items-center gap-2">
          <Users className="h-4 w-4 text-brand-primary dark:text-brand-accent" />
          {reservation.partySize} {reservation.partySize === 1 ? "guest" : "guests"}
        </span>
        {reservation.seatingPreference && reservation.seatingPreference !== "no-preference" && (
          <span className="flex items-center gap-2 capitalize">
            <MapPin className="h-4 w-4 text-brand-primary dark:text-brand-accent" />
            {reservation.seatingPreference} seating
          </span>
        )}
      </div>

      {reservation.occasion && reservation.occasion !== "none" && (
        <p className="text-xs text-muted-foreground">
          Occasion: <span className="font-medium capitalize text-foreground">{reservation.occasion}</span>
        </p>
      )}

      {action && <div className="border-t border-border pt-3">{action}</div>}
    </div>
  );
}
