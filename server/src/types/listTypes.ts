import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     List:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         title:
 *           type: string
 *         isFavorited:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         modified_at:
 *           type: string
 *           format: date-time
 *     CreateListInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *       required:
 *         - title
 *     UpdateListInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         isFavorited:
 *           type: boolean
 */

export const ListSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  title: z
    .string()
    .min(1, "List title is required")
    .max(100, "List title must not exceed 100 characters")
    .refine((val) => val.trim().length > 0, {
      message: "List title must not be empty or only whitespace",
    }),
  isFavorited: z.boolean().default(false),
  created_at: z.date().optional(),
  modified_at: z.date().optional(),
});

export const createListSchema = ListSchema.omit({
  userId: true,
  created_at: true,
  modified_at: true,
});

export const AiListResponseSchema = z.object({
  status: z.enum(["SUCCESS", "ERROR"]),
  message: z.string().min(1, "Message is required"),
  title: z.string().min(1, "Title is required"),
  tasks: z.array(z.string().min(1, "Task must be a non-empty string")),
});

export const updateListSchema = createListSchema.partial();

// Query schema for filtering and sorting lists
export const listQuerySchema = z.object({
  isFavorited: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
  sort: z.string().optional(), // e.g. "created_at,-title"
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export type ListQueryInput = z.infer<typeof listQuerySchema>;
export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
export type ListType = z.infer<typeof ListSchema>;
