import { LocalUploadService } from "../services/localUploadService.js";
import { CloudinaryUploadService } from "../services/cloudinaryUploadService.js";
import Errors from "../utils/AppError.js";

const localService = new LocalUploadService();
const cloudinaryService = new CloudinaryUploadService();

type UploadImageParams = {
  file: Express.Multer.File;
  provider?: "local" | "cloudinary";
};

export async function uploadImage({
  file,
  provider = "cloudinary",
}: UploadImageParams): Promise<string> {
  if (!file) {
    throw new Errors.BadRequestError("No file provided");
  }

  const { buffer, originalname, mimetype } = file;

  if (provider === "cloudinary") {
    return cloudinaryService.uploadImage({ buffer, originalname, mimetype });
  } else {
    return localService.uploadImage({ buffer, originalname, mimetype });
  }
}

type DeleteImageParams = {
  url: string;
  provider?: "local" | "cloudinary";
};

export async function deleteImage({
  url,
  provider = "cloudinary",
}: DeleteImageParams): Promise<void> {
  if (!url) {
    throw new Errors.BadRequestError("No image URL provided");
  }

  if (provider === "cloudinary") {
    await cloudinaryService.deleteImage(url);
  } else {
    // Remove leading slash if present
    const filePath = url.startsWith("/") ? url.slice(1) : url;
    const fs = await import("fs/promises");
    try {
      await fs.unlink(filePath);
    } catch (err: any) {
      if (err.code !== "ENOENT") throw err; // Ignore if file doesn't exist
    }
  }
}
