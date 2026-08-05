/**
 * Mirrors backend/src/config/constants.ts's RESERVATION_TIME_SLOTS exactly.
 * Kept in sync manually since frontend and backend are separate deployable
 * apps without a shared package — the backend remains authoritative and
 * validates independently; this list only drives the UI's slot picker.
 */
export const RESERVATION_TIME_SLOTS = [
  "12:00", "12:30", "13:00",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
] as const;

export const MAX_PARTY_SIZE = 20;
export const MIN_PARTY_SIZE = 1;

export const OCCASION_OPTIONS = [
  { value: "none", label: "No occasion" },
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "date-night", label: "Date Night" },
  { value: "business", label: "Business Dinner" },
  { value: "celebration", label: "Celebration" },
  { value: "other", label: "Other" },
] as const;

export const SEATING_OPTIONS = [
  { value: "no-preference", label: "No Preference" },
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
] as const;

export const RESERVATION_GUIDELINES = [
  "Tables are held for 15 minutes past the reservation time — after that, we may release it to walk-ins.",
  "Parties of 9 or more should call the restaurant directly to arrange a group booking.",
  "Reservations can be cancelled online up to 2 hours before your booking time.",
  "For same-day changes within 2 hours of your reservation, please call us directly.",
];
