import { Request, Response, NextFunction } from "express";
import { LocalUploadService } from "../services/localUploadService.js";
import { CloudinaryUploadService } from "../services/cloudinaryUploadService.js";
import Errors from "../utils/AppError.js";

const imageService = new LocalUploadService();
const cloudinaryService = new CloudinaryUploadService();

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    throw new Errors.BadRequestError("No file uploaded");
  }
  const url = await cloudinaryService.uploadImage({
    buffer: req.file.buffer,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
  });

  req.body.imageUrl = url;

  next();
};
