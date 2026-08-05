import { Router } from "express";
import * as blogController from "@/controllers/blog.controller";
import { authenticate, authorize } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { cachePublic } from "@/middleware/cache.middleware";
import { STAFF_ROLES } from "@/config/constants";
import { createBlogPostSchema, updateBlogPostSchema } from "@/validators/blog.validator";

const router = Router();

router.get("/blog", cachePublic(), blogController.listPosts);
router.get("/blog/:slug", cachePublic(), blogController.getPost);

router.get("/admin/blog", authenticate, authorize(...STAFF_ROLES), blogController.listAllPosts);
router.post(
  "/admin/blog",
  authenticate,
  authorize(...STAFF_ROLES),
  validate(createBlogPostSchema),
  blogController.createPost
);
router.patch(
  "/admin/blog/:id",
  authenticate,
  authorize(...STAFF_ROLES),
  validate(updateBlogPostSchema),
  blogController.updatePost
);
router.delete("/admin/blog/:id", authenticate, authorize(...STAFF_ROLES), blogController.deletePost);

export default router;
