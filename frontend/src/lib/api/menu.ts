import type { FoodCategory, MenuCategorySlug, MenuItem } from "@/types/menu";

/**
 * Sprint 9: real Express/MongoDB backend replaces the Sprint 6 in-memory
 * placeholder. Every exported function keeps its exact Sprint 6 signature
 * so no component (Server Components under app/(marketing)/menu/) changed.
 *
 * Uses plain `fetch` rather than the client-side `httpClient` — these
 * functions run in Server Components at request time (no browser, no
 * Zustand auth store available), and menu browsing endpoints are public
 * anyway. Next.js's extended `fetch` also gets ISR-style caching for free.
 */

/**
 * `API_INTERNAL_BASE_URL` (server-only, no NEXT_PUBLIC_ prefix — never
 * reaches the browser bundle) lets these Server Component fetches target
 * the backend directly over the Docker network (e.g. http://backend:5000)
 * instead of going back out through nginx/TLS like real browser requests
 * do. Unset in any non-containerized deployment, where it's simply the
 * same URL as NEXT_PUBLIC_API_BASE_URL anyway — this is additive, not a
 * behavior change for existing setups.
 */
const API_BASE_URL =
  process.env.API_INTERNAL_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

/**
 * Bug fix: Mongoose documents serialize to JSON with `_id`, not `id` —
 * the `id` virtual Mongoose adds is not included by default unless
 * `toJSON: { virtuals: true }` is set on the schema, which it isn't here.
 * The frontend's `MenuItem` type expects `id`. Without this mapping,
 * `item.id` is `undefined` everywhere a menu item is consumed (cart,
 * checkout), which is exactly what caused `menuItemId: undefined` to
 * reach the backend's order validation. Mapped once, here, at the API
 * boundary — no component needs to change.
 */
function normalizeMenuItem(raw: MenuItem & { _id?: string }): MenuItem {
  return { ...raw, id: raw.id ?? raw._id ?? "" };
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`Menu API request failed: ${res.status} ${path}`);
  const json = await res.json();
  return json.data as T;
}

export async function getMenuCategories(): Promise<FoodCategory[]> {
  return apiGet<FoodCategory[]>("/categories");
}

export async function getMenuCategoryBySlug(slug: MenuCategorySlug): Promise<FoodCategory | null> {
  const categories = await getMenuCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const items = await apiGet<MenuItem[]>("/menu?limit=100");
  return items.map(normalizeMenuItem);
}

export async function getMenuItemsByCategory(category: MenuCategorySlug): Promise<MenuItem[]> {
  const items = await apiGet<MenuItem[]>(`/menu?category=${category}&limit=100`);
  return items.map(normalizeMenuItem);
}

export async function getMenuItemBySlug(slug: string): Promise<MenuItem | null> {
  try {
    const result = await apiGet<{ item: MenuItem }>(`/menu/${slug}`);
    return normalizeMenuItem(result.item);
  } catch {
    return null;
  }
}

export async function getRelatedMenuItems(item: MenuItem, limit = 3): Promise<MenuItem[]> {
  const result = await apiGet<{ item: MenuItem; related: MenuItem[] }>(`/menu/${item.slug}`);
  return result.related.slice(0, limit).map(normalizeMenuItem);
}

export async function getFeaturedMenuItems(limit = 6): Promise<MenuItem[]> {
  const items = await apiGet<MenuItem[]>(`/menu/featured?limit=${limit}`);
  return items.map(normalizeMenuItem);
}

export async function searchMenuItems(query: string): Promise<MenuItem[]> {
  const items = await apiGet<MenuItem[]>(`/menu/search?q=${encodeURIComponent(query)}`);
  return items.map(normalizeMenuItem);
}
