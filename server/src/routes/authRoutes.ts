import { Router } from "express";
import { testAuth } from "../controllers/authController.js";
import authenticateUser from "../middlewares/authenticateUser.js";

const router = Router();

/**
 * @openapi
 * /api/v1/auth/test:
 *   get:
 *     summary: Test authentication
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Not authenticated
 */
router.get("/test", authenticateUser, testAuth);

export default router;
