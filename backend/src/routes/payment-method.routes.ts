import { Router } from "express";
import * as paymentMethodController from "@/controllers/payment-method.controller";
import { authenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { createPaymentMethodSchema } from "@/validators/payment-method.validator";

const router = Router();

router.get("/payment-methods", authenticate, paymentMethodController.getPaymentMethods);
router.post(
  "/payment-methods",
  authenticate,
  validate(createPaymentMethodSchema),
  paymentMethodController.createPaymentMethod
);
router.patch("/payment-methods/:id/default", authenticate, paymentMethodController.setDefaultPaymentMethod);
router.delete("/payment-methods/:id", authenticate, paymentMethodController.deletePaymentMethod);

export default router;
