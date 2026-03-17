import express from 'express'
import crypto from 'crypto'
import Analytics from '../models/Analytics.js'
import Card from '../models/Card.js'
import CheckoutSession from '../models/CheckoutSession.js'
import CompanyOrder from '../models/CompanyOrder.js'
import LicenseKey from '../models/LicenseKey.js'
import { generateLicenseCode, hashLicenseCode } from './company-checkout.js'
import { checkoutLimiter } from '../middleware/rateLimiter.js'

const router = express.Router()

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// Live exchange rates — cached for 5 minutes, ALL currencies from SAR
let cachedRates = null
let cacheTimestamp = 0
const CACHE_TTL = 5 * 60 * 1000

async function getExchangeRates() {
  if (cachedRates && Date.now() - cacheTimestamp < CACHE_TTL) {
    return cachedRates
  }
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/SAR')
    const data = await res.json()
    if (data?.result === 'success' && data.rates) {
      cachedRates = data.rates
      cacheTimestamp = Date.now()
      console.log('[Exchange] Rates updated, EGP:', cachedRates.EGP)
      return cachedRates
    }
  } catch (err) {
    console.error('[Exchange] Failed to fetch rates:', err.message)
  }
  if (cachedRates) return cachedRates
  return { EGP: 13.16, USD: 0.2667, SAR: 1 }
}

async function getSarToEgpRate() {
  const rates = await getExchangeRates()
  return rates.EGP || 13.16
}

async function convertSarToEgp(amountSAR) {
  const rate = await getSarToEgpRate()
  return { amountEGP: Math.round(amountSAR * rate * 100) / 100, rate }
}

// Country → Currency mapping
const COUNTRY_CURRENCY = {
  SA: 'SAR', AE: 'AED', KW: 'KWD', BH: 'BHD', OM: 'OMR', QA: 'QAR',
  EG: 'EGP', JO: 'JOD', LB: 'LBP', IQ: 'IQD', SY: 'SYP', YE: 'YER',
  PS: 'ILS', MA: 'MAD', TN: 'TND', DZ: 'DZD', LY: 'LYD', SD: 'SDG',
  US: 'USD', GB: 'GBP', CA: 'CAD', AU: 'AUD', NZ: 'NZD',
  TR: 'TRY', IN: 'INR', PK: 'PKR', BD: 'BDT',
  MY: 'MYR', ID: 'IDR', PH: 'PHP', NG: 'NGN',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR',
  AT: 'EUR', PT: 'EUR', GR: 'EUR', IE: 'EUR', FI: 'EUR',
  JP: 'JPY', CN: 'CNY', KR: 'KRW', TH: 'THB', SG: 'SGD', HK: 'HKD',
  BR: 'BRL', MX: 'MXN', ZA: 'ZAR', SE: 'SEK', NO: 'NOK', DK: 'DKK',
  CH: 'CHF', PL: 'PLN', RU: 'RUB',
}

function detectCountryFromRequest(req) {
  const h = req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || req.headers['x-country-code'] || ''
  return (h && h !== 'XX') ? h.toUpperCase() : null
}

async function getPayMobAuthToken() {
  const response = await fetch('https://accept.paymob.com/api/auth/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
  })

  const data = await response.json()
  return data.token
}

async function createPayMobOrder(authToken, amountEGP, merchantOrderId) {
  const response = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: Math.round(amountEGP * 100),
      currency: 'EGP',
      merchant_order_id: merchantOrderId,
      items: [],
    }),
  })

  return response.json()
}

async function createPaymentKey(authToken, orderId, amountEGP, billingData) {
  const response = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: Math.round(amountEGP * 100),
      expiration: 3600,
      order_id: orderId,
      billing_data: billingData,
      currency: 'EGP',
      integration_id: parseInt(PAYMOB_INTEGRATION_ID, 10),
    }),
  })

  return response.json()
}

function verifyHMAC(data, receivedHmac) {
  const concatenated = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('')

  const calculatedHmac = crypto
    .createHmac('sha512', PAYMOB_HMAC_SECRET)
    .update(concatenated)
    .digest('hex')

  return calculatedHmac === receivedHmac
}

function buildCheckoutRedirect(status, params = {}) {
  const search = new URLSearchParams({ status, ...params })
  return `${CLIENT_URL}/checkout?${search.toString()}`
}

async function emitPurchaseActivity(io, session, analyticsEntry) {
  if (!io) return

  io.emit('live_activity', {
    type: 'purchase',
    userId: session.userId || null,
    cardName: analyticsEntry.cardName,
    amount: session.amount,
    time: new Date().toISOString(),
  })
}

