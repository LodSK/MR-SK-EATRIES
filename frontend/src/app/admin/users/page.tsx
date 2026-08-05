import type { Metadata } from "next";
import { AdminCustomers } from "@/components/admin/AdminCustomers";

export const metadata: Metadata = {
  title: "Manage Customers",
};

export default function AdminUsersPage() {
  return <AdminCustomers />;
}
