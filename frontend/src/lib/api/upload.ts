import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";

export type UploadFolder = "avatars" | "menu" | "gallery";

/** Reuses the existing POST /uploads/:folder endpoint (Cloudinary, Sprint 9) — no new backend work needed. */
export async function uploadImage(file: File, folder: UploadFolder = "avatars"): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const { data } = await httpClient.post(`/uploads/${folder}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data.url as string;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Upload failed. Please try a different image."));
  }
}
