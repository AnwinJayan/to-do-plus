import { Router } from "express";
import {
  createList,
  createListWithAI,
  getUserLists,
  getListById,
  updateList,
  deleteList,
  deleteAllLists,
} from "../controllers/listController";
// import { createListSchema, updateListSchema } from "../types/listTypes";
// import { validate } from "../middlewares/validate";
import authenticateUser from "../middlewares/authenticateUser";
import restrictSuspendedUsers from "../middlewares/restrictSuspendedUsers";

const router = Router();

/**
 * @openapi
 * /lists:
 *   post:
 *     summary: Create a new list
 *     tags:
 *       - Lists
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateListInput'
 *     responses:
 *       201:
 *         description: List created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: List created successfully
 *                 list:
 *                   $ref: '#/components/schemas/List'
 */
router.post("/", authenticateUser, restrictSuspendedUsers, createList);

/**
 * @openapi
 * /lists/ai:
 *   post:
 *     summary: Create a new list using AI
 *     tags:
 *       - Lists
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *     responses:
 *       201:
 *         description: AI-generated list created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: AI-generated list created successfully
 *                 list:
 *                   $ref: '#/components/schemas/List'
 */
router.post("/ai", authenticateUser, restrictSuspendedUsers, createListWithAI);

/**
 * @openapi
 * /lists:
 *   get:
 *     summary: Get all lists for the authenticated user
 *     tags:
 *       - Lists
 *     parameters:
 *       - in: query
 *         name: isFavorited
 *         schema:
 *           type: boolean
 *         description: Filter by favorited lists
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by list title
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort by fields (e.g. created_at,-title)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Page size
 *     responses:
 *       200:
 *         description: Lists retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lists retrieved successfully
 *                 lists:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/List'
 */
router.get("/", authenticateUser, restrictSuspendedUsers, getUserLists);

/**
 * @openapi
 * /lists/{id}:
 *   get:
 *     summary: Get a list by ID
 *     tags:
 *       - Lists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: List ID
 *     responses:
 *       200:
 *         description: List retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: List retrieved successfully
 *                 list:
 *                   $ref: '#/components/schemas/List'
 */
router.get("/:id", authenticateUser, restrictSuspendedUsers, getListById);

/**
 * @openapi
 * /lists/{id}:
 *   patch:
 *     summary: Update a list by ID
 *     tags:
 *       - Lists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: List ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateListInput'
 *     responses:
 *       200:
 *         description: List updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: List updated successfully
 *                 list:
 *                   $ref: '#/components/schemas/List'
 */
router.patch("/:id", authenticateUser, restrictSuspendedUsers, updateList);

/**
 * @openapi
 * /lists/{id}:
 *   delete:
 *     summary: Delete a list by ID
 *     tags:
 *       - Lists
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: List ID
 *     responses:
 *       204:
 *         description: List deleted successfully
 */
router.delete("/:id", authenticateUser, restrictSuspendedUsers, deleteList);

/**
 * @openapi
 * /lists:
 *   delete:
 *     summary: Delete all lists for the authenticated user
 *     tags:
 *       - Lists
 *     responses:
 *       204:
 *         description: All lists deleted successfully
 */
router.delete("/", authenticateUser, restrictSuspendedUsers, deleteAllLists);

export default router;
