import { Router } from "express";
import * as aiController from "@/controllers/ai.controller";
import { authenticate, authorize, optionalAuthenticate } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { STAFF_ROLES } from "@/config/constants";
import { aiChatSchema, aiRecommendSchema, aiSearchSchema, aiPredictSchema } from "@/validators/ai.validator";

const router = Router();

// Guest-accessible — matches the existing pattern for reservation/checkout,
// where the app deliberately lets unauthenticated visitors use core features.
router.post("/ai/chat", optionalAuthenticate, validate(aiChatSchema), aiController.chat);
router.post("/ai/recommend", optionalAuthenticate, validate(aiRecommendSchema), aiController.recommend);
router.post("/ai/search", optionalAuthenticate, validate(aiSearchSchema), aiController.search);

// Operational tools — restaurant performance summaries and load/sales
// predictions are staff-facing, not customer-facing.
router.get("/ai/insights", authenticate, authorize(...STAFF_ROLES), aiController.insights);
router.post(
  "/ai/predict",
  authenticate,
  authorize(...STAFF_ROLES),
  validate(aiPredictSchema),
  aiController.predict
);

export default router;
