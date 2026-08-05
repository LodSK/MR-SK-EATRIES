import { redis, isRedisReady } from "@/config/redis";

/**
 * Per-session refresh-token revocation (logout), distinct from
 * `user.tokenVersion` (a per-user counter bumped on password change to
 * invalidate every outstanding refresh token at once — logging out one
 * device should not sign every other device out too, which is why this
 * exists instead of just reusing tokenVersion for logout).
 *
 * Redis-backed with a fail-open fallback: if Redis is unreachable, logout
 * still clears the client's cookie (see auth.controller.ts) — this
 * blacklist is defense-in-depth on top of that, not the only thing
 * standing between a leaked token and an attacker.
 */
const KEY_PREFIX = "revoked:refresh:";

export async function blacklistRefreshToken(jti: string, ttlSeconds: number): Promise<void> {
  if (!isRedisReady() || ttlSeconds <= 0) return;
  await redis.set(`${KEY_PREFIX}${jti}`, "1", "EX", ttlSeconds);
}

export async function isRefreshTokenBlacklisted(jti: string): Promise<boolean> {
  if (!isRedisReady()) return false;
  const value = await redis.get(`${KEY_PREFIX}${jti}`);
  return value !== null;
}
