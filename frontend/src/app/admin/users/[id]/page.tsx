import type { Metadata } from "next";
import { AdminCustomerDetail } from "@/components/admin/AdminCustomerDetail";

export const metadata: Metadata = {
  title: "Customer Details",
};

interface AdminCustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCustomerDetailPage({ params }: AdminCustomerDetailPageProps) {
  const { id } = await params;
  return <AdminCustomerDetail customerId={id} />;
}
