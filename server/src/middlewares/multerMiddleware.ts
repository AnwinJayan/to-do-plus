import multer from "multer";

const storage = multer.memoryStorage(); // or diskStorage, or custom
const upload = multer({ storage });

export default upload;
