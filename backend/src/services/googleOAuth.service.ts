import { randomBytes } from "crypto";
import { env } from "@/config/env";
import { ApiError } from "@/utils/ApiError";

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo";

export interface GoogleProfile {
  googleId: string;
  email: string;
  emailVerified: boolean;
  fullName: string;
  avatarUrl?: string;
}

/** No SDK/passport dependency — Google's OAuth endpoints are plain REST, and
 * this app already avoids adding a dependency for a handful of HTTP calls
 * (see paystack.service.ts for the same reasoning). */
export function generateOAuthState(): string {
  return randomBytes(24).toString("hex");
}

export function buildGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: env.googleOAuth.clientId,
    redirect_uri: env.googleOAuth.callbackUrl,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    state,
  });
  return `${AUTH_ENDPOINT}?${params.toString()}`;
}

export async function exchangeCodeForProfile(code: string): Promise<GoogleProfile> {
  const tokenRes = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.googleOAuth.clientId,
      client_secret: env.googleOAuth.clientSecret,
      redirect_uri: env.googleOAuth.callbackUrl,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    throw ApiError.unauthorized("Google sign-in failed — could not exchange authorization code.");
  }
  const tokenData = (await tokenRes.json()) as { access_token?: string };
  if (!tokenData.access_token) {
    throw ApiError.unauthorized("Google sign-in failed — no access token returned.");
  }

  const profileRes = await fetch(USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!profileRes.ok) {
    throw ApiError.unauthorized("Google sign-in failed — could not fetch account profile.");
  }

  const profile = (await profileRes.json()) as {
    sub: string;
    email: string;
    email_verified: boolean;
    name: string;
    picture?: string;
  };

  return {
    googleId: profile.sub,
    email: profile.email,
    emailVerified: profile.email_verified,
    fullName: profile.name,
    avatarUrl: profile.picture,
  };
}
