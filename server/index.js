import 'dotenv/config'
import dotenv from 'dotenv'

// Load environment variables from .env.local if it exists
dotenv.config({ path: '.env.local' })
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import cloudinary from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import connectDB from './config/db.js'
import cardRoutes from './routes/cards.js'
import statsRoutes from './routes/stats.js'
import adminRoutes from './routes/admin.js'
import companyRoutes from './routes/company.js'
import templateRoutes from './routes/templates.js'
import blogRoutes from './routes/blog.js'
import ticketRoutes from './routes/tickets.js'
import diwanRoutes from './routes/diwan.js'
import diwaniyaRoutes from './routes/diwaniya.js'
import authRoutes from './routes/auth.js'
import diwaniyaFamilyRoutes from './routes/diwaniya-family.js'
import walletRoutes from './routes/wallet.js'
import adminInviteCodesRoutes from './routes/admin-invite-codes.js'
import adminCompaniesRoutes from './routes/admin-companies.js'
import campaignsRoutes from './routes/campaigns.js'
import teamRoutes from './routes/team.js'
import gamesRoutes from './routes/games.js'
import path from 'path'
import { fileURLToPath } from 'url'

// For ES modules __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ═══════════════════════════════════════════
// سَلِّم Sallim — Production Backend
// ═══════════════════════════════════════════

const app = express()
const PORT = process.env.PORT || 3001
const isProd = process.env.NODE_ENV === 'production'

// ─── Connect to MongoDB ───
await connectDB()

// ─── Security Middleware ───
// Helmet: Sets security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// CORS: Only allow our frontend
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://sallim.org',
  'https://sallim.com',
  'https://www.sallim.co',
  'https://sallim-gamma.vercel.app',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
].filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(o =>
      origin === o || origin.startsWith(o) ||
      (origin.includes('sallim') || origin.includes('localhost'))
    );

    if (isAllowed) {
      callback(null, true)
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Admin-Key'],
};

app.use(cors(corsOptions))

// Handle preflight requests explicitly
app.options('*', cors(corsOptions))

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'طلبات كثيرة جداً. حاول بعد شوي.' },
})
app.use('/api/', limiter)

// Stricter rate limit for card creation: 20 per 15 min
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'وصلت الحد الأقصى لإنشاء البطاقات. حاول بعد شوي.' },
})

// Body parsing with size limit
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: false, limit: '5mb' }))

// Sanitize MongoDB queries (prevent NoSQL injection)
app.use(mongoSanitize())

// Serve Uploads folder as Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Trust proxy (for Render / reverse proxies)
app.set('trust proxy', 1)

// ─── Cloudinary Configuration ───
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// ─── Image Upload Configuration (Cloudinary) ───
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sallim/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 200, height: 200, crop: 'fill', quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    public_id: (req, file) => `avatar-${Date.now()}-${Math.round(Math.random() * 1E9)}`
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB limit
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return cb(new Error('Only image files are allowed'))
    }
    cb(null, true)
  }
})

// ─── Image Upload Endpoint ───
app.post('/api/v1/upload/avatar', (req, res) => {
  upload.single('avatar')(req, res, function (err) {
    if (err) {
      console.error('Multer/Cloudinary error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Upload failed due to server configuration.' });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'لم يتم رفع أي صورة' });
      }

      // Cloudinary stores the URL in req.file.path
      res.json({
        success: true,
        data: {
          url: req.file.path, // Cloudinary URL
          publicId: req.file.filename, // Cloudinary public ID
          filename: req.file.originalname
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ success: false, error: 'Upload failed' });
    }
  });
})

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: isProd ? 'production' : 'development',
    timestamp: new Date().toISOString(),
  })
})

// ─── API Routes ───
app.use('/api/v1/cards', createLimiter, cardRoutes)
app.use('/api/v1/stats', statsRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/admin/invite-codes', adminInviteCodesRoutes)
app.use('/api/v1/admin/companies', adminCompaniesRoutes)
app.use('/api/v1/company', companyRoutes)
app.use('/api/v1/company/wallet', walletRoutes)
app.use('/api/v1/company/campaigns', campaignsRoutes)
app.use('/api/v1/company/team', teamRoutes)
app.use('/api/v1/templates', templateRoutes)
app.use('/api/v1/blog', blogRoutes)
app.use('/api/v1/tickets', ticketRoutes)
app.use('/api/v1/diwan', diwanRoutes)
app.use('/api/v1/diwaniya', diwaniyaRoutes)
app.use('/api/v1/diwaniya', diwaniyaFamilyRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/games', gamesRoutes)

// ─── 404 Handler ───
app.use('/api/*', (req, res) => {
  console.log(`404 Check: [${req.method}] ${req.originalUrl}`);
  res.status(404).json({ success: false, error: 'Endpoint not found' })
})

// ─── Global Error Handler ───
app.use((err, req, res, next) => {
  console.error('Server error:', err)

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, error: 'CORS not allowed' })
  }

  res.status(err.status || 500).json({
    success: false,
    error: isProd ? 'حدث خطأ في السيرفر' : err.message,
  })
})

// ─── Start Server ───
app.listen(PORT, () => {
  console.log(`Sallim API running on port ${PORT} [${isProd ? 'production' : 'development'}]`)
})