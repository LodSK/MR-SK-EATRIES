import { z } from "zod";

export const createJobApplicationSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  phone: z.string().trim().min(6, "Enter a valid phone number.").max(30),
  position: z.string().trim().min(1, "Please select a position.").max(150),
  message: z.string().trim().min(10, "Tell us a bit about yourself.").max(2000),
});

export const updateJobApplicationStatusSchema = z.object({
  status: z.enum(["new", "reviewed", "contacted", "rejected"]),
});
