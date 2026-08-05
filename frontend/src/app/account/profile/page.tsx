import type { Metadata } from "next";
import { DashboardProfile } from "@/components/dashboard/DashboardProfile";

export const metadata: Metadata = {
  title: "Profile",
};

export default function AccountProfilePage() {
  return <DashboardProfile />;
}
