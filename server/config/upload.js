import multer from 'multer'

// Use memory storage — the route handles Cloudinary upload directly
// This avoids timing issues where CloudinaryStorage is created before
// cloudinary.config() runs in index.js
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|svg|webp/
  const ok = allowed.test(file.originalname.toLowerCase()) && allowed.test(file.mimetype)
  ok ? cb(null, true) : cb(new Error('هذا النوع من الملفات غير مسموح. يرجى رفع صور فقط (JPG, PNG, SVG, WEBP).'))
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
})
