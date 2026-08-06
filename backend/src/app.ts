import express, { type Application } from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
// @ts-expect-error — xss-clean ships no type declarations
import xss from "xss-clean";

import { env } from "@/config/env";
import { httpLogStream } from "@/config/logger";
import { isRedisReady } from "@/config/redis";
import { apiLimiter } from "@/middleware/rateLimiter.middleware";
import { errorHandler, notFoundHandler } from "@/middleware/error.middleware";
import routes from "@/routes/index";

export function createApp(): Application {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );
  app.use(compression());
  app.use(cookieParser());
  app.use(
    express.json({
      limit: "1mb",
      // Stashes the exact bytes Paystack signed, before body-parser
      // re-serializes them into req.body — the webhook handler HMACs this,
      // not JSON.stringify(req.body), since those aren't guaranteed identical.
      verify: (req, _res, buf) => {
        (req as express.Request).rawBody = buf;
      },
    })
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(mongoSanitize());
  app.use(hpp());
  app.use(xss());

  // Dev: colorized, human-readable, straight to stdout. Production: full
  // access-log format (client IP, status, response time) piped through
  // winston — previously there was zero HTTP request logging in production.
  app.use(morgan(env.isProduction ? "combined" : "dev", env.isProduction ? { stream: httpLogStream } : undefined));

  app.use(`/api/${env.apiVersion}`, apiLimiter, routes);

  // Used by Docker's HEALTHCHECK and any load balancer / uptime probe in
  // front of the API. MongoDB is a hard dependency (readyState !== 1 means
  // effectively nothing works) so its absence returns 503; Redis is a
  // soft dependency (rate limiting/session-revocation degrade gracefully
  // without it — see config/redis.ts) so its absence is reported but
  // doesn't fail the check.
  app.get("/health", (_req, res) => {
    const mongoConnected = mongoose.connection.readyState === 1;
    const redisConnected = isRedisReady();

    res.status(mongoConnected ? 200 : 503).json({
      success: mongoConnected,
      message: mongoConnected ? "MR_SK EATRIES API is running." : "Database unavailable.",
      env: env.nodeEnv,
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      dependencies: {
        mongodb: mongoConnected ? "connected" : "disconnected",
        redis: redisConnected ? "connected" : "unavailable (in-memory fallback active)",
      },
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
