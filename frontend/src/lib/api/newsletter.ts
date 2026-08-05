import { httpClient, getApiErrorMessage } from "@/lib/api/httpClient";

export interface NewsletterSubscribeResponse {
  success: boolean;
  message: string;
}

/**
 * Sprint 9: real Express/MongoDB backend replaces the Sprint 4 placeholder.
 * Signature and return shape are unchanged, exactly as promised — no
 * calling component (Footer, homepage Newsletter section) needed to change.
 */
export async function subscribeToNewsletter(email: string): Promise<NewsletterSubscribeResponse> {
  try {
    const { data } = await httpClient.post("/newsletter/subscribe", { email });
    return { success: true, message: data.message };
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Please enter a valid email address."));
  }
}
