import { Router } from "express";
import * as userController from "@/controllers/user.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { addAddressSchema, updateAddressSchema } from "@/validators/user.validator";

const router = Router();

router.post("/users/me/addresses", authenticate, validate(addAddressSchema), userController.addAddress);
router.patch(
  "/users/me/addresses/:addressId",
  authenticate,
  validate(updateAddressSchema),
  userController.updateAddress
);
router.delete("/users/me/addresses/:addressId", authenticate, userController.removeAddress);
router.get("/users/me/dashboard-summary", authenticate, userController.getDashboardSummary);

router.get("/admin/users", authenticate, authorize("admin", "manager"), userController.listUsers);
router.get("/admin/users/:id", authenticate, authorize("admin", "manager"), userController.getUser);
router.get("/admin/users/:id/orders", authenticate, authorize("admin", "manager"), userController.getUserOrders);
router.get(
  "/admin/users/:id/reservations",
  authenticate,
  authorize("admin", "manager"),
  userController.getUserReservations
);
router.patch("/admin/users/:id/role", authenticate, authorize("admin"), userController.updateUserRole);
router.patch("/admin/users/:id/active", authenticate, authorize("admin", "manager"), userController.setUserActive);

export default router;
