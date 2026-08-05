"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { reservationSchema, type ReservationSchemaValues } from "@/lib/validations/reservation";
import { createReservation } from "@/lib/api/reservation";
import type { Reservation } from "@/types/reservation";
import { OCCASION_OPTIONS, SEATING_OPTIONS } from "@/lib/constants/reservation-data";
import { AvailabilitySelector } from "@/components/reservations/AvailabilitySelector";
import { FormMessage } from "@/components/auth/FormMessage";
import { QuantitySelector } from "@/components/menu/QuantitySelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface ReservationFormProps {
  onSuccess: (reservation: Reservation) => void;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ReservationForm({ onSuccess }: ReservationFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReservationSchemaValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      partySize: 2,
      seatingPreference: "no-preference",
      occasion: "none",
    },
  });

  const date = watch("date");
  const time = watch("time");
  const partySize = watch("partySize");
  const seatingPreference = watch("seatingPreference");

  async function onSubmit(values: ReservationSchemaValues) {
    setServerError(null);
    const result = await createReservation(values);
    if (result.success && result.reservation) {
      onSuccess(result.reservation);
    } else {
      setServerError(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {serverError && <FormMessage type="error">{serverError}</FormMessage>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full Name" error={errors.fullName?.message}>
          <input
            type="text"
            {...register("fullName")}
            className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </Field>
        <Field label="Phone Number" error={errors.phone?.message}>
          <input
            type="tel"
            {...register("phone")}
            className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </Field>
        <Field label="Email Address" error={errors.email?.message} className="sm:col-span-2">
          <input
            type="email"
            {...register("email")}
            className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Reservation Date" error={errors.date?.message}>
          <input
            type="date"
            min={todayIsoDate()}
            {...register("date")}
            className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </Field>
        <Field label="Guest Count">
          <QuantitySelector value={partySize} min={1} max={20} onChange={(v) => setValue("partySize", v)} />
        </Field>
      </div>

      <Field label="Reservation Time" error={errors.time?.message}>
        <AvailabilitySelector date={date} value={time} onChange={(t) => setValue("time", t as ReservationSchemaValues["time"])} />
      </Field>

      <Field label="Seating Preference">
        <div role="radiogroup" aria-label="Seating preference" className="flex flex-wrap gap-2">
          {SEATING_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={seatingPreference === option.value}
              onClick={() => setValue("seatingPreference", option.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                seatingPreference === option.value
                  ? "border-brand-primary bg-brand-primary text-white dark:border-brand-accent dark:bg-brand-accent dark:text-brand-secondary"
                  : "border-border text-muted-foreground hover:border-brand-primary/40"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Special Occasion">
          <Select defaultValue="none" onValueChange={(v) => setValue("occasion", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="No occasion" />
            </SelectTrigger>
            <SelectContent>
              {OCCASION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Accessibility Requirements (optional)" error={errors.accessibilityNotes?.message}>
          <input
            type="text"
            placeholder="e.g. wheelchair access"
            {...register("accessibilityNotes")}
            className="h-11 w-full rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:border-brand-primary"
          />
        </Field>
      </div>

      <Field label="Special Requests (optional)" error={errors.specialRequests?.message}>
        <textarea
          rows={3}
          placeholder="Allergies, celebration setup, seating notes…"
          {...register("specialRequests")}
          className="w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus-visible:border-brand-primary"
        />
      </Field>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Booking…
          </>
        ) : (
          "Reserve Table"
        )}
      </Button>
    </form>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

function Field({ label, error, className, children }: FieldProps) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
