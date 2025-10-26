import { v4 as uuidv4 } from "uuid";
import path from "path";
import { ImageMeta, IuploadService } from "../types/imageTypes.js";
import config from "../config/index.js";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export class CloudinaryUploadService implements IuploadService {
  async uploadImage(image: ImageMeta): Promise<string> {
    // Convert buffer to base64 string
    const base64 = image.buffer.toString("base64");
    const dataUri = `data:${image.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "uploads/WebAppImgs",
      public_id: path.parse(image.originalname).name + "-" + uuidv4(),
      resource_type: "image",
    });

    return result.secure_url;
  }

  async deleteImage(url: string): Promise<void> {
    // Extract public_id from URL if needed
    const publicId = url.split("/").slice(-1)[0].split(".")[0];
    await cloudinary.uploader.destroy(`uploads/webAppImgs/${publicId}`);
  }
}
