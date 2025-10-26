export interface ImageMeta {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export interface IuploadService {
  uploadImage(image: ImageMeta): Promise<string>; // returns URL or path
  deleteImage?(url: string): Promise<void>;
}
