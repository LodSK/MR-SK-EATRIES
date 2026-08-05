"use client";

import * as React from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { DashboardCard } from "@/components/dashboard/DashboardCard";

interface Preference {
  key: string;
  label: string;
  description: string;
}

const EMAIL_PREFS: Preference[] = [
  { key: "order-updates", label: "Order Updates", description: "Status changes for your orders." },
  { key: "reservation-reminders", label: "Reservation Reminders", description: "Upcoming booking reminders." },
  { key: "marketing", label: "Marketing", description: "New menu items, promotions, and events." },
];

const OTHER_PREFS: Preference[] = [
  { key: "sms", label: "SMS Notifications", description: "Text updates for orders and reservations." },
];

export function DashboardNotificationsSettings() {
  const [enabled, setEnabled] = React.useState<Record<string, boolean>>({
    "order-updates": true,
    "reservation-reminders": true,
    marketing: false,
    sms: false,
  });

  function toggle(key: string) {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success("Preference saved.");
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-700 dark:text-amber-400">
        These preferences are saved locally for now — a persisted backend record lands in a future sprint.
      </p>

      <DashboardCard title="Email">
        <div className="flex flex-col gap-4">
          {EMAIL_PREFS.map((pref) => (
            <label key={pref.key} className="flex cursor-pointer items-start gap-3">
              <Checkbox checked={enabled[pref.key]} onCheckedChange={() => toggle(pref.key)} className="mt-0.5" />
              <span>
                <span className="block text-sm font-medium">{pref.label}</span>
                <span className="block text-xs text-muted-foreground">{pref.description}</span>
              </span>
            </label>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Other Channels">
        <div className="flex flex-col gap-4">
          {OTHER_PREFS.map((pref) => (
            <label key={pref.key} className="flex cursor-pointer items-start gap-3">
              <Checkbox checked={enabled[pref.key]} onCheckedChange={() => toggle(pref.key)} className="mt-0.5" />
              <span>
                <span className="block text-sm font-medium">{pref.label}</span>
                <span className="block text-xs text-muted-foreground">{pref.description}</span>
              </span>
            </label>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
