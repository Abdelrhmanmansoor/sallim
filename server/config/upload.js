import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'

// Cloudinary storage — uploads directly to CDN, no local disk fallback
// Cloudinary v2 must be configured in index.js before this is used at request time
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isLogo = file.fieldname === 'logo' || req.originalUrl.includes('company')
    return {
      folder: isLogo ? 'sallim/company-logos' : 'sallim/templates',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: isLogo
        ? [{ quality: 'auto:best', width: 400, crop: 'limit' }]
        : [{ quality: 'auto:good' }],
      public_id: `${isLogo ? 'company' : 'template'}-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    }
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|svg|webp/
  const ok = allowed.test(file.originalname.toLowerCase()) && allowed.test(file.mimetype)
  ok ? cb(null, true) : cb(new Error('هذا النوع من الملفات غير مسموح. يرجى رفع صور فقط (JPG, PNG, SVG, WEBP).'))
}

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
})
