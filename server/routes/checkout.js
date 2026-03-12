import express from 'express'
import crypto from 'crypto'
import Analytics from '../models/Analytics.js'
import Card from '../models/Card.js'
import CheckoutSession from '../models/CheckoutSession.js'

const router = express.Router()

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

async function getPayMobAuthToken() {
  const response = await fetch('https://accept.paymob.com/api/auth/tokens', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
  })

  const data = await response.json()
  return data.token
}

async function createPayMobOrder(authToken, amount, merchantOrderId) {
  const response = await fetch('https://accept.paymob.com/api/ecommerce/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: Math.round(amount * 100),
      currency: 'SAR',
      merchant_order_id: merchantOrderId,
      items: [],
    }),
  })

  return response.json()
}

async function createPaymentKey(authToken, orderId, amount, billingData) {
  const response = await fetch('https://accept.paymob.com/api/acceptance/payment_keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: Math.round(amount * 100),
      expiration: 3600,
      order_id: orderId,
      billing_data: billingData,
      currency: 'SAR',
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

router.post('/initiate', async (req, res) => {
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
    const orderResponse = await createPayMobOrder(authToken, card.price, merchantOrderId)

    if (!orderResponse?.id) {
      return res.status(500).json({ success: false, message: 'فشل إنشاء الطلب لدى مزود الدفع' })
    }

    const paymentKey = await createPaymentKey(authToken, orderResponse.id, card.price, {
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

export default router
