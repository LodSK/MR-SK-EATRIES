import type { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { asyncHandler } from "@/utils/asyncHandler";
import { ApiResponse } from "@/utils/ApiResponse";
import { ApiError } from "@/utils/ApiError";
import { env } from "@/config/env";

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

function uploadBuffer(buffer: Buffer, folder: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, resource_type: "image" }, (error, result) => {
      if (error || !result) return reject(error ?? new Error("Upload failed"));
      resolve(result.secure_url);
    });
    stream.end(buffer);
  });
}

/** Generic image upload — `folder` (avatars/menu/gallery) determines the Cloudinary destination. */
export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest("No file uploaded.");
  if (!env.cloudinary.cloudName) {
    throw ApiError.internal("Image uploads are not configured on this server yet.");
  }

  const folder = `mrsk-eatries/${((req.params.folder as string | undefined) ?? "misc").replace(/[^a-z-]/gi, "")}`;
  const url = await uploadBuffer(req.file.buffer, folder);

  return ApiResponse.ok(res, { url }, "Image uploaded.");
});
