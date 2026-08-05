import { Router } from "express";
import * as jobApplicationController from "@/controllers/job-application.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { STAFF_ROLES } from "@/config/constants";
import {
  createJobApplicationSchema,
  updateJobApplicationStatusSchema,
} from "@/validators/job-application.validator";

const router = Router();

router.post(
  "/careers/apply",
  validate(createJobApplicationSchema),
  jobApplicationController.createApplication
);

router.get(
  "/admin/job-applications",
  authenticate,
  authorize(...STAFF_ROLES),
  jobApplicationController.listApplications
);
router.patch(
  "/admin/job-applications/:id",
  authenticate,
  authorize(...STAFF_ROLES),
  validate(updateJobApplicationStatusSchema),
  jobApplicationController.updateApplicationStatus
);

export default router;
