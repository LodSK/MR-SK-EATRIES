import { Router } from "express";
import * as notificationController from "@/controllers/notification.controller";
import { authenticate } from "@/middleware/auth.middleware";

const router = Router();

router.get("/notifications", authenticate, notificationController.getNotifications);
router.patch("/notifications/:id/read", authenticate, notificationController.markNotificationRead);
router.patch("/notifications/read-all", authenticate, notificationController.markAllNotificationsRead);

export default router;
