import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { env } from "@/config/env";
import * as authService from "@/services/auth.service";
import { User } from "@/models/User.model";
import { buildGoogleAuthUrl, exchangeCodeForProfile, generateOAuthState } from "@/services/googleOAuth.service";
import { logger } from "@/config/logger";

const OAUTH_STATE_COOKIE = "mrsk_oauth_state";

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

export const googleAuthRedirect = asyncHandler(async (_req: Request, res: Response) => {
  const state = generateOAuthState();
  res.cookie(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    maxAge: 10 * 60 * 1000, // 10 minutes — just long enough for the round trip to Google and back
    path: "/",
  });
  res.redirect(buildGoogleAuthUrl(state));
});

/**
 * Google redirects the browser here (a top-level navigation, not an AJAX
 * call), so this can't just return JSON like login/register do. It sets
 * the same httpOnly refresh cookie login() sets, then redirects to a
 * frontend page that calls the existing POST /auth/refresh + GET /auth/me
 * to hydrate the client session — no token is ever put in a URL.
 */
export const googleAuthCallback = asyncHandler(async (req: Request, res: Response) => {
  const failureRedirect = `${env.clientUrl}/auth/login?error=google_auth_failed`;

  const { code, state } = req.query as { code?: string; state?: string };
  const expectedState = req.cookies?.[OAUTH_STATE_COOKIE];
  res.clearCookie(OAUTH_STATE_COOKIE, { path: "/" });

  if (!code || !state || !expectedState || state !== expectedState) {
    return res.redirect(failureRedirect);
  }

  try {
    const profile = await exchangeCodeForProfile(code);
    const { tokens } = await authService.findOrCreateGoogleUser(profile);
    setRefreshCookie(res, tokens.refreshToken, true);
    return res.redirect(`${env.clientUrl}/auth/callback`);
  } catch (err) {
    logger.error("[auth] Google OAuth callback failed", { error: err instanceof Error ? err.message : err });
    return res.redirect(failureRedirect);
  }
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
