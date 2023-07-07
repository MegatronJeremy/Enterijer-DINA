import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/");
  },
  filename: function (_req, file, cb) {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

// File filter to accept only JPEG and PNG images
const fileFilter = function (_req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(
      new Error("Neispravan format fajla. Prihvatljivi formati su JPG i PNG."),
      false
    );
  }
};

// Configure Multer upload
const upload = multer({ storage, fileFilter });
export default upload;
