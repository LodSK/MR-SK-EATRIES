import type { Metadata } from "next";
import { DashboardPaymentMethods } from "@/components/dashboard/DashboardPaymentMethods";

export const metadata: Metadata = {
  title: "Payment Methods",
};

export default function PaymentMethodsPage() {
  return <DashboardPaymentMethods />;
}
