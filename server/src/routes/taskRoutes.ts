import { Router } from "express";
import {
  createTask,
  getTasksByList,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
import { createTaskSchema, updateTaskSchema } from "../types/taskTypes";
// import { validate } from "../middlewares/validate";
import authenticateUser from "../middlewares/authenticateUser";
import restrictSuspendedUsers from "../middlewares/restrictSuspendedUsers";

const router = Router();

/**
 * @openapi
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task created successfully
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 */
router.post("/", authenticateUser, restrictSuspendedUsers, createTask);

/**
 * @openapi
 * /tasks/{listId}:
 *   get:
 *     summary: Get all tasks for a list
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: List ID
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tasks retrieved successfully
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 */
router.get(
  "/:listId",
  authenticateUser,
  restrictSuspendedUsers,
  getTasksByList
);

/**
 * @openapi
 * /tasks/id/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task retrieved successfully
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 */
router.get("/id/:id", authenticateUser, restrictSuspendedUsers, getTaskById);

/**
 * @openapi
 * /tasks/{id}:
 *   patch:
 *     summary: Update a task by ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskInput'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Task updated successfully
 *                 task:
 *                   $ref: '#/components/schemas/Task'
 */
router.patch("/:id", authenticateUser, restrictSuspendedUsers, updateTask);

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       204:
 *         description: Task deleted successfully
 */
router.delete("/:id", authenticateUser, restrictSuspendedUsers, deleteTask);

export default router;
