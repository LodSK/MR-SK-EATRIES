import { Router } from "express";
import * as authController from "@/controllers/auth.controller";
import { authenticate, guestOnly } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate.middleware";
import { authLimiter } from "@/middleware/rateLimiter.middleware";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
} from "@/validators/auth.validator";

const router = Router();

router.post("/register", authLimiter, guestOnly, validate(registerSchema), authController.register);
router.post("/login", authLimiter, guestOnly, validate(loginSchema), authController.login);
router.post("/logout", authController.logout);
router.post("/logout-all", authenticate, authController.logoutAll);
router.post("/refresh", authController.refresh);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", authLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.get("/verify-email", authController.verifyEmail);
router.post("/verify-email", authController.verifyEmail);
router.post("/resend-verification", authenticate, authLimiter, authController.resendVerification);

router.get("/me", authenticate, authController.getCurrentUser);
router.patch("/me", authenticate, validate(updateProfileSchema), authController.updateProfile);
router.post("/change-password", authenticate, validate(changePasswordSchema), authController.changePassword);

export default router;
