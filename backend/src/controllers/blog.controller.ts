import type { Request, Response } from "express";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import * as blogService from "@/services/blog.service";

export const listPosts = asyncHandler(async (_req: Request, res: Response) => {
  const posts = await blogService.listPublishedPosts();
  return ApiResponse.ok(res, posts);
});

export const getPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await blogService.getPublishedPostBySlug(req.params.slug as string);
  return ApiResponse.ok(res, post);
});

// ── Admin ──────────────────────────────────────────────────────────

export const listAllPosts = asyncHandler(async (_req: Request, res: Response) => {
  const posts = await blogService.listAllPosts();
  return ApiResponse.ok(res, posts);
});

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await blogService.createPost(req.body);
  return ApiResponse.created(res, post, "Post created.");
});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await blogService.updatePost(req.params.id as string, req.body);
  return ApiResponse.ok(res, post, "Post updated.");
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  await blogService.deletePost(req.params.id as string);
  return ApiResponse.ok(res, null, "Post deleted.");
});
