import { Router } from "express";
import * as adminController from "@/controllers/admin.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { STAFF_ROLES } from "@/config/constants";

const router = Router();

router.get(
  "/admin/dashboard/summary",
  authenticate,
  authorize(...STAFF_ROLES),
  adminController.getDashboardSummary
);
router.get(
  "/admin/dashboard/revenue",
  authenticate,
  authorize(...STAFF_ROLES),
  adminController.getRevenueChart
);
router.get(
  "/admin/dashboard/orders-chart",
  authenticate,
  authorize(...STAFF_ROLES),
  adminController.getOrdersChart
);
router.get(
  "/admin/dashboard/reservations-chart",
  authenticate,
  authorize(...STAFF_ROLES),
  adminController.getReservationsChart
);
router.get(
  "/admin/dashboard/alerts",
  authenticate,
  authorize(...STAFF_ROLES),
  adminController.getSystemAlerts
);

export default router;
