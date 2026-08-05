import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/utils/ApiError";
import { env } from "@/config/env";
import { logger } from "@/config/logger";

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  let statusCode = 500;
  let message = "Internal server error";
  let details: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof Error) {
    message = err.message;
    // Mongoose validation errors
    if (err.name === "ValidationError") {
      statusCode = 400;
      message = "Validation failed";
      details = err.message;
    }
    // Mongoose CastError — malformed ObjectId (or other bad-typed field) in
    // a URL param or query, e.g. GET /orders/not-an-id. This is bad client
    // input, not a server fault — without this branch it fell through to a
    // 500 with Mongoose's raw internal message exposed to the client.
    if (err.name === "CastError") {
      statusCode = 400;
      message = "Invalid ID format.";
    }
    // Mongoose duplicate key error
    if ((err as { code?: number }).code === 11000) {
      statusCode = 409;
      message = "A record with that value already exists.";
    }
  }

  if (statusCode >= 500) {
    logger.error(err instanceof Error ? err.message : "Unknown error", {
      stack: err instanceof Error ? err.stack : undefined,
      method: req.method,
      url: req.originalUrl,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(!env.isProduction && err instanceof Error ? { stack: err.stack } : {}),
  });
}
