import { Router } from 'express'
import crypto from 'crypto'
import CompanyOrder from '../models/CompanyOrder.js'
import LicenseKey from '../models/LicenseKey.js'
import { checkoutLimiter } from '../middleware/rateLimiter.js'

const router = Router()

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// ── Company Packages (server-side truth — prevents price manipulation) ──
export const COMPANY_PACKAGES = {
  starter: {
    key: 'starter',
    name: 'الباقة الأساسية',
    price: 99,
    cardLimit: 500,
    durationDays: 365,
    features: ['500 بطاقة سنوياً', 'هوية بصرية مخصصة', 'رفع جماعي CSV/Excel', 'لوحة تحكم كاملة'],
  },
  pro: {
    key: 'pro',
    name: 'الباقة الاحترافية',
    price: 199,
    cardLimit: 1500,
    durationDays: 365,
    features: ['1,500 بطاقة سنوياً', 'كل مزايا الأساسية', 'إحصائيات متقدمة', 'دعم ذو أولوية'],
  },
  enterprise: {
    key: 'enterprise',
    name: 'الباقة المؤسسية',
    price: 399,
    cardLimit: 5000,
    durationDays: 365,
    features: ['5,000 بطاقة سنوياً', 'كل مزايا الاحترافية', 'White Label كامل', 'مدير حساب مخصص'],
  },
}

// ── Helpers ──

async function getSarToEgpRate() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/SAR')
    const data = await res.json()
    return data?.rates?.EGP || 13.16
  } catch {
    return 13.16
  }
}

async function getPayMobAuthToken() {
  const res = await fetch('https://accept.paymob.com/api/auth/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
  })
  const data = await res.json()
  return data.token
}

export function generateLicenseCode() {
  const part = () => crypto.randomBytes(2).toString('hex').toUpperCase()
  return `SALL-${part()}-${part()}`
}

export function hashLicenseCode(code) {
  return crypto
    .createHash('sha256')
    .update(String(code || '').trim().toUpperCase())
    .digest('hex')
}

// ── Route: GET /packages ──
// Public endpoint — frontend fetches packages with prices
router.get('/packages', (req, res) => {
  res.json({ success: true, data: Object.values(COMPANY_PACKAGES) })
})

// ── Route: POST /initiate ──
// Creates a Paymob order for company package purchase
router.post('/initiate', checkoutLimiter, async (req, res) => {
  try {
    if (!PAYMOB_API_KEY || !PAYMOB_INTEGRATION_ID || !PAYMOB_IFRAME_ID) {
      return res.status(500).json({ success: false, error: 'بوابة الدفع غير مهيأة على الخادم' })
    }

    const { packageKey, companyName, companyEmail, companyPhone } = req.body

    const pkg = COMPANY_PACKAGES[packageKey]
    if (!pkg) {
      return res.status(400).json({ success: false, error: 'الباقة المحددة غير موجودة' })
    }
    if (!companyName?.trim() || !companyEmail?.trim() || !companyPhone?.trim()) {
      return res.status(400).json({ success: false, error: 'الاسم والبريد الإلكتروني ورقم الهاتف مطلوبة' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyEmail.trim())) {
      return res.status(400).json({ success: false, error: 'بريد إلكتروني غير صالح' })
    }

    const rate = await getSarToEgpRate()
    const amountEGP = Math.round(pkg.price * rate * 100) / 100
    const merchantOrderId = `co-${packageKey}-${Date.now()}`

    const authToken = await getPayMobAuthToken()
    if (!authToken) {
      return res.status(500).json({ success: false, error: 'فشل الاتصال ببوابة الدفع' })
    }

    const orderRes = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: Math.round(amountEGP * 100),
        currency: 'EGP',
        merchant_order_id: merchantOrderId,
        items: [],
      }),
    })
    const orderData = await orderRes.json()

    if (!orderData?.id) {
      console.error('Paymob order creation failed:', orderData)
      return res.status(500).json({ success: false, error: 'فشل إنشاء الطلب لدى مزود الدفع' })
    }

    const keyRes = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: Math.round(amountEGP * 100),
        expiration: 3600,
        order_id: orderData.id,
        billing_data: {
          first_name: companyName.trim().split(' ')[0] || 'Company',
          last_name: companyName.trim().split(' ').slice(1).join(' ') || '-',
          email: companyEmail.trim().toLowerCase(),
          phone_number: companyPhone.trim(),
          apartment: 'NA', floor: 'NA', street: 'NA', building: 'NA',
          shipping_method: 'NA', postal_code: '00000',
          city: 'Riyadh', country: 'SA', state: 'Riyadh',
        },
        currency: 'EGP',
        integration_id: parseInt(PAYMOB_INTEGRATION_ID, 10),
      }),
    })
    const keyData = await keyRes.json()

    if (!keyData?.token) {
      console.error('Paymob payment key creation failed:', keyData)
      return res.status(500).json({ success: false, error: 'فشل إنشاء مفتاح الدفع' })
    }

    const companyOrder = await CompanyOrder.create({
      paymobOrderId: String(orderData.id),
      merchantOrderId,
      packageKey,
      packageSnapshot: {
        name: pkg.name,
        price: pkg.price,
        cardLimit: pkg.cardLimit,
        durationDays: pkg.durationDays,
      },
      companyName: companyName.trim(),
      companyEmail: companyEmail.trim().toLowerCase(),
      companyPhone: companyPhone.trim(),
      amount: pkg.price,
      amountEGP,
      exchangeRate: rate,
    })

    console.log(`[CompanyCheckout] Order created: ${companyOrder._id} | ${merchantOrderId} | ${pkg.name}`)

    res.json({
      success: true,
      iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${keyData.token}`,
      paymobOrderId: String(orderData.id),
    })
  } catch (error) {
    console.error('Company checkout initiate error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء تجهيز عملية الدفع' })
  }
})

// ── Route: GET /status ──
// Poll after payment to get license code
router.get('/status', async (req, res) => {
  try {
    const { paymobOrderId } = req.query
    if (!paymobOrderId) {
      return res.status(400).json({ success: false, error: 'paymobOrderId مطلوب' })
    }

    const order = await CompanyOrder.findOne({ paymobOrderId: String(paymobOrderId) })
    if (!order) {
      return res.status(404).json({ success: false, error: 'الطلب غير موجود' })
    }

    res.json({
      success: true,
      data: {
        status: order.status,
        licenseCode: order.status === 'completed' ? order.licenseCode : null,
        companyEmail: order.companyEmail,
        packageName: order.packageSnapshot?.name,
        cardLimit: order.packageSnapshot?.cardLimit,
      },
    })
  } catch (error) {
    console.error('Company checkout status error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في التحقق من حالة الطلب' })
  }
})

export default router
