import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { verifyWebhookSignature } from "@/services/paystack.service";
import { handlePaystackWebhookEvent } from "@/services/order.service";
import { logger } from "@/config/logger";

/**
 * Always answers 200 — Paystack retries on non-2xx, and neither "signature
 * didn't match" nor "we don't recognize this reference" is something a
 * retry would fix. Real signature verification is what actually gates any
 * order mutation; this isn't "trust everything," it's "don't make Paystack
 * hammer us over events we intentionally ignore."
 */
export const paystackWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers["x-paystack-signature"] as string | undefined;
  const rawBody = req.rawBody;

  if (!rawBody || !verifyWebhookSignature(rawBody, signature)) {
    logger.warn("[paystack] webhook signature verification failed");
    return res.status(200).json({ received: true });
  }

  const event = req.body as { event?: string; data?: { reference?: string } };
  if (event.event === "charge.success" && event.data?.reference) {
    await handlePaystackWebhookEvent(event.data.reference).catch((err) =>
      logger.error("[paystack] webhook processing failed", { error: err instanceof Error ? err.message : err })
    );
  }

  return res.status(200).json({ received: true });
});
