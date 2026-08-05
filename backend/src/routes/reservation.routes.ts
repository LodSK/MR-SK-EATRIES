import { Router } from "express";
import * as reservationController from "@/controllers/reservation.controller";
import { authenticate, authorize, optionalAuthenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { STAFF_ROLES } from "@/config/constants";
import {
  createReservationSchema,
  updateReservationSchema,
  updateReservationStatusSchema,
  availabilityQuerySchema,
  listReservationsQuerySchema,
} from "@/validators/reservation.validator";

const router = Router();

// Static paths first — must be registered before the /:id routes below,
// otherwise Express would try to match "availability"/"mine" as an :id.
router.post("/reservations", optionalAuthenticate, validate(createReservationSchema), reservationController.createReservation);
router.get("/reservations/availability", validate(availabilityQuerySchema, "query"), reservationController.getAvailability);
router.get("/reservations/mine", authenticate, reservationController.getMyReservations);

router.get("/reservations/:id", optionalAuthenticate, reservationController.getReservation);
router.patch("/reservations/:id", authenticate, validate(updateReservationSchema), reservationController.updateReservation);
router.delete("/reservations/:id", authenticate, reservationController.cancelReservation);

router.get(
  "/admin/reservations",
  authenticate,
  authorize(...STAFF_ROLES),
  validate(listReservationsQuerySchema, "query"),
  reservationController.listReservations
);
router.patch(
  "/admin/reservations/:id/status",
  authenticate,
  authorize(...STAFF_ROLES),
  validate(updateReservationStatusSchema),
  reservationController.updateReservationStatus
);

export default router;
