"use client";

import * as React from "react";
import type { Reservation } from "@/types/reservation";
import { ReservationForm } from "@/components/reservations/ReservationForm";
import { ReservationConfirmation } from "@/components/reservations/ReservationConfirmation";
import { OpeningHoursCard } from "@/components/reservations/OpeningHoursCard";
import { ReservationGuidelines } from "@/components/reservations/ReservationGuidelines";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function ReservationPageContent() {
  const [confirmedReservation, setConfirmedReservation] = React.useState<Reservation | null>(null);

  if (confirmedReservation) {
    return (
      <div className="section-container py-16 sm:py-24">
        <ReservationConfirmation reservation={confirmedReservation} />
      </div>
    );
  }

  return (
    <div className="section-container grid grid-cols-1 gap-12 py-12 sm:py-16 lg:grid-cols-[1fr_360px] lg:gap-14">
      <div>
        <SectionHeading
          eyebrow="Book a Table"
          title="Reserve Your Table"
          subtitle="Tell us when, and we'll have it ready — indoor or out, quiet corner or a celebration setup."
          align="left"
          className="mb-8"
        />
        <ReservationForm onSuccess={setConfirmedReservation} />
      </div>

      <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
        <OpeningHoursCard />
        <ReservationGuidelines />
      </div>
    </div>
  );
}
