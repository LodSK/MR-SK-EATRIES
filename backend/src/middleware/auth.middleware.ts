import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "@/utils/jwt";
import { ApiError } from "@/utils/ApiError";
import { asyncHandler } from "@/utils/asyncHandler";
import type { Role } from "@/config/constants";

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return null;
}

/** Requires a valid access token. Populates `req.user`. */
export const authenticate = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (!token) throw ApiError.unauthorized("Authentication required.");

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    throw ApiError.unauthorized("Invalid or expired session.");
  }
});

/** Populates `req.user` if a valid token is present, but never rejects the request. */
export const optionalAuthenticate = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (token) {
    try {
      const payload = verifyAccessToken(token);
      req.user = { id: payload.sub, role: payload.role };
    } catch {
      // Ignore — request proceeds unauthenticated.
    }
  }
  next();
});

/** Restricts a route to specific roles. Use after `authenticate`. */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw ApiError.unauthorized("Authentication required.");
    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden("You do not have permission to perform this action.");
    }
    next();
  };
}

/** Blocks already-authenticated users from hitting guest-only endpoints (e.g. register while logged in). */
export const guestOnly = (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);
  if (token) {
    try {
      verifyAccessToken(token);
      throw ApiError.badRequest("Already authenticated.");
    } catch (err) {
      if (err instanceof ApiError) throw err;
      // Invalid token — treat as guest, allow through.
    }
  }
  next();
};
