import { z } from "zod";
import { RESERVATION_STATUSES, RESERVATION_TIME_SLOTS } from "@/config/constants";

const emailSchema = z.string().trim().toLowerCase().min(1, "Email is required.").email("Enter a valid email address.");

export const createReservationSchema = z.object({
  fullName: z.string().min(2),
  email: emailSchema,
  phone: z.string().min(7),
  partySize: z.number().int().min(1).max(20),
  date: z.coerce.date().refine((d) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return d >= startOfToday;
  }, "Reservation date cannot be in the past."),
  time: z.enum(RESERVATION_TIME_SLOTS, { errorMap: () => ({ message: "Select a valid reservation time." }) }),
  seatingPreference: z.enum(["indoor", "outdoor", "no-preference"]).optional(),
  occasion: z.string().max(60).optional(),
  specialRequests: z.string().max(500).optional(),
  accessibilityNotes: z.string().max(500).optional(),
});

export const updateReservationSchema = createReservationSchema.partial();

export const updateReservationStatusSchema = z.object({
  status: z.enum(RESERVATION_STATUSES),
});

export const availabilityQuerySchema = z.object({
  date: z.coerce.date(),
});

export const listReservationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.enum(RESERVATION_STATUSES).optional(),
  search: z.string().optional(),
  scope: z.enum(["today", "upcoming"]).optional(),
  sort: z.enum(["date-asc", "date-desc", "newest"]).optional().default("date-asc"),
});
