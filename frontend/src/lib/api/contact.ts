import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";
import type { ContactMessage, ContactMessagePayload } from "@/types/contact";

export async function sendContactMessage(
  payload: ContactMessagePayload
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.post("/contact", payload);
    return { success: true, message: data.message };
  } catch (error) {
    return {
      success: false,
      message: getApiErrorMessage(error, "We couldn't send your message. Please try again."),
    };
  }
}

// ── Admin ──────────────────────────────────────────────────────────

function normalizeMessage(raw: ContactMessage & { _id?: string }): ContactMessage {
  return { ...raw, id: raw.id ?? raw._id ?? "" };
}

export async function adminListContactMessages(): Promise<ContactMessage[]> {
  const { data } = await httpClient.get("/admin/contact-messages");
  return (data.data as ContactMessage[]).map(normalizeMessage);
}

export async function adminMarkContactMessageRead(
  id: string,
  isRead: boolean
): Promise<{ success: boolean; message: string }> {
  try {
    const { data } = await httpClient.patch(`/admin/contact-messages/${id}`, { isRead });
    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: getApiErrorMessage(error) };
  }
}
