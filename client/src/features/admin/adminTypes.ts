// NOTE: All response schemas should be derived from a base schema (e.g., BaseResponseSchema), and lower-level schemas should extend higher-level ones for consistency and maintainability.

import { z } from "zod";

export const BaseResponseSchema = z.object({
  message: z.string(),
});

export const SuspentionRequestSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  reason: z.string().min(1, "Suspension reason is required"),
});

export type SuspentionRequest = z.infer<typeof SuspentionRequestSchema>;

export const UnsuspendRequestSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export type UnsuspendRequest = z.infer<typeof UnsuspendRequestSchema>;
