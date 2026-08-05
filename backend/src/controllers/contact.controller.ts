import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import * as contactService from "@/services/contact.service";

export const createMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await contactService.createContactMessage(req.body);
  return ApiResponse.created(res, message, "Thanks for reaching out — we'll get back to you soon.");
});

// ── Admin ──────────────────────────────────────────────────────────

export const listMessages = asyncHandler(async (_req: Request, res: Response) => {
  const messages = await contactService.listContactMessages();
  return ApiResponse.ok(res, messages);
});

export const markMessageRead = asyncHandler(async (req: Request, res: Response) => {
  const message = await contactService.markContactMessageRead(req.params.id as string, req.body.isRead);
  return ApiResponse.ok(res, message, "Message updated.");
});
