import { User, type IUser } from "@/models/User.model";
import { ApiError } from "@/utils/ApiError";
import { hashPassword, comparePassword, generateSecureToken, hashToken } from "@/utils/password";
import { generateTokenPair, verifyRefreshToken } from "@/utils/jwt";
import { blacklistRefreshToken, isRefreshTokenBlacklisted } from "@/utils/tokenBlacklist";
import { sendVerificationEmail, sendPasswordResetEmail } from "@/services/email.service";
import { env } from "@/config/env";
import { logger } from "@/config/logger";

const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h

export function toPublicUser(user: IUser) {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    avatarUrl: user.avatarUrl,
    isEmailVerified: user.isEmailVerified,
    isActive: user.isActive,
    birthday: user.birthday,
    bio: user.bio,
    addresses: user.addresses.map((a) => ({
      id: a._id?.toString(),
      label: a.label,
      street: a.street,
      city: a.city,
      notes: a.notes,
      isDefault: a.isDefault,
    })),
    createdAt: user.createdAt,
  };
}

export async function registerUser(fullName: string, email: string, password: string) {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw ApiError.conflict("An account with that email already exists.");

  const hashedPassword = await hashPassword(password);
  const { raw, hashed } = generateSecureToken();

  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    password: hashedPassword,
    emailVerificationTokenHash: hashed,
    emailVerificationExpires: new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS),
  });

  const verifyUrl = `${env.clientUrl}/auth/verify-email?token=${raw}`;
  await sendVerificationEmail(user.email, verifyUrl).catch((err) => logger.error("[email] verification failed", { error: err instanceof Error ? err.message : err }));

  const tokens = generateTokenPair(user._id.toString(), user.role, user.tokenVersion);
  return { user: toPublicUser(user), tokens };
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) throw ApiError.unauthorized("Incorrect email or password.");

  const matches = await comparePassword(password, user.password);
  if (!matches) throw ApiError.unauthorized("Incorrect email or password.");

  if (!user.isActive) {
    throw ApiError.forbidden("This account has been suspended. Please contact support.");
  }

  const tokens = generateTokenPair(user._id.toString(), user.role, user.tokenVersion);
  return { user: toPublicUser(user), tokens };
}

export async function refreshUserSession(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized("Session expired. Please log in again.");
  }

  if (await isRefreshTokenBlacklisted(payload.jti)) {
    throw ApiError.unauthorized("Session expired. Please log in again.");
  }

  const user = await User.findById(payload.sub);
  if (!user || user.tokenVersion !== payload.tokenVersion) {
    throw ApiError.unauthorized("Session expired. Please log in again.");
  }
  if (!user.isActive) {
    throw ApiError.forbidden("This account has been suspended. Please contact support.");
  }

  return generateTokenPair(user._id.toString(), user.role, user.tokenVersion);
}

/**
 * Revokes just this one refresh token (this device/session) — see
 * tokenBlacklist.ts for why this is per-session rather than reusing the
 * per-user `tokenVersion` counter. Silently no-ops for a missing/expired/
 * already-invalid token — logout should always succeed from the client's
 * perspective (the cookie gets cleared regardless, in the controller).
 */
export async function logoutUser(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) return;

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    return;
  }

  const remainingSeconds = payload.exp ? payload.exp - Math.floor(Date.now() / 1000) : 0;
  await blacklistRefreshToken(payload.jti, remainingSeconds);
}

/**
 * The frontend's "Resend Email" button (EmailVerificationNotice.tsx)
 * called no backend endpoint at all — it just flipped local UI state to
 * "sent" without ever actually sending anything. This mirrors
 * registerUser's verification-email logic exactly, just re-triggerable
 * for an already-registered, not-yet-verified account.
 */
export async function resendVerificationEmail(userId: string): Promise<void> {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("Account not found.");
  if (user.isEmailVerified) throw ApiError.badRequest("This email address is already verified.");

  const { raw, hashed } = generateSecureToken();
  user.emailVerificationTokenHash = hashed;
  user.emailVerificationExpires = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
  await user.save();

  const verifyUrl = `${env.clientUrl}/auth/verify-email?token=${raw}`;
  await sendVerificationEmail(user.email, verifyUrl).catch((err) =>
    logger.error("[email] resend verification failed", { error: err instanceof Error ? err.message : err })
  );
}

export async function requestPasswordReset(email: string): Promise<void> {
  const user = await User.findOne({ email: email.toLowerCase() });
  // Always resolve successfully — never reveal whether the email exists.
  if (!user) return;

  const { raw, hashed } = generateSecureToken();
  user.passwordResetTokenHash = hashed;
  user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await user.save();

  const resetUrl = `${env.clientUrl}/auth/reset-password?token=${raw}`;
  await sendPasswordResetEmail(user.email, resetUrl).catch((err) => logger.error("[email] reset failed", { error: err instanceof Error ? err.message : err }));
}

export async function resetPassword(rawToken: string, newPassword: string): Promise<void> {
  const hashed = hashToken(rawToken);
  const user = await User.findOne({
    passwordResetTokenHash: hashed,
    passwordResetExpires: { $gt: new Date() },
  }).select("+password");

  if (!user) throw ApiError.badRequest("This reset link is invalid or has expired.");

  user.password = await hashPassword(newPassword);
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  user.tokenVersion += 1; // invalidate all existing refresh tokens
  await user.save();
}

export async function verifyEmail(rawToken: string): Promise<void> {
  const hashed = hashToken(rawToken);
  const user = await User.findOne({
    emailVerificationTokenHash: hashed,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) throw ApiError.badRequest("This verification link is invalid or has expired.");

  user.isEmailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();
}

export interface UpdateProfileInput {
  fullName: string;
  phone?: string;
  birthday?: Date;
  bio?: string;
  avatarUrl?: string;
}

export async function updateUserProfile(userId: string, data: UpdateProfileInput) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("Account not found.");

  user.fullName = data.fullName;
  if (data.phone !== undefined) user.phone = data.phone;
  if (data.birthday !== undefined) user.birthday = data.birthday;
  if (data.bio !== undefined) user.bio = data.bio;
  if (data.avatarUrl !== undefined) user.avatarUrl = data.avatarUrl;
  await user.save();

  return toPublicUser(user);
}

/** Invalidates every outstanding refresh token for this user at once — every device, every session. */
export async function logoutAllDevices(userId: string): Promise<void> {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("Account not found.");
  user.tokenVersion += 1;
  await user.save();
}

export async function changeUserPassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await User.findById(userId).select("+password");
  if (!user) throw ApiError.notFound("Account not found.");

  const matches = await comparePassword(currentPassword, user.password);
  if (!matches) throw ApiError.badRequest("Current password is incorrect.");

  user.password = await hashPassword(newPassword);
  user.tokenVersion += 1;
  await user.save();
}
