import api from "../../lib/axios";
import { handleApiRequest } from "../../lib/apiUtils";
import {
  Task,
  CreateTask,
  UpdateTask,
  TaskResponseSchema,
  TasksResponseSchema,
  TaskResponse,
  TasksResponse,
  CreateTaskSchema,
  UpdateTaskSchema,
} from "./taskTypes";
import { ToastOptionsSchema } from "../../lib/apiUtils";

// Get all tasks for a list
export const fetchTasksByListId = async (
  listId: string,
  toastOptions?: ToastOptionsSchema
): Promise<Task[]> => {
  const response = await handleApiRequest(
    api.get<TasksResponse>(`/tasks/${listId}`),
    "Failed to fetch tasks",
    "Tasks fetched successfully",
    toastOptions
  );
  return TasksResponseSchema.parse(response).tasks;
};

// Get a single task by ID
export const fetchTaskById = async (
  id: string,
  toastOptions?: ToastOptionsSchema
): Promise<Task> => {
  const response = await handleApiRequest(
    api.get<TaskResponse>(`/tasks/id/${id}`),
    "Failed to fetch task by ID",
    "Task fetched successfully",
    toastOptions
  );
  return TaskResponseSchema.parse(response).task;
};

// Create a new task
export const createTask = async (
  data: CreateTask,
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  CreateTaskSchema.parse(data);
  await handleApiRequest(
    api.post<TaskResponse>("/tasks", data),
    "Failed to create task",
    "Task created successfully",
    toastOptions
  );
};

// Update a task
export const updateTask = async (
  id: string,
  data: UpdateTask,
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  UpdateTaskSchema.parse(data);
  await handleApiRequest(
    api.patch<TaskResponse>(`/tasks/${id}`, data),
    "Failed to update task",
    "Task updated successfully",
    toastOptions
  );
};

// Delete a task
export const deleteTask = async (
  id: string,
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  await handleApiRequest(
    api.delete(`/tasks/${id}`),
    "Failed to delete task",
    "Task deleted successfully",
    toastOptions
  );
};

// Reorder tasks (batch update positions)
export const reorderTasks = async (
  listId: string,
  taskPositions: { taskId: string; position: number }[],
  toastOptions?: ToastOptionsSchema
): Promise<void> => {
  await handleApiRequest(
    api.patch(`/tasks/${listId}/reorder`, { taskPositions }),
    "Failed to reorder tasks",
    "Tasks reordered successfully",
    toastOptions
  );
};
