import { Router } from "express";
import * as orderController from "@/controllers/order.controller";
import { authenticate, authorize, optionalAuthenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { STAFF_ROLES } from "@/config/constants";
import { createOrderSchema, updateOrderStatusSchema } from "@/validators/order.validator";

const router = Router();

router.post("/orders", optionalAuthenticate, validate(createOrderSchema), orderController.createOrder);
router.get("/orders/history", authenticate, orderController.getOrderHistory);
router.get("/orders/track/:orderNumber", optionalAuthenticate, orderController.trackOrder);
router.get("/orders/pay/verify", optionalAuthenticate, orderController.verifyPayment);
router.post("/orders/:id/pay/initialize", optionalAuthenticate, orderController.initializePayment);
router.get("/orders/:id", optionalAuthenticate, orderController.getOrder);

router.get("/admin/orders", authenticate, authorize(...STAFF_ROLES), orderController.listOrders);
router.patch(
  "/admin/orders/:id/status",
  authenticate,
  authorize(...STAFF_ROLES),
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

export default router;
