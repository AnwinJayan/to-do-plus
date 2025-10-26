import { ImageMeta, IuploadService } from "../types/imageTypes.js";

import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export class LocalUploadService implements IuploadService {
  async uploadImage(image: ImageMeta): Promise<string> {
    const uploadsDir = path.join(process.cwd(), "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(image.originalname);
    const filename = `${uuidv4()}${ext}`;
    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, image.buffer);
    return `/uploads/${filename}`;
  }
}
