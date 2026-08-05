import { z } from "zod";

export const aiChatSchema = z.object({
  message: z.string().min(1, "Message is required.").max(2000, "Keep messages under 2000 characters."),
  sessionId: z.string().optional().default(""),
});

export const aiRecommendSchema = z.object({
  budget: z.number().min(0).optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  timeOfDay: z.enum(["breakfast", "lunch", "dinner", "late-night"]).optional(),
});

export const aiSearchSchema = z.object({
  query: z.string().min(1, "Search query is required.").max(200),
});

export const aiPredictSchema = z.object({
  type: z.enum(["prep-time", "kitchen-load", "delivery-time", "sales-forecast"]),
  context: z.record(z.unknown()).optional(),
});
