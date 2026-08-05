import { Router } from "express";
import * as reviewController from "@/controllers/review.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { STAFF_ROLES } from "@/config/constants";
import { createReviewSchema } from "@/validators/user.validator";

const router = Router();

router.post("/reviews", authenticate, validate(createReviewSchema), reviewController.createReview);
router.get("/reviews/menu-item/:menuItemId", reviewController.getMenuItemReviews);

router.get("/admin/reviews", authenticate, authorize(...STAFF_ROLES), reviewController.listAllReviews);
router.patch("/admin/reviews/:id", authenticate, authorize(...STAFF_ROLES), reviewController.moderateReview);

export default router;
