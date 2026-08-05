import { Router } from "express";
import * as menuController from "@/controllers/menu.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { cachePublic } from "@/middleware/cache.middleware";
import { STAFF_ROLES } from "@/config/constants";
import { menuQuerySchema, createMenuItemSchema, updateMenuItemSchema } from "@/validators/menu.validator";

const router = Router();

router.get("/menu", cachePublic(), validate(menuQuerySchema, "query"), menuController.getMenuItems);
router.get("/menu/search", cachePublic(30), menuController.searchMenu);
router.get("/menu/featured", cachePublic(), menuController.getFeaturedMenu);
router.get("/menu/popular", cachePublic(), menuController.getPopularMenu);
router.get("/menu/:slug", cachePublic(), menuController.getMenuItemBySlug);
router.get("/categories", cachePublic(300), menuController.getCategories);

router.get(
  "/admin/menu",
  authenticate,
  authorize(...STAFF_ROLES),
  validate(menuQuerySchema, "query"),
  menuController.getAdminMenuItems
);
router.post(
  "/admin/menu",
  authenticate,
  authorize(...STAFF_ROLES),
  validate(createMenuItemSchema),
  menuController.createMenuItem
);
router.patch(
  "/admin/menu/:id",
  authenticate,
  authorize(...STAFF_ROLES),
  validate(updateMenuItemSchema),
  menuController.updateMenuItem
);
router.delete("/admin/menu/:id", authenticate, authorize(...STAFF_ROLES), menuController.deleteMenuItem);

export default router;
