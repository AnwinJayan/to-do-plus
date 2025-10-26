import { z } from "zod";

// --- Base Response Schema ---
export const BaseResponseSchema = z.object({
  message: z.string(),
});

// Task Schema
export const TaskSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  listId: z.string(),
  title: z.string().min(1, "Title is required").max(200, "Max 200 characters"),
  completed: z.boolean(),
  position: z.number(),
  created_at: z.string(),
  modified_at: z.string(),
});

// Create Task Schema
export const CreateTaskSchema = TaskSchema.pick({
  title: true,
  listId: true,
});

// Update Task Schema
export const UpdateTaskSchema = TaskSchema.partial().omit({
  _id: true,
  userId: true,
  listId: true,
  created_at: true,
  modified_at: true,
});

// --- Response Schemas ---
export const TaskResponseSchema = BaseResponseSchema.extend({
  task: TaskSchema,
});

export const TasksResponseSchema = BaseResponseSchema.extend({
  tasks: z.array(TaskSchema),
});

// --- Types ---
export type Task = z.infer<typeof TaskSchema>;
export type CreateTask = z.infer<typeof CreateTaskSchema>;
export type UpdateTask = z.infer<typeof UpdateTaskSchema>;
export type TaskResponse = z.infer<typeof TaskResponseSchema>;
export type TasksResponse = z.infer<typeof TasksResponseSchema>;
