export interface NewsletterSubscribeResponse {
  success: boolean;
  message: string;
}

/**
 * Placeholder implementation. In Sprint 9 this function's body is replaced
 * with a real `axios.post(`${API_BASE_URL}/newsletter`, { email })` call
 * against the Express backend — the signature and return shape are already
 * final, so no calling component needs to change when that happens.
 */
export async function subscribeToNewsletter(email: string): Promise<NewsletterSubscribeResponse> {
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  return {
    success: true,
    message: "You're on the list — welcome to MR_SK EATRIES!",
  };
}
