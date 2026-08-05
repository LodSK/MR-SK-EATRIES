import type { Metadata } from "next";
import { AdminNotificationCenter } from "@/components/admin/AdminNotificationCenter";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function AdminNotificationsPage() {
  return <AdminNotificationCenter />;
}
