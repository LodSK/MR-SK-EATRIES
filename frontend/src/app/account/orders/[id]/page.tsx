import type { Metadata } from "next";
import { OrderDetailsPageContent } from "@/components/dashboard/OrderDetailsPageContent";

export const metadata: Metadata = {
  title: "Order Details",
};

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = await params;
  return <OrderDetailsPageContent orderId={id} />;
}
