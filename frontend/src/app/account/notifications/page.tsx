import type { Metadata } from "next";
import { DashboardNotificationsSettings } from "@/components/dashboard/DashboardNotificationsSettings";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function NotificationsPage() {
  return <DashboardNotificationsSettings />;
}
