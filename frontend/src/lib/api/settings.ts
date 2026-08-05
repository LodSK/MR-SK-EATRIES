import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";
import type { RestaurantSettings } from "@/types/settings";

export async function getSettings(): Promise<RestaurantSettings> {
  const { data } = await httpClient.get("/settings");
  return data.data;
}

export async function updateSettings(
  payload: Partial<RestaurantSettings>
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.patch("/admin/settings", payload);
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
