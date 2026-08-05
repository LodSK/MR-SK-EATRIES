import { Router } from "express";
import * as settingsController from "@/controllers/settings.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { updateSettingsSchema } from "@/validators/settings.validator";

const router = Router();

router.get("/settings", settingsController.getSettings);
router.patch(
  "/admin/settings",
  authenticate,
  authorize("admin", "manager"),
  validate(updateSettingsSchema),
  settingsController.updateSettings
);

export default router;
