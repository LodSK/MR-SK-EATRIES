import type { Metadata } from "next";
import { AdminJobApplications } from "@/components/admin/AdminJobApplications";

export const metadata: Metadata = {
  title: "Job Applications",
};

export default function AdminJobApplicationsPage() {
  return <AdminJobApplications />;
}
