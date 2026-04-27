import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = process.env.UPLOAD_DIR || "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const uniq = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniq + path.extname(file.originalname));
  },
});

function fileFilter(_, file, cb) {
  const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
  cb(ok ? null : new Error("Tipo de archivo no permitido"), ok);
}

export const uploadAvatar = multer({ storage, fileFilter, limits: { files: 1, fileSize: 2 * 1024 * 1024 } });
export const uploadReportPhotos = multer({ storage, fileFilter, limits: { files: 3, fileSize: 4 * 1024 * 1024 } });
