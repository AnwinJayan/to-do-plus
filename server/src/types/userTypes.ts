import { z } from "zod";

// Main User schema matching Mongoose
export const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(128, "Password must be at most 128 characters"),
  role: z.enum(["user", "admin"]).default("user"),
  isSuspended: z.boolean().default(false),
  suspensionReason: z.string().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export interface UserPayload {
  userId: string;
  clerkId: string;
  role: string;
}

export const userIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user ID format"),
});

// Request body schemas derived from userSchema
export const registerSchema = userSchema.pick({
  username: true,
  password: true,
  role: true,
});

export const loginSchema = userSchema.pick({
  username: true,
  password: true,
});

export const updateUsernameSchema = z.object({
  username: z.string(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(1, "New password is required"),
});

export const updateProfileImageSchema = z.object({
  image: z.string().optional().nullable(),
});
