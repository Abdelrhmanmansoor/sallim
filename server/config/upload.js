import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

// Needed to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ─── Ensure directories exist ───
const uploadDir = path.join(__dirname, '../../uploads')
const companiesDir = path.join(__dirname, '../../uploads/companies')
const templatesDir = path.join(__dirname, '../../uploads/templates')

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })
if (!fs.existsSync(companiesDir)) fs.mkdirSync(companiesDir, { recursive: true })
if (!fs.existsSync(templatesDir)) fs.mkdirSync(templatesDir, { recursive: true })

// ─── Configure Storage ───
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determine folder by field handle or original URL
        if (file.fieldname === 'logo' || req.originalUrl.includes('company')) {
            cb(null, companiesDir)
        } else {
            cb(null, templatesDir)
        }
    },
    filename: (req, file, cb) => {
        // Generate unique name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
        const ext = path.extname(file.originalname).toLowerCase()

        // Prefix based on the request
        const prefix = file.fieldname === 'logo' ? 'company-' : 'template-'

        cb(null, prefix + uniqueSuffix + ext)
    }
})

// ─── File Filter (Security) ───
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|svg|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (extname && mimetype) {
        return cb(null, true)
    }

    cb(new Error('هذا النوع من الملفات غير مسموح. يرجى رفع صور فقط (JPG, PNG, SVG, WEBP).'))
}

// ─── Initialize Multer ───
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB max
    },
    fileFilter: fileFilter
})
