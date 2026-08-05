import { Router } from "express";
import * as contactController from "@/controllers/contact.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { STAFF_ROLES } from "@/config/constants";
import { createContactMessageSchema } from "@/validators/contact.validator";

const router = Router();

router.post("/contact", validate(createContactMessageSchema), contactController.createMessage);

router.get("/admin/contact-messages", authenticate, authorize(...STAFF_ROLES), contactController.listMessages);
router.patch(
  "/admin/contact-messages/:id",
  authenticate,
  authorize(...STAFF_ROLES),
  contactController.markMessageRead
);

export default router;
