import type { Metadata } from "next";
import { DashboardAddresses } from "@/components/dashboard/DashboardAddresses";

export const metadata: Metadata = {
  title: "Addresses",
};

export default function AddressesPage() {
  return <DashboardAddresses />;
}
