import rateLimit from 'express-rate-limit'

/**
 * Rate limiter for authentication endpoints
 * Prevents brute force attacks on login and license activation
 *
 * Limit: 20 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                  // limit each IP to 20 requests per windowMs
  standardHeaders: true,    // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,     // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'عدد المحاولات كبير جداً، حاول مرة أخرى بعد 15 دقيقة'
  }
})

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'عدد محاولات تسجيل الدخول كبير. حاول لاحقاً.'
  }
})

export const activationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'محاولات التفعيل متكررة، حاول لاحقاً.'
  }
})

export const employeeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'محاولات متكررة، حاول بعد قليل.'
  }
})

// Prevents spamming payment initiation endpoints (Paymob order creation)
export const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'تم تجاوز الحد المسموح به لطلبات الدفع، حاول بعد 15 دقيقة.'
  }
})

// Prevents stat manipulation via rapid /increment calls
export const statsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'محاولات متكررة جداً.'
  }
})