router.post('/initiate', checkoutLimiter, async (req, res) => {
  try {
    if (!PAYMOB_API_KEY || !PAYMOB_INTEGRATION_ID || !PAYMOB_IFRAME_ID) {
      return res.status(500).json({
        success: false,
        message: 'بوابة الدفع غير مهيأة على الخادم',
      })
    }

    const {
      cardId,
      customerName,
      customerPhone,
      customerEmail = '',
      sessionId,
    } = req.body

    if (!cardId || !customerName || !customerPhone || !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'بيانات الطلب غير مكتملة',
      })
    }

    const card = await Card.findById(cardId)
    if (!card || card.status !== 'active' || card.enabled === false) {
      return res.status(404).json({ success: false, message: 'البطاقة غير متاحة' })
    }

    if (!card.price || card.price <= 0) {
      return res.status(400).json({ success: false, message: 'هذه البطاقة ليست مدفوعة' })
    }

    const authToken = await getPayMobAuthToken()
    const merchantOrderId = `sallim-${card._id}-${Date.now()}`
    const { amountEGP, rate: exchangeRate } = await convertSarToEgp(card.price)
    const orderResponse = await createPayMobOrder(authToken, amountEGP, merchantOrderId)

    if (!orderResponse?.id) {
      return res.status(500).json({ success: false, message: 'فشل إنشاء الطلب لدى مزود الدفع' })
    }

    const paymentKey = await createPaymentKey(authToken, orderResponse.id, amountEGP, {
      first_name: customerName.trim().split(' ')[0],
      last_name: customerName.trim().split(' ').slice(1).join(' ') || '-',
      email: customerEmail || 'no-email@sallim.local',
      phone_number: customerPhone,
      apartment: 'NA',
      floor: 'NA',
      street: 'NA',
      building: 'NA',
      shipping_method: 'NA',
      postal_code: '00000',
      city: 'Riyadh',
      country: 'SA',
      state: 'Riyadh',
    })

    if (!paymentKey?.token) {
      return res.status(500).json({ success: false, message: 'فشل إنشاء مفتاح الدفع' })
    }

    const checkoutSession = await CheckoutSession.create({
      paymobOrderId: String(orderResponse.id),
      cardId: card._id,
      userId: req.user?.id || null,
      sessionId,
      customerName,
      customerPhone,
      customerEmail,
      amount: Number(card.price),
      currency: 'SAR',
      amountEGP,
      exchangeRate,
    })

    res.json({
      success: true,
      iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey.token}`,
      orderId: String(orderResponse.id),
      checkoutSessionId: checkoutSession._id,
      card: {
        id: card._id,
        name: card.name || card.mainText || 'بطاقة رقمية',
        image: card.image || '',
        price: Number(card.price),
      },
    })
  } catch (error) {
    console.error('Checkout initiate error:', error)
    res.status(500).json({ success: false, message: 'حدث خطأ أثناء تجهيز عملية الدفع' })
  }
})

router.post('/callback', async (req, res) => {
  try {
    const { hmac, obj = {}, type } = req.body

    if (PAYMOB_HMAC_SECRET && hmac && !verifyHMAC(obj, hmac)) {
      return res.status(400).json({ success: false, message: 'Invalid HMAC' })
    }

    const orderId = String(obj?.order?.id || obj?.order || '')
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Missing order id' })
    }

    // ── Check if this is a company checkout order (co- prefix) ──
    const companyOrder = await CompanyOrder.findOne({ paymobOrderId: orderId })
    if (companyOrder) {
      const paymentOk = Boolean(obj?.success)
      const evtType = type || obj?.type || 'TRANSACTION'

      if (!paymentOk || evtType !== 'TRANSACTION') {
        companyOrder.status = 'failed'
        await companyOrder.save()
        return res.json({
          success: false,
          redirectUrl: `${CLIENT_URL}/company-checkout?status=failed&paymobOrderId=${orderId}`,
        })
      }

      // Idempotency guard
      if (companyOrder.status === 'completed' && companyOrder.licenseCode) {
        return res.json({
          success: true,
          alreadyProcessed: true,
          redirectUrl: `${CLIENT_URL}/company-checkout?status=success&paymobOrderId=${orderId}`,
        })
      }

      // Generate activation code
      const plainCode = generateLicenseCode()
      const codeHash = hashLicenseCode(plainCode)

      const licenseKey = await LicenseKey.create({
        codeHash,
        status: 'new',
        maxRecipients: companyOrder.packageSnapshot?.cardLimit || 500,
        note: `Auto-generated for company order ${companyOrder._id} — ${companyOrder.companyEmail}`,
      })

      companyOrder.status = 'completed'
      companyOrder.licenseCode = plainCode
      companyOrder.licenseKeyId = licenseKey._id
      companyOrder.paymobTransactionId = String(obj?.id || obj?.transaction_id || '')
      await companyOrder.save()

      console.log(`[CompanyCheckout] Payment complete — code generated for ${companyOrder.companyEmail}`)

      return res.json({
        success: true,
        redirectUrl: `${CLIENT_URL}/company-checkout?status=success&paymobOrderId=${orderId}`,
      })
    }

    const checkoutSession = await CheckoutSession.findOne({ paymobOrderId: orderId }).populate('cardId')
    if (!checkoutSession) {
      return res.status(404).json({ success: false, message: 'Checkout session not found' })
    }

    const paymentSucceeded = Boolean(obj?.success)
    const eventType = type || obj?.type || 'TRANSACTION'

    if (!paymentSucceeded || eventType !== 'TRANSACTION') {
      checkoutSession.status = 'failed'
      await checkoutSession.save()
      return res.json({
        success: false,
        redirectUrl: buildCheckoutRedirect('failed', {
          orderId,
          cardId: String(checkoutSession.cardId?._id || ''),
        }),
      })
    }

    if (checkoutSession.status === 'completed' && checkoutSession.analyticsId) {
      return res.json({
        success: true,
        alreadyProcessed: true,
        redirectUrl: buildCheckoutRedirect('success', {
          orderId,
          cardId: String(checkoutSession.cardId?._id || ''),
          purchase: String(checkoutSession.analyticsId),
        }),
      })
    }

    const analyticsEntry = await Analytics.create({
      type: 'purchase',
      userId: checkoutSession.userId || undefined,
      cardId: checkoutSession.cardId?._id,
      cardName:
        checkoutSession.cardId?.name ||
        checkoutSession.cardId?.mainText ||
        'بطاقة رقمية',
      sessionId: checkoutSession.sessionId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: {
        amount: checkoutSession.amount,
        currency: checkoutSession.currency,
        paymobOrderId: orderId,
        paymobTransactionId: String(obj?.id || obj?.transaction_id || ''),
        customerName: checkoutSession.customerName,
        customerEmail: checkoutSession.customerEmail,
        customerPhone: checkoutSession.customerPhone,
      },
    })

    checkoutSession.status = 'completed'
    checkoutSession.analyticsId = analyticsEntry._id
    checkoutSession.paymobTransactionId = String(obj?.id || obj?.transaction_id || '')
    await checkoutSession.save()

    await emitPurchaseActivity(req.io, checkoutSession, analyticsEntry)

    return res.json({
      success: true,
      purchaseId: analyticsEntry._id,
      redirectUrl: buildCheckoutRedirect('success', {
        orderId,
        cardId: String(checkoutSession.cardId?._id || ''),
        purchase: String(analyticsEntry._id),
      }),
    })
  } catch (error) {
    console.error('Checkout callback error:', error)
    res.status(500).json({ success: false, message: 'Error processing callback' })
  }
})

router.get('/success', async (req, res) => {
  try {
    const { orderId } = req.query

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' })
    }

    const checkoutSession = await CheckoutSession.findOne({ paymobOrderId: String(orderId) }).populate('cardId')
    if (!checkoutSession || checkoutSession.status !== 'completed') {
      return res.status(404).json({ success: false, message: 'عملية الشراء غير مكتملة بعد' })
    }

    res.json({
      success: true,
      data: {
        orderId: checkoutSession.paymobOrderId,
        purchaseId: checkoutSession.analyticsId,
        card: {
          id: checkoutSession.cardId?._id,
          name: checkoutSession.cardId?.name || checkoutSession.cardId?.mainText || 'بطاقة رقمية',
        },
        redirectUrl: `/editor?cardId=${checkoutSession.cardId?._id}&purchase=${checkoutSession.analyticsId}`,
      },
    })
  } catch (error) {
    console.error('Checkout success error:', error)
    res.status(500).json({ success: false, message: 'Error retrieving transaction' })
  }
})

router.get('/failed', async (req, res) => {
  const { orderId } = req.query

  if (orderId) {
    await CheckoutSession.findOneAndUpdate(
      { paymobOrderId: String(orderId), status: 'initiated' },
      { $set: { status: 'failed' } }
    ).catch(() => {})
  }

  res.json({
    success: false,
    message: 'فشلت عملية الدفع. يرجى المحاولة مرة أخرى.',
  })
})

// Live exchange rates for frontend — detects visitor country
router.get('/exchange-rate', async (req, res) => {
  try {
    const rates = await getExchangeRates()
    const country = (req.query.country || detectCountryFromRequest(req) || 'SA').toUpperCase()
    const forcedCurrency = req.query.currency?.toUpperCase()
    const visitorCurrency = forcedCurrency || COUNTRY_CURRENCY[country] || 'USD'
    const visitorRate = rates[visitorCurrency] || rates.USD || 1
    const egpRate = rates.EGP || 13.16

    res.json({
      success: true,
      country,
      visitorCurrency,
      visitorRate,
      egpRate,
      updatedAt: new Date(cacheTimestamp || Date.now()).toISOString(),
      source: 'open.er-api.com',
    })
  } catch {
    res.status(500).json({ success: false })
  }
})

export default router
