import type { Metadata } from "next";
import { MyReservations } from "@/components/reservations/MyReservations";

export const metadata: Metadata = {
  title: "My Reservations",
};

export default function AccountReservationsPage() {
  return <MyReservations />;
}
