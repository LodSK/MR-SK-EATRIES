import Link from "next/link";
import { Music, Wine, UtensilsCrossed, Cake, Sun, Gift, CalendarDays } from "lucide-react";
import type { RestaurantEvent } from "@/types/event";
import { Badge } from "@/components/shared/Badge";
import { Button } from "@/components/ui/button";

const ICON_MAP = {
  music: Music,
  wine: Wine,
  utensils: UtensilsCrossed,
  cake: Cake,
  sun: Sun,
  gift: Gift,
} as const;

const FREQUENCY_LABEL = {
  weekly: "Weekly",
  monthly: "Monthly",
  "one-time": "Special",
} as const;

interface EventCardProps {
  event: RestaurantEvent;
}

export function EventCard({ event }: EventCardProps) {
  const Icon = ICON_MAP[event.icon];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-brand-accent">
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <Badge variant="outline">{FREQUENCY_LABEL[event.frequency]}</Badge>
      </div>

      <div>
        <h3 className="font-display text-lg font-bold">{event.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          {event.schedule}
        </span>
        <Button asChild variant="outline" size="sm">
          <Link href="/reservations">Reserve</Link>
        </Button>
      </div>
    </div>
  );
}
