import type { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class ApiResponse {
  static send<T>(
    res: Response,
    statusCode: number,
    data: T,
    message = "Success",
    meta?: PaginationMeta
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(meta && { meta }),
    });
  }

  static ok<T>(res: Response, data: T, message = "Success", meta?: PaginationMeta) {
    return this.send(res, 200, data, message, meta);
  }

  static created<T>(res: Response, data: T, message = "Created") {
    return this.send(res, 201, data, message);
  }
}

export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
