import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Z]/, "Include at least one uppercase letter.")
  .regex(/[a-z]/, "Include at least one lowercase letter.")
  .regex(/[0-9]/, "Include at least one number.");

/**
 * Trims and lowercases BEFORE the email-format check, so:
 * - browser-autofilled values with stray leading/trailing whitespace
 *   don't fail validation or silently mismatch a stored (trimmed) email
 *   on lookup;
 * - "User@Example.com" and "user@example.com" are treated as the same
 *   account consistently everywhere, matching how User.email is stored
 *   (schema-level `lowercase: true, trim: true`) and how
 *   newsletter.controller.ts already normalizes.
 * Because `validate.middleware.ts` replaces `req.body` with the parsed
 * (transformed) result, every route using this schema receives an
 * already-normalized email — no service-layer changes needed.
 */
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Email is required.")
  .email("Enter a valid email address.");

export const registerSchema = z.object({
  fullName: z.string().min(2),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
  rememberMe: z.boolean().optional().default(false),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().optional(),
  birthday: z.coerce.date().optional(),
  bio: z.string().max(280, "Keep your bio under 280 characters.").optional(),
  avatarUrl: z.string().url().optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});
