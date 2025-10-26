import { Router } from "express";
import upload from "../middlewares/multerMiddleware.js";
import { uploadImage } from "../controllers/uploadController.js";

const router = Router();

/**
 * @openapi
 * /api/v1/upload/image:
 *   post:
 *     summary: Upload an image file (standalone)
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL of the uploaded image
 *       400:
 *         description: No file uploaded or invalid file type.
 *     x-entity:
 *       requestSchema: multerMiddleware (see src/middlewares/multerMiddleware.ts)
 *       service: uploadImage (see src/controllers/uploadController.ts)
 */
router.post("/image", upload.single("image"), uploadImage);

/**
 * @openapi
 * /api/v1/upload/images:
 *   post:
 *     summary: Upload multiple image files
 *     tags:
 *       - Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   description: Image file to upload
 *     responses:
 *       200:
 *         description: Images uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 imageUrls:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: URL of the uploaded image
 *       400:
 *         description: No files uploaded or invalid file types.
 *     x-entity:
 *       requestSchema: multerMiddleware (see src/middlewares/multerMiddleware.ts)
 *       service: uploadImage (see src/controllers/uploadController.ts)
 */
router.post("/images", upload.array("images"), uploadImage);

export default router;
