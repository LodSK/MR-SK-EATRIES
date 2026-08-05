import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";
import type {
  AvailabilitySlot,
  CreateReservationPayload,
  Reservation,
  ReservationResult,
} from "@/types/reservation";

function normalizeReservation(raw: Reservation & { _id?: string }): Reservation {
  return { ...raw, id: raw.id ?? raw._id ?? "" };
}

export async function getAvailability(date: string): Promise<AvailabilitySlot[]> {
  const { data } = await httpClient.get("/reservations/availability", { params: { date } });
  return data.data;
}

export async function createReservation(payload: CreateReservationPayload): Promise<ReservationResult> {
  try {
    const { data } = await httpClient.post("/reservations", payload);
    return { success: true, message: data.message, reservation: normalizeReservation(data.data) };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "We couldn't complete your reservation. Please try again."),
    };
  }
}

/** `email` is required for guest (unauthenticated) lookups — see backend's assertCanAccess. */
export async function getReservationById(id: string, email?: string): Promise<Reservation | null> {
  try {
    const { data } = await httpClient.get(`/reservations/${id}`, { params: email ? { email } : undefined });
    return normalizeReservation(data.data);
  } catch {
    return null;
  }
}

export async function getMyReservations(page = 1, limit = 20): Promise<Reservation[]> {
  const { data } = await httpClient.get("/reservations/mine", { params: { page, limit } });
  return (data.data as Reservation[]).map(normalizeReservation);
}

export async function cancelReservation(id: string): Promise<ReservationResult> {
  try {
    const { data } = await httpClient.delete(`/reservations/${id}`);
    return { success: true, message: data.message, reservation: normalizeReservation(data.data) };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "We couldn't cancel this reservation.") };
  }
}

// ── Admin ──────────────────────────────────────────────────────────

export async function adminListReservations(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  scope?: "today" | "upcoming";
  sort?: string;
}): Promise<{ reservations: Reservation[]; total: number }> {
  const { data } = await httpClient.get("/admin/reservations", { params });
  return {
    reservations: (data.data as Reservation[]).map(normalizeReservation),
    total: data.meta?.total ?? data.data.length,
  };
}

export async function adminUpdateReservationStatus(
  id: string,
  status: Reservation["status"]
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.patch(`/admin/reservations/${id}/status`, { status });
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

/**
 * Reschedule — reuses the existing customer-facing PATCH endpoint. Staff
 * already bypass the ownership check there (`assertCanAccess` in
 * reservation.service.ts), so no new backend endpoint was needed.
 */
export async function adminRescheduleReservation(
  id: string,
  date: string,
  time: string
): Promise<ReservationResult> {
  try {
    const { data } = await httpClient.patch(`/reservations/${id}`, { date, time });
    return { success: true, message: data.message, reservation: normalizeReservation(data.data) };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "We couldn't reschedule this reservation.") };
  }
}
