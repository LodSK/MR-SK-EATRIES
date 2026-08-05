import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { env } from "@/config/env";
import * as authService from "@/services/auth.service";
import { User } from "@/models/User.model";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax" as const,
  path: "/",
};

function setRefreshCookie(res: Response, token: string, rememberMe: boolean) {
  res.cookie(env.jwt.cookieName, token, {
    ...REFRESH_COOKIE_OPTIONS,
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined,
  });
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  const { user, tokens } = await authService.registerUser(fullName, email, password);
  setRefreshCookie(res, tokens.refreshToken, false);
  return ApiResponse.created(res, { user, accessToken: tokens.accessToken }, "Account created.");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;
  const { user, tokens } = await authService.loginUser(email, password);
  setRefreshCookie(res, tokens.refreshToken, rememberMe);
  return ApiResponse.ok(res, { user, accessToken: tokens.accessToken }, "Welcome back.");
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[env.jwt.cookieName];
  await authService.logoutUser(token);
  res.clearCookie(env.jwt.cookieName, { path: "/" });
  return ApiResponse.ok(res, null, "Signed out.");
});

export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  await authService.logoutAllDevices(req.user!.id);
  res.clearCookie(env.jwt.cookieName, { path: "/" });
  return ApiResponse.ok(res, null, "Signed out of all devices.");
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.[env.jwt.cookieName] ?? req.body.refreshToken;
  if (!token) throw ApiError.unauthorized("No refresh token provided.");

  const tokens = await authService.refreshUserSession(token);
  setRefreshCookie(res, tokens.refreshToken, true);
  return ApiResponse.ok(res, { accessToken: tokens.accessToken }, "Session refreshed.");
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.requestPasswordReset(req.body.email);
  return ApiResponse.ok(res, null, "If an account exists for that email, a reset link has been sent.");
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  return ApiResponse.ok(res, null, "Your password has been reset. You can now log in.");
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const token = (req.query.token as string) ?? req.body.token;
  await authService.verifyEmail(token);
  return ApiResponse.ok(res, null, "Your email has been verified.");
});

export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
  await authService.resendVerificationEmail(req.user!.id);
  return ApiResponse.ok(res, null, "Verification email sent — check your inbox.");
});

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) throw ApiError.notFound("Account not found.");
  return ApiResponse.ok(res, authService.toPublicUser(user));
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.updateUserProfile(req.user!.id, req.body);
  return ApiResponse.ok(res, user, "Profile updated.");
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changeUserPassword(req.user!.id, currentPassword, newPassword);
  return ApiResponse.ok(res, null, "Password changed successfully.");
});
