import type { Metadata } from "next";
import { AdminContactMessages } from "@/components/admin/AdminContactMessages";

export const metadata: Metadata = {
  title: "Contact Messages",
};

export default function AdminContactMessagesPage() {
  return <AdminContactMessages />;
}
