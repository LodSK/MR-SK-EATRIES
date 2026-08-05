import type { FilterQuery } from "mongoose";
import { Reservation, type IReservation } from "@/models/Reservation.model";
import { ApiError } from "@/utils/ApiError";
import { buildPaginationMeta } from "@/utils/ApiResponse";
import { sendReservationConfirmationEmail } from "@/services/email.service";
import { logger } from "@/config/logger";
import {
  RESERVATION_TIME_SLOTS,
  TABLES_PER_SLOT,
  RESERVATION_CANCELLATION_NOTICE_HOURS,
  STAFF_ROLES,
  type Role,
} from "@/config/constants";

interface RequesterContext {
  userId?: string;
  role?: Role;
  /** For guest (no account) lookups/cancellations — must match the reservation's email. */
  email?: string;
}

function isStaff(role?: Role): boolean {
  return !!role && (STAFF_ROLES as readonly string[]).includes(role);
}

/** Throws if the requester doesn't own this reservation and isn't staff+. */
function assertCanAccess(reservation: IReservation, requester: RequesterContext) {
  if (isStaff(requester.role)) return;
  if (requester.userId && reservation.user?.toString() === requester.userId) return;
  if (
    !reservation.user &&
    requester.email &&
    requester.email.trim().toLowerCase() === reservation.email.toLowerCase()
  ) {
    return;
  }
  throw ApiError.forbidden("You do not have permission to access this reservation.");
}

export function generateReservationNumber(): string {
  return `RES-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function createReservation(data: {
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  partySize: number;
  date: Date;
  time: string;
  seatingPreference?: string;
  occasion?: string;
  specialRequests?: string;
  accessibilityNotes?: string;
}) {
  const startOfDay = new Date(data.date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const existingAtSlot = await Reservation.countDocuments({
    date: { $gte: startOfDay, $lt: endOfDay },
    time: data.time,
    status: { $nin: ["cancelled"] },
  });

  if (existingAtSlot >= TABLES_PER_SLOT) {
    throw ApiError.conflict("That time slot is fully booked. Please choose another time.");
  }

  const reservationNumber = generateReservationNumber();

  const reservation = await Reservation.create({
    reservationNumber,
    user: data.userId,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    partySize: data.partySize,
    date: startOfDay,
    time: data.time,
    seatingPreference: data.seatingPreference,
    occasion: data.occasion,
    specialRequests: data.specialRequests,
    accessibilityNotes: data.accessibilityNotes,
  });

  await sendReservationConfirmationEmail(
    data.email,
    reservationNumber,
    startOfDay.toDateString(),
    data.time,
    data.partySize
  ).catch((err) => logger.error("[email] reservation confirmation failed", { error: err instanceof Error ? err.message : err }));

  return reservation;
}

export async function getAvailability(date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const bookings = await Reservation.aggregate([
    { $match: { date: { $gte: startOfDay, $lt: endOfDay }, status: { $nin: ["cancelled"] } } },
    { $group: { _id: "$time", count: { $sum: 1 } } },
  ]);

  const bookedMap = new Map<string, number>(
    bookings.map((b): [string, number] => [b._id as string, b.count as number])
  );

  return RESERVATION_TIME_SLOTS.map((time) => ({
    time,
    available: (bookedMap.get(time) ?? 0) < TABLES_PER_SLOT,
    remaining: Math.max(0, TABLES_PER_SLOT - (bookedMap.get(time) ?? 0)),
  }));
}

/**
 * Scoped single-reservation lookup. Authenticated owners and staff+ get
 * full access; guests (no account) must supply the matching email as a
 * confirmation credential. Applying the Sprint 9 audit's recommendation
 * (guest order lookup was over-exposed) to this new endpoint from the start.
 */
export async function getReservationById(id: string, requester: RequesterContext) {
  const reservation = await Reservation.findById(id);
  if (!reservation) throw ApiError.notFound("Reservation not found.");
  assertCanAccess(reservation, requester);
  return reservation;
}

export async function updateReservation(
  id: string,
  data: Partial<IReservation>,
  requester: RequesterContext
) {
  const reservation = await Reservation.findById(id);
  if (!reservation) throw ApiError.notFound("Reservation not found.");
  assertCanAccess(reservation, requester);

  Object.assign(reservation, data);
  await reservation.save();
  return reservation;
}

export async function cancelReservation(id: string, requester: RequesterContext) {
  const reservation = await Reservation.findById(id);
  if (!reservation) throw ApiError.notFound("Reservation not found.");
  assertCanAccess(reservation, requester);

  if (reservation.status === "cancelled") {
    throw ApiError.badRequest("This reservation is already cancelled.");
  }
  if (reservation.status === "completed" || reservation.status === "no-show") {
    throw ApiError.badRequest("This reservation can no longer be cancelled.");
  }

  if (!isStaff(requester.role)) {
    const [hours, minutes] = reservation.time.split(":").map(Number);
    const reservationDateTime = new Date(reservation.date);
    reservationDateTime.setHours(hours ?? 0, minutes ?? 0, 0, 0);
    const hoursUntil = (reservationDateTime.getTime() - Date.now()) / (1000 * 60 * 60);

    if (hoursUntil < RESERVATION_CANCELLATION_NOTICE_HOURS) {
      throw ApiError.badRequest(
        `Reservations can only be cancelled at least ${RESERVATION_CANCELLATION_NOTICE_HOURS} hours in advance. Please call the restaurant directly.`
      );
    }
  }

  reservation.status = "cancelled";
  await reservation.save();
  return reservation;
}

/** Admin-only status change (approve/seat/complete/no-show/cancel) — bypasses the customer cancellation-window rule. */
export async function updateReservationStatus(id: string, status: IReservation["status"]) {
  const reservation = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
  if (!reservation) throw ApiError.notFound("Reservation not found.");
  return reservation;
}

export async function getUserReservations(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const [reservations, total] = await Promise.all([
    Reservation.find({ user: userId }).sort({ date: -1 }).skip(skip).limit(limit),
    Reservation.countDocuments({ user: userId }),
  ]);
  return { reservations, meta: buildPaginationMeta(page, limit, total) };
}

interface ListReservationsOptions {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  scope?: "today" | "upcoming";
  sort?: "date-asc" | "date-desc" | "newest";
}

const SORT_MAP: Record<NonNullable<ListReservationsOptions["sort"]>, Record<string, 1 | -1>> = {
  "date-asc": { date: 1, time: 1 },
  "date-desc": { date: -1, time: -1 },
  newest: { createdAt: -1 },
};

export async function listAllReservations(options: ListReservationsOptions) {
  const filter: FilterQuery<IReservation> = {};

  if (options.status) filter.status = options.status;

  if (options.scope === "today") {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);
    filter.date = { $gte: startOfDay, $lt: endOfDay };
  } else if (options.scope === "upcoming") {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    filter.date = { $gte: startOfToday };
  }

  if (options.search) {
    const regex = new RegExp(options.search.trim(), "i");
    filter.$or = [{ fullName: regex }, { email: regex }, { phone: regex }, { reservationNumber: regex }];
  }

  const skip = (options.page - 1) * options.limit;
  const sort = SORT_MAP[options.sort ?? "date-asc"];

  const [reservations, total] = await Promise.all([
    Reservation.find(filter).sort(sort).skip(skip).limit(options.limit),
    Reservation.countDocuments(filter),
  ]);

  return { reservations, meta: buildPaginationMeta(options.page, options.limit, total) };
}
