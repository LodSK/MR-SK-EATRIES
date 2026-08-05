import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import * as reservationService from "@/services/reservation.service";

export const createReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservation = await reservationService.createReservation({ ...req.body, userId: req.user?.id });
  return ApiResponse.created(res, reservation, "Reservation confirmed.");
});

export const getAvailability = asyncHandler(async (req: Request, res: Response) => {
  const slots = await reservationService.getAvailability(new Date(req.query.date as string));
  return ApiResponse.ok(res, slots);
});

export const getReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservation = await reservationService.getReservationById(req.params.id as string, {
    userId: req.user?.id,
    role: req.user?.role,
    email: req.query.email as string | undefined,
  });
  return ApiResponse.ok(res, reservation);
});

export const updateReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservation = await reservationService.updateReservation(req.params.id as string, req.body, {
    userId: req.user?.id,
    role: req.user?.role,
  });
  return ApiResponse.ok(res, reservation, "Reservation updated.");
});

export const cancelReservation = asyncHandler(async (req: Request, res: Response) => {
  const reservation = await reservationService.cancelReservation(req.params.id as string, {
    userId: req.user!.id,
    role: req.user!.role,
  });
  return ApiResponse.ok(res, reservation, "Reservation cancelled.");
});

export const getMyReservations = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const { reservations, meta } = await reservationService.getUserReservations(req.user!.id, page, limit);
  return ApiResponse.ok(res, reservations, "Success", meta);
});

// ── Admin ──────────────────────────────────────────────────────────

export const listReservations = asyncHandler(async (req: Request, res: Response) => {
  const { reservations, meta } = await reservationService.listAllReservations({
    page: Number(req.query.page ?? 1),
    limit: Number(req.query.limit ?? 20),
    status: req.query.status as string | undefined,
    search: req.query.search as string | undefined,
    scope: req.query.scope as "today" | "upcoming" | undefined,
    sort: req.query.sort as "date-asc" | "date-desc" | "newest" | undefined,
  });
  return ApiResponse.ok(res, reservations, "Success", meta);
});

export const updateReservationStatus = asyncHandler(async (req: Request, res: Response) => {
  const reservation = await reservationService.updateReservationStatus(req.params.id as string, req.body.status);
  return ApiResponse.ok(res, reservation, "Reservation status updated.");
});
