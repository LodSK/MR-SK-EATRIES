import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";
import type { MenuItem } from "@/types/menu";

function normalize(raw: MenuItem & { _id?: string }): MenuItem {
  return { ...raw, id: raw.id ?? raw._id ?? "" };
}

export async function adminListMenuItems(params: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}): Promise<{ items: MenuItem[]; total: number }> {
  const { data } = await httpClient.get("/admin/menu", { params });
  return { items: (data.data as MenuItem[]).map(normalize), total: data.meta?.total ?? data.data.length };
}

export interface MenuItemPayload {
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  price: number;
  currency?: string;
  prepTimeMinutes?: number;
  tag?: "New" | "Popular" | "Chef's Pick";
  isVegetarian?: boolean;
  isSpicy?: boolean;
  isAvailable?: boolean;
  isFeatured?: boolean;
  stockQuantity?: number;
  ingredients?: string[];
}

export async function createMenuItem(payload: MenuItemPayload): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.post("/admin/menu", payload);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function updateMenuItem(
  id: string,
  payload: Partial<MenuItemPayload>
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.patch(`/admin/menu/${id}`, payload);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function deleteMenuItem(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.delete(`/admin/menu/${id}`);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
