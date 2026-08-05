"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { getSettings, updateSettings } from "@/lib/api/settings";
import type { RestaurantSettings } from "@/types/settings";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { FormMessage } from "@/components/auth/FormMessage";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/shared/Skeleton";

export function AdminSettings() {
  const [settings, setSettings] = React.useState<RestaurantSettings | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  React.useEffect(() => {
    getSettings().then(setSettings).catch(() => setSettings(null));
  }, []);

  function set<K extends keyof RestaurantSettings>(key: K, value: RestaurantSettings[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function updateHour(index: number, field: "days" | "time", value: string) {
    setSettings((prev) => {
      if (!prev) return prev;
      const slot = prev.openingHours[index];
      if (!slot) return prev;
      const openingHours = [...prev.openingHours];
      openingHours[index] =
        field === "days" ? { days: value, time: slot.time } : { days: slot.days, time: value };
      return { ...prev, openingHours };
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    setMessage(null);
    const result = await updateSettings(settings);
    setIsSaving(false);
    setMessage({ type: result.success ? "success" : "error", text: result.message });
  }

  if (!settings) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6">
      {message && <FormMessage type={message.type}>{message.text}</FormMessage>}

      <DashboardCard title="Restaurant Information">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Restaurant Name">
            <input
              value={settings.restaurantName}
              onChange={(e) => set("restaurantName", e.target.value)}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
            />
          </Field>
          <Field label="Tagline">
            <input
              value={settings.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
            />
          </Field>
          <Field label="Contact Email">
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => set("contactEmail", e.target.value)}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
            />
          </Field>
          <Field label="Contact Phone">
            <input
              value={settings.contactPhone}
              onChange={(e) => set("contactPhone", e.target.value)}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
            />
          </Field>
          <Field label="Address" className="sm:col-span-2">
            <input
              value={settings.address}
              onChange={(e) => set("address", e.target.value)}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
            />
          </Field>
        </div>
        <div className="mt-4 flex flex-wrap gap-5">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox
              checked={settings.isOnlineOrderingEnabled}
              onCheckedChange={(v) => set("isOnlineOrderingEnabled", v === true)}
            />
            Online Ordering Enabled
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox
              checked={settings.isReservationsEnabled}
              onCheckedChange={(v) => set("isReservationsEnabled", v === true)}
            />
            Reservations Enabled
          </label>
        </div>
      </DashboardCard>

      <DashboardCard title="Business Hours">
        <div className="flex flex-col gap-3">
          {settings.openingHours.map((slot, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <input
                value={slot.days}
                onChange={(e) => updateHour(i, "days", e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
              />
              <input
                value={slot.time}
                onChange={(e) => updateHour(i, "time", e.target.value)}
                className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
              />
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="Delivery, Tax & Currency">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Pickup Fee">
            <input
              type="number"
              min={0}
              value={settings.delivery.pickupFee}
              onChange={(e) => set("delivery", { ...settings.delivery, pickupFee: Number(e.target.value) })}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
            />
          </Field>
          <Field label="Standard Delivery Fee">
            <input
              type="number"
              min={0}
              value={settings.delivery.standardFee}
              onChange={(e) => set("delivery", { ...settings.delivery, standardFee: Number(e.target.value) })}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
            />
          </Field>
          <Field label="Express Delivery Fee">
            <input
              type="number"
              min={0}
              value={settings.delivery.expressFee}
              onChange={(e) => set("delivery", { ...settings.delivery, expressFee: Number(e.target.value) })}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
            />
          </Field>
          <Field label="Tax Rate (0–1)">
            <input
              type="number"
              min={0}
              max={1}
              step="0.001"
              value={settings.taxRate}
              onChange={(e) => set("taxRate", Number(e.target.value))}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
            />
          </Field>
          <Field label="Service Charge Rate (0–1)">
            <input
              type="number"
              min={0}
              max={1}
              step="0.001"
              value={settings.serviceChargeRate}
              onChange={(e) => set("serviceChargeRate", Number(e.target.value))}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:border-brand-primary"
            />
          </Field>
          <Field label="Currency Code">
            <input
              value={settings.currency}
              onChange={(e) => set("currency", e.target.value.toUpperCase())}
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm uppercase outline-none focus-visible:border-brand-primary"
            />
          </Field>
        </div>
      </DashboardCard>

      <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Settings"}
      </Button>
    </form>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
