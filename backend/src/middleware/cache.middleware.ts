import type { NextFunction, Request, Response } from "express";

/**
 * Sets a `Cache-Control` header for genuinely public, non-personalized GET
 * endpoints (menu, categories, blog). Mirrors the 60s window the frontend
 * already uses for these same endpoints (`next: { revalidate: 60 }` in
 * `lib/api/menu.ts` / `lib/api/blog.ts`), so a direct API caller/CDN gets
 * the same freshness guarantee. Never apply this to authenticated or
 * per-user routes (admin, cart, orders, account) — those must not be cached.
 */
export function cachePublic(seconds = 60) {
  return (_req: Request, res: Response, next: NextFunction) => {
    res.set("Cache-Control", `public, max-age=${seconds}, stale-while-revalidate=${seconds * 5}`);
    next();
  };
}
