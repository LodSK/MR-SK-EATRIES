import { z } from "zod";
import { RESERVATION_TIME_SLOTS, MAX_PARTY_SIZE, MIN_PARTY_SIZE } from "@/lib/constants/reservation-data";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required.")
  .email("Enter a valid email address.");

export const reservationSchema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  email: emailSchema,
  phone: z.string().min(7, "Enter a valid phone number."),
  partySize: z.coerce
    .number()
    .int()
    .min(MIN_PARTY_SIZE, `Minimum party size is ${MIN_PARTY_SIZE}.`)
    .max(MAX_PARTY_SIZE, `For parties over ${MAX_PARTY_SIZE}, please call us directly.`),
  date: z
    .string()
    .min(1, "Select a date.")
    .refine((value) => {
      const selected = new Date(value);
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      return selected >= startOfToday;
    }, "Reservation date cannot be in the past."),
  time: z.enum(RESERVATION_TIME_SLOTS, { errorMap: () => ({ message: "Select a reservation time." }) }),
  seatingPreference: z.enum(["indoor", "outdoor", "no-preference"]).optional(),
  occasion: z.string().optional(),
  specialRequests: z.string().max(500, "Keep requests under 500 characters.").optional(),
  accessibilityNotes: z.string().max(500, "Keep this under 500 characters.").optional(),
});

export type ReservationSchemaValues = z.infer<typeof reservationSchema>;
