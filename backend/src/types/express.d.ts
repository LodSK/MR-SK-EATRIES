import type { Role } from "@/config/constants";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
      /** Raw request body bytes, captured by express.json()'s `verify` hook in
       * app.ts — needed to compute the Paystack webhook HMAC signature, since
       * a signature can't be verified against the already-parsed/re-serialized
       * JSON (whitespace/key-order differences would break the hash). */
      rawBody?: Buffer;
    }
  }
}

export {};
