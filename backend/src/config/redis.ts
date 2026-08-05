import Redis from "ioredis";
import { env } from "@/config/env";
import { logger } from "@/config/logger";

/**
 * ioredis was installed from the start (ARCHITECTURE.md documents Redis as
 * backing rate-limit state), but no client was ever instantiated anywhere
 * — rate limiting ran on express-rate-limit's default in-memory store,
 * which resets on every restart and doesn't share state across instances.
 *
 * `lazyConnect: true` + the retry strategy below mean a Redis outage never
 * crashes the API — `rateLimiter.middleware.ts` falls back to the in-memory
 * store if this client isn't ready, so Redis is a performance/correctness
 * upgrade for rate-limiting, not a hard dependency for the app to boot.
 */
export const redis = new Redis(env.redisUrl, {
  password: env.redisPassword || undefined,
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  // Fast retries for a momentary blip, then back off hard — without a cap
  // ioredis retries forever by default, which (confirmed live: with no
  // Redis running at all) floods the log with a reconnect attempt every
  // 1-2s indefinitely. Once clearly down, checking every 30s is still
  // fast enough to pick Redis back up without being noisy about it.
  retryStrategy: (times) => (times <= 3 ? times * 300 : 30_000),
});

// The same reasoning applies to the error log itself — ioredis emits an
// `error` event per failed attempt, so logging every one at the same
// cadence as the retries above would still spam. Only the first one (and
// anything after a 30s gap, e.g. a fresh outage) actually gets logged.
let lastErrorLoggedAt = 0;
redis.on("error", (error) => {
  const now = Date.now();
  if (now - lastErrorLoggedAt < 30_000) return;
  lastErrorLoggedAt = now;
  logger.warn("[redis] Connection error — falling back to in-memory rate limiting", {
    error: error.message,
  });
});

redis.on("connect", () => {
  logger.info("[redis] Connected");
});

export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
  } catch (error) {
    logger.warn("[redis] Initial connection failed — continuing without Redis", {
      error: error instanceof Error ? error.message : error,
    });
  }
}

export function isRedisReady(): boolean {
  return redis.status === "ready";
}
