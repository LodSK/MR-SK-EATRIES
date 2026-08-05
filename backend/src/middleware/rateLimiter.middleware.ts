import type { Request, Response, NextFunction } from "express";
import rateLimit, { type RateLimitRequestHandler } from "express-rate-limit";
import { RedisStore, type RedisReply } from "rate-limit-redis";
import { env } from "@/config/env";
import { redis, isRedisReady } from "@/config/redis";

/**
 * ioredis was installed from the start (ARCHITECTURE.md documents Redis as
 * backing rate-limit state) but never wired up — this ran on
 * express-rate-limit's default in-memory store, which resets on every
 * restart and doesn't share state across multiple instances behind a load
 * balancer. Backed by Redis when available now, with an in-memory fallback.
 *
 * Store choice is decided lazily, on the first real request, rather than
 * at module import time: `createApp()`/route registration happens at
 * import time, before `connectRedis()` (awaited in `server.ts`, same as
 * `connectDatabase()`) has resolved — deciding the store here instead
 * means it reflects Redis's *actual* connection state once the server is
 * live, not a premature guess made before the connection attempt even ran.
 */
function lazyLimiter(build: () => RateLimitRequestHandler): RateLimitRequestHandler {
  let instance: RateLimitRequestHandler | null = null;
  const handler = ((req: Request, res: Response, next: NextFunction) => {
    if (!instance) instance = build();
    return instance(req, res, next);
  }) as RateLimitRequestHandler;
  return handler;
}

function redisStoreIfReady() {
  return isRedisReady()
    ? new RedisStore({
        sendCommand: (...args: string[]) => redis.call(args[0] as string, args.slice(1)) as Promise<RedisReply>,
      })
    : undefined;
}

export const apiLimiter = lazyLimiter(() =>
  rateLimit({
    windowMs: env.rateLimit.windowMs,
    max: env.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    store: redisStoreIfReady(),
    message: { success: false, message: "Too many requests. Please try again later." },
  })
);

export const authLimiter = lazyLimiter(() =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    store: redisStoreIfReady(),
    message: { success: false, message: "Too many attempts. Please try again in a few minutes." },
  })
);
