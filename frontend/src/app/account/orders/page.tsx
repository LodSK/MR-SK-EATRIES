import type { Metadata } from "next";
import { DashboardOrders } from "@/components/dashboard/DashboardOrders";

export const metadata: Metadata = {
  title: "My Orders",
};

export default function OrdersPage() {
  return <DashboardOrders />;
}
