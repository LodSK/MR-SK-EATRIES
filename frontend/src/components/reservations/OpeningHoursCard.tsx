import { Clock } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export function OpeningHoursCard() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-brand-primary dark:text-brand-accent" />
        <h3 className="font-display text-lg font-bold">Opening Hours</h3>
      </div>
      <ul className="flex flex-col gap-2 text-sm">
        {SITE_CONFIG.hours.map((slot) => (
          <li key={slot.days} className="flex items-center justify-between gap-4 text-muted-foreground">
            <span>{slot.days}</span>
            <span className="font-medium text-foreground">{slot.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
