import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ReservationPageContent } from "@/components/reservations/ReservationPageContent";

export const metadata: Metadata = {
  title: "Reservations",
  description:
    "Reserve a table at MR_SK EATRIES — check real-time availability and book online in under a minute.",
};

export default function ReservationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Book a Table"
        title="Reserve Your Evening"
        subtitle="A table, held just for you — whether it's a quiet dinner or a night to celebrate."
        breadcrumbItems={[{ label: "Reservations" }]}
      />
      <ReservationPageContent />
    </>
  );
}
