import api from "../../lib/axios";
import { handleApiRequest } from "../../lib/apiUtils";
import {
  User,
  UserResponse,
  UserResponseSchema,
  UsersResponse,
  UpdateUsernameSchema,
  UpdateUsername,
  updatePasswordSchema,
  UpdatePassword,
  UsersResponseSchema,
} from "./userTypes";
import { ToastOptionsSchema } from "../../lib/apiUtils";

// Fetch current user details
export const fetchCurrentUser = async (
  toastOptions?: ToastOptionsSchema
): Promise<User> => {
  const response = await handleApiRequest<UserResponse>(
    api.get("/users/me"),
    "Failed to fetch user details",
    "User details fetched successfully",
    toastOptions
  );
  return UserResponseSchema.parse(response).user;
};

export const fetchUserById = async (
  userId: string,
  toastOptions?: ToastOptionsSchema
): Promise<User> => {
  const response = await handleApiRequest<UserResponse>(
    api.get(`/users/profile/${userId}`),
    "Failed to fetch user details",
    "User details fetched successfully",
    toastOptions
  );
  return UserResponseSchema.parse(response).user;
};

export const fetchAllUsers = async (
  toastOptions?: ToastOptionsSchema
): Promise<User[]> => {
  const response = await handleApiRequest<UsersResponse>(
    api.get("/users"),
    "Failed to fetch users",
    "Users fetched successfully",
    toastOptions
  );
  return UsersResponseSchema.parse(response).users;
};

export const updateUsername = async (
  data: UpdateUsername,
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  data = UpdateUsernameSchema.parse(data);
  await handleApiRequest<UserResponse>(
    api.patch(`/users/username`, data),
    "Failed to update username",
    "Username updated successfully",
    toastOptions
  );
};

export const setUnverifiedEmail = async (
  email: string,
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  await handleApiRequest(
    api.post(`/users/set-unverified-email`, { email }),
    "Failed to set unverified email",
    "Unverified email set successfully",
    toastOptions
  );
};

export const promoteToPrimaryEmail = async (
  email: string,
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  await handleApiRequest(
    api.post(`/users/promote-verified-email`, { email }),
    "Failed to reset email",
    "Email reset successfully",
    toastOptions
  );
};

export const updatePassword = async (
  data: UpdatePassword,
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  data = updatePasswordSchema.parse(data);
  await handleApiRequest(
    api.patch(`/users/password`, data),
    "Failed to update password",
    "Password updated successfully",
    toastOptions
  );
};

export const updateUser = async (
  userData: FormData,
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  await handleApiRequest(
    api.patch(`/users`, userData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
    "Failed to update user",
    "User updated successfully",
    toastOptions
  );
};

export const deleteUser = async (
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  await handleApiRequest<{ message: string }>(
    api.delete(`/users`),
    "Failed to delete user",
    "User deleted successfully",
    toastOptions
  );
};
