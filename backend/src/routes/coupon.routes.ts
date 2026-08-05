import { Router } from "express";
import * as couponController from "@/controllers/coupon.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { STAFF_ROLES } from "@/config/constants";
import { validateCouponSchema, createCouponSchema, updateCouponSchema } from "@/validators/coupon.validator";

const router = Router();

router.post("/coupons/validate", validate(validateCouponSchema), couponController.validateCoupon);

router.get("/admin/coupons", authenticate, authorize(...STAFF_ROLES), couponController.listCoupons);
router.post(
  "/admin/coupons",
  authenticate,
  authorize(...STAFF_ROLES),
  validate(createCouponSchema),
  couponController.createCoupon
);
router.patch(
  "/admin/coupons/:id",
  authenticate,
  authorize(...STAFF_ROLES),
  validate(updateCouponSchema),
  couponController.updateCoupon
);
router.delete("/admin/coupons/:id", authenticate, authorize(...STAFF_ROLES), couponController.deleteCoupon);

export default router;
