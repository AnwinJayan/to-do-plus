// NOTE: All response schemas should be derived from a base schema (e.g., BaseResponseSchema), and lower-level schemas should extend higher-level ones for consistency and maintainability.

import { z } from "zod";

// --- Base Response Schema ---
export const BaseResponseSchema = z.object({
  message: z.string(),
});

export const UserSchema = z.object({
  _id: z.string(), // mongoose.Types.ObjectId as string
  username: z.string().transform((val) => val.trim()),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  isSuspended: z.boolean(),
  suspensionReason: z.string().optional().nullable(),
  imageUrl: z.string().url("Invalid URL").optional().nullable(),
  image: z.instanceof(FileList).optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const UserResponseSchema = BaseResponseSchema.extend({
  user: UserSchema,
});

export const EditUserSchema = UserSchema.pick({
  username: true,
  imageUrl: true,
  image: true,
}).partial();

export const UpdateUsernameSchema = UserSchema.pick({
  username: true,
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(1, "New password is required"),
});

// --- Response Schemas ---
export const UsersResponseSchema = BaseResponseSchema.extend({
  users: z.array(UserSchema),
});

export type User = z.infer<typeof UserSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UsersResponse = z.infer<typeof UsersResponseSchema>;
export type UpdateUsername = z.infer<typeof UpdateUsernameSchema>;
export type EditUser = z.infer<typeof EditUserSchema>;
export type UpdatePassword = z.infer<typeof updatePasswordSchema>;
export type UserState = User & {
  loading: boolean;
};
