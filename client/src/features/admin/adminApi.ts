import api from "../../lib/axios";
import { handleApiRequest } from "../../lib/apiUtils";
import { UsersResponseSchema, User } from "../user/userTypes";
import {
  SuspentionRequestSchema,
  SuspentionRequest,
  UnsuspendRequestSchema,
  UnsuspendRequest,
} from "./adminTypes";
import { ToastOptionsSchema } from "../../lib/apiUtils";

export const fetchAllUsers = async (
  toastOptions?: ToastOptionsSchema
): Promise<User[]> => {
  const response = await handleApiRequest<User[]>(
    api.get("/admin/users"),
    "Failed to fetch admin users",
    "Admin users fetched successfully",
    toastOptions
  );
  return UsersResponseSchema.parse(response).users;
};

export const makeuserAdminById = async (
  userId: string,
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  await handleApiRequest(
    api.post(`/admin/users/${userId}/make-admin`),
    "Failed to make user admin",
    "User made admin successfully",
    toastOptions
  );
};

export const revokeAdminById = async (
  userId: string,
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  await handleApiRequest(
    api.post(`/admin/users/${userId}/revoke-admin`),
    "Failed to revoke admin privileges",
    "Admin privileges revoked successfully",
    toastOptions
  );
};

export const suspendUser = async (
  data: SuspentionRequest,
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  const { reason, userId } = SuspentionRequestSchema.parse(data);
  await handleApiRequest(
    api.post(`/admin/users/${userId}/suspend`, { reason }),
    "Failed to suspend user",
    "User suspended successfully",
    toastOptions
  );
};

export const unsuspendUser = async (
  data: UnsuspendRequest,
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  const { userId } = UnsuspendRequestSchema.parse(data);
  await handleApiRequest(
    api.post(`/admin/users/${userId}/unsuspend`),
    "Failed to unsuspend user",
    "User unsuspended successfully",
    toastOptions
  );
};

export const deleteUser = async (
  userId: string,
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  await handleApiRequest(
    api.delete(`/admin/users/${userId}`),
    "Failed to delete user",
    "User deleted successfully",
    toastOptions
  );
};

export const deleteAllUsers = async (
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  await handleApiRequest(
    api.delete("/admin/users"),
    "Failed to delete all users",
    "All users deleted successfully",
    toastOptions
  );
};

export const deleteAllBags = async (
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  await handleApiRequest(
    api.delete("/admin/bags"),
    "Failed to delete all bags",
    "All bags deleted successfully",
    toastOptions
  );
};
