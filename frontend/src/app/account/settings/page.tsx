import type { Metadata } from "next";
import { DashboardSettings } from "@/components/dashboard/DashboardSettings";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return <DashboardSettings />;
}
