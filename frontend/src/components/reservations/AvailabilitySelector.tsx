"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import type { AvailabilitySlot } from "@/types/reservation";
import { getAvailability } from "@/lib/api/reservation";
import { cn } from "@/lib/utils/cn";

interface AvailabilitySelectorProps {
  date: string;
  value: string;
  onChange: (time: string) => void;
}

export function AvailabilitySelector({ date, value, onChange }: AvailabilitySelectorProps) {
  const [slots, setSlots] = React.useState<AvailabilitySlot[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    getAvailability(date)
      .then((result) => {
        if (!cancelled) setSlots(result);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [date]);

  if (!date) {
    return <p className="text-sm text-muted-foreground">Select a date to see available times.</p>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking availability…
      </div>
    );
  }

  return (
    <div role="radiogroup" aria-label="Reservation time" className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {slots.map((slot) => {
        const selected = value === slot.time;
        return (
          <button
            key={slot.time}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={!slot.available}
            onClick={() => onChange(slot.time)}
            className={cn(
              "rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors",
              !slot.available && "cursor-not-allowed border-border/50 text-muted-foreground/40 line-through",
              slot.available && !selected && "border-border hover:border-brand-primary/50",
              slot.available &&
                selected &&
                "border-brand-primary bg-brand-primary text-white dark:border-brand-accent dark:bg-brand-accent dark:text-brand-secondary"
            )}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}
