import { Router } from 'express'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { nanoid } from 'nanoid'
import CompanyOrder from '../models/CompanyOrder.js'
import LicenseKey from '../models/LicenseKey.js'
import Company from '../models/Company.js'
import { checkoutLimiter } from '../middleware/rateLimiter.js'
import { createPaymentIntention, getIntentionStatus } from '../utils/paymob-flash.js'

const router = Router()

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'
const JWT_SECRET = process.env.JWT_SECRET

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

// Map packageKey → subscription plan
function packageToSubscriptionPlan(packageKey) {
  if (packageKey === 'enterprise') return 'enterprise'
  if (packageKey === 'pro') return 'pro'
  return 'basic'
}

// ── Route: GET /packages ──
router.get('/packages', (_req, res) => {
  res.json({ success: true, data: Object.values(COMPANY_PACKAGES) })
})

// ── Route: POST /initiate ──
// Creates a Paymob Flash payment intention for a company package
router.post('/initiate', checkoutLimiter, async (req, res) => {
  try {
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
    const amountCents = Math.round(amountEGP * 100)
    const merchantOrderId = `co-${packageKey}-${Date.now()}`

    // Create order record first
    const companyOrder = await CompanyOrder.create({
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

    // Create Paymob Flash intention
    const nameParts = companyName.trim().split(' ')
    const firstName = nameParts[0] || 'Company'
    const lastName = nameParts.slice(1).join(' ') || 'N/A'

    const intention = await createPaymentIntention({
      amount: amountCents,
      currency: 'EGP',
      customer: {
        first_name: firstName,
        last_name: lastName,
        email: companyEmail.trim().toLowerCase(),
        phone: companyPhone.trim().replace(/[\s\-()]/g, '').replace(/^00/, '+'),
      },
      extras: {
        merchant_order_id: merchantOrderId,
        notification_url: `${BACKEND_URL}/api/v1/paymob-flash/callback`,
        redirection_url: `${CLIENT_URL}/company-checkout?status=success&merchant_order_id=${encodeURIComponent(merchantOrderId)}`,
      },
    })

    // Store intention ID
    companyOrder.intentionId = intention.intention_id || ''
    await companyOrder.save()

    console.log(`[CompanyCheckout] Order created: ${companyOrder._id} | ${merchantOrderId} | ${pkg.name}`)

    res.json({
      success: true,
      paymentUrl: intention.payment_url,
      merchantOrderId,
    })
  } catch (error) {
    console.error('Company checkout initiate error:', error)
    res.status(500).json({ success: false, error: error.message || 'حدث خطأ أثناء تجهيز عملية الدفع' })
  }
})

// ── Route: POST /complete ──
// Called after payment redirect — verifies payment, creates company account, returns JWT
router.post('/complete', async (req, res) => {
  try {
    const { merchantOrderId } = req.body
    if (!merchantOrderId) {
      return res.status(400).json({ success: false, error: 'merchantOrderId مطلوب' })
    }

    const order = await CompanyOrder.findOne({ merchantOrderId })
    if (!order) {
      return res.status(404).json({ success: false, error: 'الطلب غير موجود' })
    }

    // Idempotent: if company was already created, return existing token
    if (order.companyId) {
      const company = await Company.findById(order.companyId)
      if (company) {
        const token = jwt.sign({ id: company._id, role: company.role }, JWT_SECRET, { expiresIn: '30d' })
        return res.json({
          success: true,
          token,
          company: buildCompanyPayload(company),
        })
      }
    }

    // If not yet completed, verify with Paymob
    if (order.status !== 'completed') {
      if (!order.intentionId) {
        return res.status(402).json({ success: false, error: 'لم يتم الدفع بعد' })
      }
      try {
        const intentionResult = await getIntentionStatus(order.intentionId)
        const d = intentionResult?.data || {}
        const SUCCESS_WORDS = ['success', 'succeeded', 'paid', 'completed', 'captured', 'approved']
        const statusText = String(d.status || d.payment_status || d.state || d.intention_status || '').toLowerCase()
        const txBuckets = [d.transactions, d.payments, d.payment_attempts, d.intention_detail?.transactions].filter(Array.isArray)
        const allTx = txBuckets.flat().filter(Boolean)
        const isPaid =
          d.is_paid === true ||
          d.paid === true ||
          SUCCESS_WORDS.some((w) => statusText.includes(w)) ||
          allTx.some((t) => t.success === true || t.paid === true)

        if (!isPaid) {
          return res.status(402).json({ success: false, error: 'لم يتم تأكيد الدفع بعد' })
        }
        order.status = 'completed'
        await order.save()
      } catch (e) {
        console.error('[CompanyCheckout] Paymob verification error:', e.message)
        return res.status(402).json({ success: false, error: 'فشل التحقق من الدفع' })
      }
    }

    // Generate license code + create LicenseKey
    const licenseCode = generateLicenseCode()
    const codeHash = hashLicenseCode(licenseCode)
    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    const license = await LicenseKey.create({
      codeHash,
      status: 'activated',
      maxRecipients: order.packageSnapshot?.cardLimit || 500,
      activatedAt: now,
      note: `auto-created for company order ${order.merchantOrderId}`,
    })

    // Create Company account
    const slug = nanoid(10).toLowerCase()
    const password = crypto.randomBytes(12).toString('base64url')

    const company = await Company.create({
      name: order.companyName,
      email: order.companyEmail,
      password,
      slug,
      cardsLimit: order.packageSnapshot?.cardLimit || 500,
      cardsUsed: 0,
      status: 'active',
      subscription: {
        plan: packageToSubscriptionPlan(order.packageKey),
        startDate: now,
        renewalDate: expiresAt,
        expiresAt,
        isActive: true,
        limits: {
          cardsPerMonth: order.packageSnapshot?.cardLimit || 500,
          teamMembers: order.packageKey === 'enterprise' ? 20 : order.packageKey === 'pro' ? 10 : 3,
          campaignsPerMonth: 999,
        },
      },
      usage: { cardsThisMonth: 0, campaignsThisMonth: 0, lastReset: now },
      stats: { views: 0, downloads: 0 },
    })

    // Update order
    order.licenseCode = licenseCode
    order.licenseKeyId = license._id
    order.companyId = company._id
    await order.save()

    // Mark license as used
    license.activatedIp = req.ip || ''
    license.activatedUserAgent = req.headers['user-agent'] || ''
    await license.save()

    console.log(`[CompanyCheckout] Company created: ${company._id} | ${order.packageKey} | ${order.companyEmail}`)

    const token = jwt.sign({ id: company._id, role: company.role }, JWT_SECRET, { expiresIn: '30d' })

    res.json({
      success: true,
      token,
      password, // returned once so user can note it
      company: buildCompanyPayload(company),
    })
  } catch (error) {
    console.error('Company checkout complete error:', error)
    // Duplicate email check
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(409).json({ success: false, error: 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول.' })
    }
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء إنشاء الحساب' })
  }
})

function buildCompanyPayload(company) {
  return {
    id: company._id,
    name: company.name,
    email: company.email,
    slug: company.slug,
    logoUrl: company.logoUrl || '',
    primaryColor: company.primaryColor || '#7c3aed',
    brandColors: company.brandColors,
    allowedFonts: company.allowedFonts || [],
    isActive: company.isActive !== false,
    cardsLimit: company.cardsLimit,
    cardsUsed: company.cardsUsed,
    features: company.features,
    subscriptionActive: company.subscription?.isActive,
    subscriptionPlan: company.subscription?.plan,
    link: `${CLIENT_URL}/c/${company.slug}?utm=company`,
  }
}

// ── Route: GET /status ──
// Legacy poll endpoint (kept for compatibility)
router.get('/status', async (req, res) => {
  try {
    const { paymobOrderId, merchantOrderId } = req.query
    if (!paymobOrderId && !merchantOrderId) {
      return res.status(400).json({ success: false, error: 'معرّف الطلب مطلوب' })
    }

    const query = paymobOrderId
      ? { paymobOrderId: String(paymobOrderId) }
      : { merchantOrderId: String(merchantOrderId) }

    const order = await CompanyOrder.findOne(query)
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
        companyCreated: !!order.companyId,
      },
    })
  } catch (error) {
    console.error('Company checkout status error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في التحقق من حالة الطلب' })
  }
})

export default router
