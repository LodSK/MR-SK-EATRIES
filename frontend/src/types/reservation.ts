export type ReservationStatus = "pending" | "confirmed" | "seated" | "completed" | "cancelled" | "no-show";

export type SeatingPreference = "indoor" | "outdoor" | "no-preference";

export interface Reservation {
  id: string;
  reservationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  partySize: number;
  date: string;
  time: string;
  seatingPreference?: SeatingPreference;
  occasion?: string;
  specialRequests?: string;
  accessibilityNotes?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface AvailabilitySlot {
  time: string;
  available: boolean;
  remaining: number;
}

export interface CreateReservationPayload {
  fullName: string;
  email: string;
  phone: string;
  partySize: number;
  date: string;
  time: string;
  seatingPreference?: SeatingPreference;
  occasion?: string;
  specialRequests?: string;
  accessibilityNotes?: string;
}

export interface ReservationResult {
  success: boolean;
  message: string;
  reservation?: Reservation;
}
