import dotenv from "dotenv";

dotenv.config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT ?? 5000),
  apiVersion: process.env.API_VERSION ?? "v1",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",

  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/mrsk_eatries"),

  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  redisPassword: process.env.REDIS_PASSWORD ?? "",

  jwt: {
    accessSecret: required("JWT_ACCESS_SECRET", "dev-access-secret-change-me"),
    refreshSecret: required("JWT_REFRESH_SECRET", "dev-refresh-secret-change-me"),
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "30d",
    cookieName: process.env.JWT_COOKIE_NAME ?? "mrsk_refresh_token",
  },

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 12),

  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER ?? "",
    password: process.env.SMTP_PASSWORD ?? "",
    from: process.env.EMAIL_FROM ?? "MR_SK EATRIES <noreply@mrsk-eatries.com>",
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  },

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 900000),
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 100),
  },

  admin: {
    seedEmail: process.env.ADMIN_SEED_EMAIL ?? "admin@mrsk-eatries.com",
    seedPassword: process.env.ADMIN_SEED_PASSWORD ?? "Admin123!",
  },

  ai: {
    /** Provider selector — AIProviderFactory branches on this, so switching the active provider is a config change, not a code change. Defaults to "groq": Gemini's free tier caps at 20 requests/day for this project's key (too restrictive for active development) and the Anthropic key ran out of credits; both remain fully wired and selectable. */
    provider: process.env.AI_PROVIDER ?? "groq",
    anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? "",
    /** Configurable rather than hardcoded — avoids baking in a model string that may be superseded. */
    anthropicModel: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5",
    geminiApiKey: process.env.GEMINI_API_KEY ?? "",
    /** "-latest" alias, not a pinned dated version — Google periodically retires dated model
     * names for new API keys/projects ("no longer available to new users"); the alias always
     * resolves to a current, non-deprecated flash model without needing a code change. */
    geminiModel: process.env.GEMINI_MODEL ?? "gemini-flash-latest",
    groqApiKey: process.env.GROQ_API_KEY ?? "",
    /** A fast, non-reasoning Groq-hosted model — deliberately not one of Groq's reasoning-capable
     * models (e.g. the qwen3 family), since every call site in this app wants a fast, direct
     * answer, the same reason GeminiProvider disables "thinking" outright. */
    groqModel: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
    maxTokens: Number(process.env.AI_MAX_TOKENS ?? 1024),
  },

  logLevel: process.env.LOG_LEVEL ?? "info",
};
