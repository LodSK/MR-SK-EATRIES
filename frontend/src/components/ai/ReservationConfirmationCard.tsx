import { CalendarCheck2 } from "lucide-react";
import type { ReservationConfirmation } from "@/types/ai";

export function ReservationConfirmationCard({ confirmation }: { confirmation: ReservationConfirmation }) {
  // Locale pinned — see BlogCard.tsx's comment on the same pattern.
  const formattedDate = new Date(confirmation.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mt-2 flex items-start gap-3 rounded-xl border border-brand-accent/30 bg-brand-accent/10 p-3">
      <CalendarCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary dark:text-brand-accent" />
      <div className="text-xs">
        <p className="font-mono font-semibold">{confirmation.reservationNumber}</p>
        <p className="mt-0.5 text-muted-foreground">
          {formattedDate} at {confirmation.time} · Party of {confirmation.partySize}
        </p>
      </div>
    </div>
  );
}
