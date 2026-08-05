import mongoose from "mongoose";
import { env } from "@/config/env";
import { logger } from "@/config/logger";

mongoose.set("strictQuery", true);

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri);
    logger.info(`[database] Connected — ${mongoose.connection.name}`);
  } catch (error) {
    logger.error("[database] Connection failed", { error: error instanceof Error ? error.message : error });
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info("[database] Disconnected");
}

mongoose.connection.on("error", (error) => {
  logger.error("[database] Connection error", { error: error instanceof Error ? error.message : error });
});
