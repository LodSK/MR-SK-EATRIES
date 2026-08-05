import type { Metadata } from "next";
import { DashboardSecurity } from "@/components/dashboard/DashboardSecurity";

export const metadata: Metadata = {
  title: "Security",
};

export default function SecurityPage() {
  return <DashboardSecurity />;
}
