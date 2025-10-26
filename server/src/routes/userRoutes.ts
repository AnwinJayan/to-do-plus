import express from "express";
import upload from "../middlewares/multerMiddleware.js";
import {
  getMyDetails,
  getUserById,
  updateProfileImage,
  setUnverifiedEmail,
  promoteVerifiedEmail,
  deleteUser,
  updateUsername,
  updatePassword,
} from "../controllers/userController.js";
import restrictSuspendedUsers from "../middlewares/restrictSuspendedUsers.js";

const router = express.Router();

/**
 * @openapi
 * /api/v1/users/me:
 *   get:
 *     summary: Get current user's details
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/me", getMyDetails);

/**
 * @openapi
 * /api/v1/users/profile/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-f\d]{24}$'
 *         description: The user ID. See userIdParamSchema in src/types/userTypes.ts
 *     responses:
 *       200:
 *         description: User details retrieved successfully
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/profile/:id", restrictSuspendedUsers, getUserById);

/**
 * @openapi
 * /api/v1/users:
 *   patch:
 *     summary: Update user profile image
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 oneOf:
 *                   - type: string
 *                     description: Set to "null" (as string) to remove the image
 *                   - type: string
 *                     format: binary
 *                     description: Profile image file
 *     responses:
 *       200:
 *         description: Profile image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  "/",
  upload.single("image"),
  restrictSuspendedUsers,
  updateProfileImage
);

/**
 * @openapi
 * /api/v1/users/set-unverified-email:
 *   post:
 *     summary: Cache an unverified email for the user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email cached or removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/set-unverified-email",
  restrictSuspendedUsers,
  setUnverifiedEmail
);

/**
 * @openapi
 * /api/v1/users/promote-verified-email:
 *   post:
 *     summary: Promote a verified email to primary
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Email reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Email not found in Clerk user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email is not verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/promote-verified-email",
  restrictSuspendedUsers,
  promoteVerifiedEmail
);

/**
 * @openapi
 * /api/v1/users/username:
 *   patch:
 *     summary: Update username
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Username updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       409:
 *         description: Username already taken
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/username", restrictSuspendedUsers, updateUsername);

/**
 * @openapi
 * /api/v1/users/password:
 *   patch:
 *     summary: Update or set user password
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 nullable: true
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated or set
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request (e.g. missing current password)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/password", restrictSuspendedUsers, updatePassword);

/**
 * @openapi
 * /api/v1/users:
 *   delete:
 *     summary: Delete user account
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Not authenticated
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
router.delete("/", restrictSuspendedUsers, deleteUser);

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID.
 *         username:
 *           type: string
 *           description: Username.
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: User role.
 *         isSuspended:
 *           type: boolean
 *           description: Whether the user is suspended.
 *         suspensionReason:
 *           type: string
 *           nullable: true
 *           description: Reason for suspension (if any).
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           description: Profile image URL (if any).
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *           nullable: true
 */

export default router;
