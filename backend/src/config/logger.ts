import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { env } from "@/config/env";

/**
 * winston + winston-daily-rotate-file were installed from the start but
 * never actually wired up — every runtime log went through raw
 * console.log/console.error, with zero structure and zero persistence.
 * This is the app-wide logger: JSON (for log aggregation — CloudWatch/
 * ELK/Datadog all ingest structured JSON directly) plus rotating files
 * in production, human-readable colorized output in development.
 */
const { combine, timestamp, errors, printf, colorize, json } = winston.format;

const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack, ...meta }) => {
    const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${ts} ${level}: ${stack ?? message}${rest}`;
  })
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

const transports: winston.transport[] = [
  new winston.transports.Console({ format: env.isProduction ? prodFormat : devFormat }),
];

// File rotation only in production — in dev, console output is enough and
// a growing logs/ directory next to source files is just noise.
if (env.isProduction) {
  transports.push(
    new DailyRotateFile({
      dirname: "logs",
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "20m",
      maxFiles: "14d",
      format: prodFormat,
    }),
    new DailyRotateFile({
      dirname: "logs",
      filename: "combined-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      format: prodFormat,
    })
  );
}

export const logger = winston.createLogger({
  level: env.logLevel,
  transports,
  exitOnError: false,
});

/** Adapter so morgan (HTTP access logging) can write through winston instead of directly to stdout. */
export const httpLogStream = {
  write: (message: string) => logger.http(message.trim()),
};
