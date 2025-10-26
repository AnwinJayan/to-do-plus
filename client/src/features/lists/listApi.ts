import api from "../../lib/axios";
import { handleApiRequest } from "../../lib/apiUtils";
import {
  List,
  CreateList,
  CreateListWithAiSchema,
  CreateListWithAI,
  UpdateList,
  ListResponseSchema,
  ListsResponseSchema,
  ListResponse,
  ListsResponse,
  ListQuerySchema,
  ListQuery,
  CreateListSchema,
  UpdateListSchema,
} from "./listTypes";
import { ToastOptionsSchema } from "../../lib/apiUtils";

// Get all lists
export const fetchLists = async (
  params: ListQuery = {},
  toastOptions?: ToastOptionsSchema
): Promise<List[]> => {
  ListQuerySchema.parse(params);
  const response = await handleApiRequest(
    api.get<ListsResponse>("/lists", { params }),
    "Failed to fetch lists",
    "Lists fetched successfully",
    toastOptions
  );
  return ListsResponseSchema.parse(response).lists;
};

// Get a single list by ID
export const fetchListById = async (
  id: string,
  toastOptions?: ToastOptionsSchema
): Promise<List> => {
  const response = await handleApiRequest(
    api.get<ListResponse>(`/lists/${id}`),
    "Failed to fetch list by ID",
    "List fetched successfully",
    toastOptions
  );
  return ListResponseSchema.parse(response).list;
};

// Create a new list
export const createList = async (
  data: CreateList,
  toastOptions?: ToastOptionsSchema
): Promise<List> => {
  CreateListSchema.parse(data);
  const response = await handleApiRequest(
    api.post<ListResponse>("/lists", data),
    "Failed to create list",
    "List created successfully",
    toastOptions
  );
  return ListResponseSchema.parse(response).list;
};

// Create a new list with AI
export const createListWithAI = async (
  data: CreateListWithAI,
  toastOptions?: ToastOptionsSchema
): Promise<List> => {
  CreateListWithAiSchema.parse(data);
  const response = await handleApiRequest(
    api.post<ListResponse>("/lists/ai", data),
    "Failed to create list with AI",
    "List created with AI successfully",
    toastOptions
  );
  return ListResponseSchema.parse(response).list;
};

// Update a list
export const updateList = async (
  id: string,
  data: UpdateList,
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  UpdateListSchema.parse(data);
  await handleApiRequest(
    api.patch<ListResponse>(`/lists/${id}`, data),
    "Failed to update list",
    "List updated successfully",
    toastOptions
  );
};

// Delete a list
export const deleteList = async (
  id: string,
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  await handleApiRequest(
    api.delete(`/lists/${id}`),
    "Failed to delete list",
    "List deleted successfully",
    toastOptions
  );
};

// Delete all lists
export const deleteAllLists = async (
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  await handleApiRequest(
    api.delete("/lists"),
    "Failed to delete all lists",
    "All lists deleted successfully",
    toastOptions
  );
};
