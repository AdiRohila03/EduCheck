import multer from "multer";

const storage = multer.memoryStorage(); // Store files in memory before saving to DB
const upload = multer({ storage });

export { upload };