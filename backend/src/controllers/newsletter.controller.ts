import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { NewsletterSubscriber } from "@/models/NewsletterSubscriber.model";

export const subscribe = asyncHandler(async (req: Request, res: Response) => {
  const email = (req.body.email as string).toLowerCase().trim();

  await NewsletterSubscriber.updateOne({ email }, { email }, { upsert: true });

  return ApiResponse.ok(res, null, "You're on the list — welcome to MR_SK EATRIES!");
});
