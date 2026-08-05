import { z } from "zod";

export const createContactMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  subject: z.string().trim().min(1, "Subject is required.").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(2000),
});
