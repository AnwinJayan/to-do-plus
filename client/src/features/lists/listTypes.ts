import { z } from "zod";

// --- Base Response Schema ---
export const BaseResponseSchema = z.object({
  message: z.string(),
});

// List Schema
export const ListSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  title: z.string().min(1, "Title is required").max(100, "Max 100 characters"),
  isFavorited: z.boolean(),
  created_at: z.string(),
  modified_at: z.string(),
});

// Create List Schema
export const CreateListSchema = ListSchema.pick({
  title: true,
});

export const CreateListWithAiSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
});

// Update List Schema
export const UpdateListSchema = ListSchema.partial().omit({
  _id: true,
  userId: true,
  created_at: true,
  modified_at: true,
});

// --- Response Schemas ---
export const ListResponseSchema = BaseResponseSchema.extend({
  list: ListSchema,
});

export const ListsResponseSchema = BaseResponseSchema.extend({
  lists: z.array(ListSchema),
});

// --- Query Schema ---
export const ListQuerySchema = z.object({
  isFavorited: z.boolean().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// --- Types ---
export type List = z.infer<typeof ListSchema>;
export type CreateList = z.infer<typeof CreateListSchema>;
export type CreateListWithAI = z.infer<typeof CreateListWithAiSchema>;
export type UpdateList = z.infer<typeof UpdateListSchema>;
export type ListResponse = z.infer<typeof ListResponseSchema>;
export type ListsResponse = z.infer<typeof ListsResponseSchema>;
export type ListQuery = z.infer<typeof ListQuerySchema>;
