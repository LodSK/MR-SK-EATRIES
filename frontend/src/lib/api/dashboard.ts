import { httpClient } from "@/lib/api/httpClient";
import type { DashboardSummary } from "@/types/dashboard";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await httpClient.get("/users/me/dashboard-summary");
  return data.data;
}
