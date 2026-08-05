import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";
import type { MenuItem } from "@/types/menu";

/**
 * "Favorites" is the Sprint 11 user-facing name for the Wishlist system
 * already fully built in Sprint 9 (`Wishlist.model.ts`, `wishlist.controller.ts`,
 * `wishlist.routes.ts`). Reusing those endpoints directly rather than
 * building a parallel `Favorite` backend — see PROJECT_STATUS.md for the
 * full reasoning.
 */

function normalizeItem(raw: MenuItem & { _id?: string }): MenuItem {
  return { ...raw, id: raw.id ?? raw._id ?? "" };
}

export async function getFavorites(): Promise<MenuItem[]> {
  const { data } = await httpClient.get("/wishlist");
  return (data.data as MenuItem[]).map(normalizeItem);
}

export async function addFavorite(menuItemId: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.post("/wishlist", { menuItemId });
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}

export async function removeFavorite(menuItemId: string): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.delete(`/wishlist/${menuItemId}`);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
