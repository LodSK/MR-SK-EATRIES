import type { Metadata } from "next";
import { AdminAI } from "@/components/admin/AdminAI";

export const metadata: Metadata = {
  title: "AI Insights",
};

export default function AdminAIPage() {
  return <AdminAI />;
}
