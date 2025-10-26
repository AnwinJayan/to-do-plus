// NOTE: All response schemas should be derived from a base schema (e.g., BaseResponseSchema), and lower-level schemas should extend higher-level ones for consistency and maintainability.

import { z } from "zod";
import { UserSchema } from "../user/userTypes";

// --- Base Response Schema ---
export const BaseResponseSchema = z.object({
  message: z.string().optional(),
});

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const registerSchema = UserSchema.pick({
  username: true,
})
  .extend({
    password: z.string().min(1, "password required"),
    confirmPassword: z.string().min(1, "confirm password required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = UserSchema.pick({
  username: true,
}).extend({
  password: z.string().min(1, "password required"),
  confirmPassword: z.string().optional(),
});

// --- Response Schemas ---
export const AuthResponseSchema = BaseResponseSchema;

export type Register = z.infer<typeof registerSchema>;
export type Login = z.infer<typeof loginSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
