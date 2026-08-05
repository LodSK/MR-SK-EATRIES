import { z } from "zod";

export const createBlogPostSchema = z.object({
  title: z.string().trim().min(3).max(200),
  excerpt: z.string().trim().min(10).max(300),
  content: z.string().trim().min(50),
  author: z.string().trim().min(1).max(120),
  tags: z.array(z.string().trim()).optional(),
  isPublished: z.boolean().optional(),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();
