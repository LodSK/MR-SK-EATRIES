import { Blog, type IBlog } from "@/models/Blog.model";
import { ApiError } from "@/utils/ApiError";
import { uniqueSlug } from "@/utils/slugify";

export async function listPublishedPosts() {
  return Blog.find({ isPublished: true }).sort({ publishedAt: -1 });
}

export async function getPublishedPostBySlug(slug: string) {
  const post = await Blog.findOne({ slug, isPublished: true });
  if (!post) throw ApiError.notFound("Post not found.");
  return post;
}

// ── Admin ──────────────────────────────────────────────────────────

export async function listAllPosts() {
  return Blog.find().sort({ createdAt: -1 });
}

export async function createPost(data: {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  tags?: string[];
  isPublished?: boolean;
}): Promise<IBlog> {
  const slug = await uniqueSlug(data.title, async (candidate) => !!(await Blog.findOne({ slug: candidate })));
  return Blog.create({
    ...data,
    slug,
    publishedAt: data.isPublished ? new Date() : undefined,
  });
}

export async function updatePost(id: string, data: Partial<IBlog>): Promise<IBlog> {
  const existing = await Blog.findById(id);
  if (!existing) throw ApiError.notFound("Post not found.");

  const wasPublished = existing.isPublished;
  if (data.title && data.title !== existing.title) {
    data.slug = await uniqueSlug(data.title, async (candidate) => {
      if (candidate === existing.slug) return false;
      return !!(await Blog.findOne({ slug: candidate }));
    });
  }
  if (data.isPublished && !wasPublished) {
    data.publishedAt = new Date();
  }

  Object.assign(existing, data);
  await existing.save();
  return existing;
}

export async function deletePost(id: string): Promise<void> {
  const post = await Blog.findByIdAndDelete(id);
  if (!post) throw ApiError.notFound("Post not found.");
}
