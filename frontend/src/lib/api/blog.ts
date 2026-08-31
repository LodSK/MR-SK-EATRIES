import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";
import type { BlogPost, BlogPostPayload } from "@/types/blog";

/**
 * Public list/detail run in Server Components (app/(marketing)/blog/) —
 * plain `fetch` rather than the client-side `httpClient`, same reasoning
 * as menu.ts: no browser, no Zustand auth store available at request
 * time, and these endpoints are public anyway. Admin functions below use
 * httpClient since they need the authenticated session.
 */
// See menu.ts's comment on API_INTERNAL_BASE_URL — same reasoning applies here.
const API_BASE_URL =
  process.env.API_INTERNAL_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

function normalizePost(raw: BlogPost & { _id?: string }): BlogPost {
  return { ...raw, id: raw.id ?? raw._id ?? "" };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/blog`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data as BlogPost[]).map(normalizePost);
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/blog/${slug}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return normalizePost(json.data);
  } catch {
    return null;
  }
}

// ── Admin ──────────────────────────────────────────────────────────

export async function adminListBlogPosts(): Promise<BlogPost[]> {
  const { data } = await httpClient.get("/admin/blog");
  return (data.data as BlogPost[]).map(normalizePost);
}

export async function adminCreateBlogPost(
  payload: BlogPostPayload
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.post("/admin/blog", payload);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function adminUpdateBlogPost(
  id: string,
  payload: Partial<BlogPostPayload>
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.patch(`/admin/blog/${id}`, payload);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function adminDeleteBlogPost(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.delete(`/admin/blog/${id}`);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
