import { z } from "zod";

// Main admin schema (minimal, as only suspension is modeled)
export const adminSchema = z.object({
  reason: z.string().min(1, "Suspension reason is required"),
});

// Request body schemas derived from adminSchema
export const suspensionRequestSchema = adminSchema.pick({ reason: true });
