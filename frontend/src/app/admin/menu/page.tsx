import type { Metadata } from "next";
import { AdminMenu } from "@/components/admin/AdminMenu";

export const metadata: Metadata = {
  title: "Manage Menu",
};

export default function AdminMenuPage() {
  return <AdminMenu />;
}
