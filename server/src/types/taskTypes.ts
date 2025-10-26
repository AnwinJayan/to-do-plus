import { z } from "zod";

/**
 * @openapi
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         listId:
 *           type: string
 *         title:
 *           type: string
 *         completed:
 *           type: boolean
 *         position:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         modified_at:
 *           type: string
 *           format: date-time
 *     CreateTaskInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         listId:
 *           type: string
 *       required:
 *         - title
 *         - listId
 *     UpdateTaskInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         completed:
 *           type: boolean
 *         position:
 *           type: integer
 */

export const TaskSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  listId: z.string().min(1, "List ID is required"),
  title: z
    .string()
    .min(1, "Task title is required")
    .max(200, "Task title must not exceed 200 characters")
    .refine((val) => val.trim().length > 0, {
      message: "Task title must not be empty or only whitespace",
    }),
  completed: z.boolean().default(false),
  position: z.number().min(0, "Position must be a non-negative number"),
  created_at: z.date().optional(),
  modified_at: z.date().optional(),
});

export const createTaskSchema = TaskSchema.omit({
  userId: true,
  created_at: true,
  modified_at: true,
  position: true,
  completed: true,
});

export const updateTaskSchema = TaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskType = z.infer<typeof TaskSchema>;
