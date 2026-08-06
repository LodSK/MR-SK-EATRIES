import { createHmac, timingSafeEqual } from "crypto";
import { env } from "@/config/env";
import { ApiError } from "@/utils/ApiError";

const BASE_URL = "https://api.paystack.co";

interface InitializeResult {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

interface VerifyResult {
  status: "success" | "failed" | "abandoned" | string;
  reference: string;
  /** Smallest currency unit (pesewas for GHS), as Paystack returns it. */
  amount: number;
  currency: string;
}

function authHeader() {
  return { Authorization: `Bearer ${env.paystack.secretKey}`, "Content-Type": "application/json" };
}

/** No official Paystack SDK is added — the API is plain REST and this app
 * already prefers a handful of native `fetch` calls over a dependency for
 * exactly this shape of integration (see googleOAuth.service.ts). */
export async function initializeTransaction(params: {
  email: string;
  amountInPesewas: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}): Promise<InitializeResult> {
  const res = await fetch(`${BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify({
      email: params.email,
      amount: params.amountInPesewas,
      reference: params.reference,
      currency: "GHS",
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const data = (await res.json()) as {
    status: boolean;
    message: string;
    data?: { authorization_url: string; access_code: string; reference: string };
  };

  if (!res.ok || !data.status || !data.data) {
    throw new ApiError(502, `Paystack initialization failed: ${data.message ?? "unknown error"}`);
  }

  return {
    authorizationUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference: data.data.reference,
  };
}

export async function verifyTransaction(reference: string): Promise<VerifyResult> {
  const res = await fetch(`${BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: authHeader(),
  });

  const data = (await res.json()) as {
    status: boolean;
    message: string;
    data?: { status: string; reference: string; amount: number; currency: string };
  };

  if (!res.ok || !data.status || !data.data) {
    throw new ApiError(502, `Paystack verification failed: ${data.message ?? "unknown error"}`);
  }

  return {
    status: data.data.status,
    reference: data.data.reference,
    amount: data.data.amount,
    currency: data.data.currency,
  };
}

/**
 * Paystack signs webhook payloads with the integration's own secret key
 * (HMAC-SHA512 over the raw request body) — there is no separate "webhook
 * secret" to configure on their side, despite PAYSTACK_WEBHOOK_SECRET
 * existing as an env var in this project (kept for forward-compatibility
 * only; see env.ts). `timingSafeEqual` avoids a timing side-channel on the
 * comparison; requires both buffers to be equal length, hence the guard.
 */
export function verifyWebhookSignature(rawBody: Buffer, signature: string | undefined): boolean {
  if (!signature) return false;
  const expected = createHmac("sha512", env.paystack.secretKey).update(rawBody).digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  const signatureBuf = Buffer.from(signature, "utf8");
  if (expectedBuf.length !== signatureBuf.length) return false;
  return timingSafeEqual(expectedBuf, signatureBuf);
}
