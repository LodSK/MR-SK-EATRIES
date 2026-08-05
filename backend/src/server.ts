import { createApp } from "@/app";
import { connectDatabase, disconnectDatabase } from "@/database/connect";
import { connectRedis, redis } from "@/config/redis";
import { env } from "@/config/env";
import { logger } from "@/config/logger";

async function start() {
  await connectDatabase();
  // Non-fatal — rate limiting falls back to in-memory if this doesn't connect.
  await connectRedis();

  const app = createApp();

  const server = app.listen(env.port, () => {
    logger.info(`[server] MR_SK EATRIES API listening on port ${env.port} (${env.nodeEnv})`);
    logger.info(`[server] Base URL: http://localhost:${env.port}/api/${env.apiVersion}`);
  });

  // Docker sends SIGTERM on `docker stop`/rolling deploys — without handling
  // it, in-flight requests get dropped and the Mongo connection is never
  // closed cleanly. Stop accepting new connections, let in-flight ones
  // finish, then close DB before exiting.
  function shutdown(signal: string) {
    logger.info(`[server] ${signal} received, shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      redis.disconnect();
      logger.info("[server] Shutdown complete.");
      process.exit(0);
    });
    // Don't hang forever waiting for stubborn open connections.
    setTimeout(() => {
      logger.error("[server] Forced shutdown after 10s timeout.");
      process.exit(1);
    }, 10_000).unref();
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((error) => {
  logger.error("[server] Failed to start", { error: error instanceof Error ? error.message : error });
  process.exit(1);
});
