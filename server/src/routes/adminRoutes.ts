import { Router } from "express";
import {
  getAllUsers,
  deleteUserById,
  deleteAllUsers,
  getUserById,
  suspendUserById,
  unsuspendUserById,
  makeUserAdminById,
  revokeUserAdminById,
} from "../controllers/adminController.js";
import { requireAdmin } from "../middlewares/requireAdmin.js";

const router = Router();

router.use(requireAdmin);

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Admin
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *     x-entity:
 *       model: User (see src/models/User.ts)
 *       type: IUser (see src/models/User.ts)
 */
router.get("/users", getAllUsers);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID. See userIdParamSchema in src/types/userTypes.ts
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *     x-entity:
 *       model: User (see src/models/User.ts)
 *       type: IUser (see src/models/User.ts)
 */
router.get("/users/:id", getUserById);

/**
 * @openapi
 * /api/admin/users/{id}/suspend:
 *   post:
 *     summary: Suspend a user by ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID. See userIdParamSchema in src/types/userTypes.ts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SuspensionRequest'
 *     responses:
 *       200:
 *         description: User suspended
 *       404:
 *         description: User not found
 *     x-entity:
 *       model: User (see src/models/User.ts)
 *       type: IUser (see src/models/User.ts)
 *       requestSchema: suspensionRequestSchema (see src/types/adminTypes.ts)
 */
router.post("/users/:id/suspend", suspendUserById);

/**
 * @openapi
 * /api/admin/users/{id}/unsuspend:
 *   post:
 *     summary: Unsuspend a user by ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID. See userIdParamSchema in src/types/userTypes.ts
 *     responses:
 *       200:
 *         description: User unsuspended
 *       404:
 *         description: User not found
 *     x-entity:
 *       model: User (see src/models/User.ts)
 *       type: IUser (see src/models/User.ts)
 */
router.post("/users/:id/unsuspend", unsuspendUserById);

/**
 * @openapi
 * /api/admin/users/{id}/make-admin:
 *   post:
 *     summary: Make a user an admin by ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID. See userIdParamSchema in src/types/userTypes.ts
 *     responses:
 *       200:
 *         description: User made admin successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *       403:
 *         description: Cannot make yourself admin via this endpoint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/users/:id/make-admin", makeUserAdminById);

/**
 * @openapi
 * /api/admin/users/{id}/revoke-admin:
 *   post:
 *     summary: Revoke admin privileges from a user by ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID. See userIdParamSchema in src/types/userTypes.ts
 *     responses:
 *       200:
 *         description: User admin privileges revoked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *       400:
 *         description: User is not an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Cannot revoke your own admin privileges via this endpoint
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/users/:id/revoke-admin", revokeUserAdminById);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a single user by ID
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID. See userIdParamSchema in src/types/userTypes.ts
 *     responses:
 *       204:
 *         description: User deleted
 *       404:
 *         description: User not found
 *     x-entity:
 *       model: User (see src/models/User.ts)
 *       type: IUser (see src/models/User.ts)
 */
router.delete("/users/:id", deleteUserById);

/**
 * @openapi
 * /api/admin/users:
 *   delete:
 *     summary: Delete all users
 *     tags:
 *       - Admin
 *     responses:
 *       204:
 *         description: All users deleted
 *     x-entity:
 *       model: User (see src/models/User.ts)
 *       type: IUser (see src/models/User.ts)
 */
router.delete("/users", deleteAllUsers);

/**
 * @openapi
 * /api/admin/bags:
 *   delete:
 *     summary: Delete all bags (admin)
 *     tags:
 *       - Admin
 *     responses:
 *       204:
 *         description: All bags deleted
 *     x-entity:
 *       model: Bag (see src/models/Bag.ts)
 *       type: IBag (see src/models/Bag.ts)
 */
// ...existing code...

/**
 * @openapi
 * components:
 *   schemas:
 *     SuspensionRequest:
 *       type: object
 *       required:
 *         - reason
 *       properties:
 *         reason:
 *           type: string
 *           description: Reason for suspension.
 */

export default router;
