import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";
import type { AdminCustomer } from "@/types/admin";
import type { Order } from "@/types/order";
import type { Reservation } from "@/types/reservation";

function normalize<T extends { id?: string; _id?: string }>(raw: T): T & { id: string } {
  return { ...raw, id: raw.id ?? raw._id ?? "" };
}

export async function listCustomers(params: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}): Promise<{ customers: AdminCustomer[]; total: number }> {
  const { data } = await httpClient.get("/admin/users", { params });
  return { customers: (data.data as AdminCustomer[]).map(normalize), total: data.meta?.total ?? data.data.length };
}

export async function getCustomer(id: string): Promise<AdminCustomer | null> {
  try {
    const { data } = await httpClient.get(`/admin/users/${id}`);
    return normalize(data.data);
  } catch {
    return null;
  }
}

export async function getCustomerOrders(id: string): Promise<Order[]> {
  const { data } = await httpClient.get(`/admin/users/${id}/orders`);
  return (data.data as Order[]).map(normalize);
}

export async function getCustomerReservations(id: string): Promise<Reservation[]> {
  const { data } = await httpClient.get(`/admin/users/${id}/reservations`);
  return (data.data as Reservation[]).map(normalize);
}

export async function setCustomerActive(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.patch(`/admin/users/${id}/active`, { isActive });
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function updateCustomerRole(
  id: string,
  role: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.patch(`/admin/users/${id}/role`, { role });
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
