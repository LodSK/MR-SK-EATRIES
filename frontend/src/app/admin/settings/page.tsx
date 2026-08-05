import type { Metadata } from "next";
import { AdminSettings } from "@/components/admin/AdminSettings";

export const metadata: Metadata = {
  title: "Restaurant Settings",
};

export default function AdminSettingsPage() {
  return <AdminSettings />;
}
