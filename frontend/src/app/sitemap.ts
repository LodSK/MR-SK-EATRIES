import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/config/site";
import { getMenuCategories, getMenuItems } from "@/lib/api/menu";
import { getBlogPosts } from "@/lib/api/blog";

const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/menu", changeFrequency: "weekly", priority: 0.9 },
  { path: "/reservations", changeFrequency: "monthly", priority: 0.8 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.5 },
  { path: "/events", changeFrequency: "weekly", priority: 0.6 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.4 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/track-order", changeFrequency: "yearly", priority: 0.3 },
];

/**
 * Account/admin/auth/cart/checkout are intentionally excluded — they're
 * either behind auth, transactional, or duplicated by a canonical redirect
 * (e.g. /order -> /menu), none of which belong in a public sitemap.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, items, posts] = await Promise.all([
    getMenuCategories().catch(() => []),
    getMenuItems().catch(() => []),
    getBlogPosts().catch(() => []),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_CONFIG.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_CONFIG.url}/menu/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const itemEntries: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${SITE_CONFIG.url}/menu/${item.category}/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_CONFIG.url}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt ?? post.createdAt),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...categoryEntries, ...itemEntries, ...blogEntries];
}
