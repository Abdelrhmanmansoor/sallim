import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import connectDB from './config/db.js'
import cardRoutes from './routes/cards.js'
import statsRoutes from './routes/stats.js'

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
  'http://localhost:5173',
  'http://localhost:4173',
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

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
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false }))

// Sanitize MongoDB queries (prevent NoSQL injection)
app.use(mongoSanitize())

// Trust proxy (for Render / reverse proxies)
app.set('trust proxy', 1)

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

// ─── 404 Handler ───
app.use('/api/*', (req, res) => {
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
