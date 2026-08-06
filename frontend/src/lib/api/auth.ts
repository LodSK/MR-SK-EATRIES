import type {
  AuthResult,
  AuthTokens,
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  SimpleResult,
  UpdateProfilePayload,
  User,
} from "@/types/auth";
import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";

/**
 * Sprint 9: real Express/MongoDB backend replaces the Sprint 8 in-memory
 * placeholder. Every exported function keeps its exact Sprint 8 signature
 * so no component changed. The refresh token itself now lives in an
 * httpOnly cookie set by the server (more secure than the placeholder's
 * client-visible token) — `tokens.refreshToken` in the returned shape is
 * kept for type compatibility but is no longer meaningfully used
 * client-side; `httpClient` handles refresh automatically via the cookie.
 */

function toAuthTokens(accessToken: string): AuthTokens {
  return { accessToken, refreshToken: "", expiresAt: Date.now() + 15 * 60 * 1000 };
}

export async function login(payload: LoginPayload): Promise<AuthResult> {
  try {
    const { data } = await httpClient.post("/auth/login", payload);
    const user: User = data.data.user;
    return { success: true, message: data.message, user, tokens: toAuthTokens(data.data.accessToken) };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "Incorrect email or password.") };
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResult> {
  try {
    const { data } = await httpClient.post("/auth/register", payload);
    const user: User = data.data.user;
    return { success: true, message: data.message, user, tokens: toAuthTokens(data.data.accessToken) };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "Could not create your account.") };
  }
}

export async function logout(): Promise<SimpleResult> {
  try {
    const { data } = await httpClient.post("/auth/logout");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function logoutAllDevices(): Promise<SimpleResult> {
  try {
    const { data } = await httpClient.post("/auth/logout-all");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<SimpleResult> {
  try {
    const { data } = await httpClient.post("/auth/forgot-password", payload);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<SimpleResult> {
  try {
    const { data } = await httpClient.post("/auth/reset-password", payload);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "This reset link is invalid or has expired.") };
  }
}

export async function resendVerificationEmail(): Promise<SimpleResult> {
  try {
    const { data } = await httpClient.post("/auth/resend-verification");
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function verifyEmail(token: string): Promise<SimpleResult> {
  try {
    const { data } = await httpClient.get("/auth/verify-email", { params: { token } });
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "This verification link is invalid or has expired.") };
  }
}

export async function refreshSession(
  _refreshToken: string
): Promise<{ success: boolean; tokens?: AuthTokens; message: string }> {
  // The real refresh token lives in an httpOnly cookie sent automatically
  // by the browser — the string param is kept only for signature parity
  // with the Sprint 8 placeholder.
  try {
    const { data } = await httpClient.post("/auth/refresh");
    return { success: true, tokens: toAuthTokens(data.data.accessToken), message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "Session expired. Please log in again.") };
  }
}

export async function getCurrentUser(): Promise<{ success: boolean; user?: User; message: string }> {
  try {
    const { data } = await httpClient.get("/auth/me");
    return { success: true, user: data.data as User, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "Could not load your account.") };
  }
}

/**
 * Full page URL (not an httpClient call — the browser needs to navigate
 * top-level to Google's consent screen, which an AJAX request can't do).
 */
export function getGoogleAuthUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  return `${base}/auth/google`;
}

export async function updateProfile(
  _userId: string,
  payload: UpdateProfilePayload
): Promise<AuthResult> {
  // userId is inferred server-side from the authenticated request — kept
  // as a parameter only for signature parity with the Sprint 8 placeholder.
  try {
    const { data } = await httpClient.patch("/auth/me", payload);
    return { success: true, message: data.message, user: data.data };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function changePassword(
  _userId: string,
  payload: ChangePasswordPayload
): Promise<SimpleResult> {
  try {
    const { data } = await httpClient.post("/auth/change-password", payload);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error, "Current password is incorrect.") };
  }
}
