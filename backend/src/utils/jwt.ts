import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { env } from "@/config/env";
import type { Role } from "@/config/constants";

export interface AccessTokenPayload {
  sub: string;
  role: Role;
  type: "access";
}

export interface RefreshTokenPayload {
  sub: string;
  type: "refresh";
  /** Incremented on password change to invalidate every outstanding refresh token at once. */
  tokenVersion: number;
  /** Unique per-token id — lets a single session be revoked (logout) without affecting others (tokenVersion is per-user, not per-session). */
  jti: string;
  /** Standard JWT claims, present on every token `jwt.verify` returns but not set by us directly. */
  iat?: number;
  exp?: number;
}

export function signAccessToken(userId: string, role: Role): string {
  const payload: AccessTokenPayload = { sub: userId, role, type: "access" };
  return jwt.sign(payload, env.jwt.accessSecret, { expiresIn: env.jwt.accessExpiresIn as jwt.SignOptions["expiresIn"] });
}

export function signRefreshToken(userId: string, tokenVersion: number): string {
  const payload: Omit<RefreshTokenPayload, "iat" | "exp"> = {
    sub: userId,
    type: "refresh",
    tokenVersion,
    jti: randomUUID(),
  };
  return jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn as jwt.SignOptions["expiresIn"] });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwt.accessSecret) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.jwt.refreshSecret) as RefreshTokenPayload;
}

export function generateTokenPair(userId: string, role: Role, tokenVersion: number) {
  return {
    accessToken: signAccessToken(userId, role),
    refreshToken: signRefreshToken(userId, tokenVersion),
  };
}
