import { httpClient } from "@/lib/api/httpClient";
import type { AdminDashboardSummary, ChartPoint, SystemAlerts } from "@/types/admin";

export async function getAdminDashboardSummary(): Promise<AdminDashboardSummary> {
  const { data } = await httpClient.get("/admin/dashboard/summary");
  return data.data;
}

export async function getRevenueChart(days = 14): Promise<ChartPoint[]> {
  const { data } = await httpClient.get("/admin/dashboard/revenue", { params: { days } });
  return data.data;
}

export async function getOrdersChart(days = 14): Promise<ChartPoint[]> {
  const { data } = await httpClient.get("/admin/dashboard/orders-chart", { params: { days } });
  return data.data;
}

export async function getReservationsChart(days = 14): Promise<ChartPoint[]> {
  const { data } = await httpClient.get("/admin/dashboard/reservations-chart", { params: { days } });
  return data.data;
}

export async function getSystemAlerts(): Promise<SystemAlerts> {
  const { data } = await httpClient.get("/admin/dashboard/alerts");
  return data.data;
}
