// ═══════════════════════════════════════════
// Paymob Flash Payment Routes
// ═══════════════════════════════════════════

import express from 'express'
import { 
  createPaymentIntention, 
  verifyPaymobHMAC, 
  getIntentionStatus,
  getTransactionDetails,
  getPaymentMethods,
  PAYMOB_MODE,
  buildUnifiedCheckoutUrl
} from '../utils/paymob-flash.js'
import CheckoutSession from '../models/CheckoutSession.js'
import CompanyOrder from '../models/CompanyOrder.js'
import Card from '../models/Card.js'
import Analytics from '../models/Analytics.js'
import { checkoutLimiter } from '../middleware/rateLimiter.js'
import { sendEmail } from '../utils/sendMail.js'

const router = express.Router()

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'
const buildEditorRedirect = (session) => (
  session?.cardId
    ? `/editor?cardId=${session.cardId}&autodownload=1`
    : session?.sessionId
      ? `/editor?autodownload=1&paymobSession=${encodeURIComponent(session.sessionId)}`
      : '/editor'
)

function isUnsafeRedirect(target) {
  const value = String(target || '').trim()
  if (!value) return true
  try {
    const parsed = new URL(value, CLIENT_URL)
    const path = String(parsed.pathname || '/').toLowerCase()
    if (path === '/' && !parsed.search && !parsed.hash) return true
    if (path.startsWith('/payment-result')) return true
    return false
  } catch {
    const lowered = value.toLowerCase()
    return lowered === '/' || lowered.startsWith('/payment-result')
  }
}

const buildFallbackRedirect = (session) => {
  const candidate = session?.postPaymentRedirect
  if (candidate && !isUnsafeRedirect(candidate)) return candidate
  return buildEditorRedirect(session)
}

const SUCCESS_WORDS = ['success', 'succeeded', 'paid', 'completed', 'captured']
const FAIL_WORDS = ['fail', 'failed', 'rejected', 'declined', 'canceled', 'cancelled', 'voided']

function normalizeStatusText(value) {
  return String(value || '').trim().toLowerCase()
}

function extractTransactionFromIntention(data) {
  if (!data || typeof data !== 'object') return null
  const buckets = [
    data.transactions,
    data.payments,
    data.payment_attempts,
    data.intention_detail?.transactions,
    data.details?.transactions,
  ].filter(Array.isArray)

  const all = buckets.flat().filter(Boolean)
  if (!all.length) return null

  const successTx = all.find((tx) => {
    const statusText = normalizeStatusText(tx?.status || tx?.payment_status || tx?.state)
    const byText = SUCCESS_WORDS.some((w) => statusText.includes(w))
    return tx?.success === true || tx?.paid === true || (byText && tx?.pending !== true)
  })
  if (successTx) return { state: 'completed', transactionId: successTx.id || successTx.transaction_id || successTx.txn_id || null }

  const failedTx = all.find((tx) => {
    const statusText = normalizeStatusText(tx?.status || tx?.payment_status || tx?.state)
    const byText = FAIL_WORDS.some((w) => statusText.includes(w))
    return tx?.success === false || (byText && tx?.pending !== true)
  })
  if (failedTx) return { state: 'failed', transactionId: failedTx.id || failedTx.transaction_id || failedTx.txn_id || null }

  return { state: 'pending', transactionId: null }
}

function resolveIntentionState(data) {
  const txState = extractTransactionFromIntention(data)
  if (txState && txState.state !== 'pending') return txState

  const statusText = normalizeStatusText(
    data?.status ||
    data?.payment_status ||
    data?.state ||
    data?.intention_status
  )
  if (SUCCESS_WORDS.some((w) => statusText.includes(w)) || data?.is_paid === true || data?.paid === true) {
    return { state: 'completed', transactionId: txState?.transactionId || null }
  }
  if (FAIL_WORDS.some((w) => statusText.includes(w)) || data?.is_failed === true) {
    return { state: 'failed', transactionId: txState?.transactionId || null }
  }
  return { state: 'pending', transactionId: txState?.transactionId || null }
}

/**
 * Health check endpoint for debugging
 * GET /api/v1/paymob-flash/health
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    mode: PAYMOB_MODE,
    hasSecretKey: !!process.env.PAYMOB_SECRET_KEY,
    hasPublicKey: !!process.env.PAYMOB_PUBLIC_KEY,
    hasApiKey: !!process.env.PAYMOB_API_KEY,
    hasIntegrationId: !!process.env.PAYMOB_INTEGRATION_ID,
    integrationId: process.env.PAYMOB_INTEGRATION_ID || 'default',
    clientUrl: CLIENT_URL,
    backendUrl: BACKEND_URL,
    secretKeyPrefix: process.env.PAYMOB_SECRET_KEY ? process.env.PAYMOB_SECRET_KEY.substring(0, 15) + '...' : 'MISSING',
  })
})

/**
 * Create Payment Intention (Flash Integration)
 * POST /api/v1/paymob-flash/create-intention
 */
router.post('/create-intention', checkoutLimiter, async (req, res) => {
  try {
    const {
      cardId,
      productName,
      customerName,
      customerPhone,
      customerEmail,
      amount,
      currency = 'EGP',
      sessionId,
      billing_data = {},
    } = req.body

    // Validate required fields
    if (!cardId || !customerName || !customerPhone || !customerEmail || !amount || !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'بيانات الطلب غير مكتملة'
      })
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'المبلغ غير صحيح'
      })
    }

    // Resolve product details (card or template/test product)
    let card = null
    let isCatalogCard = false
    const isTestCard = cardId.startsWith('test_')

    if (!isTestCard) {
      try {
        card = await Card.findById(cardId)
      } catch {
        card = null
      }

      if (card) {
        if (card.status !== 'active' || card.enabled === false) {
          return res.status(404).json({
            success: false,
            error: 'البطاقة غير متاحة'
          })
        }
        isCatalogCard = true
      } else {
        card = {
          _id: null,
          title: productName || 'منتج مدفوع',
          userId: null,
        }
      }
    } else {
      // Test card - create mock card data
      card = {
        _id: cardId,
        title: 'Test Card',
        userId: null
      }
    }

    // Generate unique merchant order ID
    const merchantOrderId = `sallim-flash-${cardId}-${Date.now()}`

    // Create or update checkout session (skip DB for test cards)
    let checkoutSession
    if (!isTestCard) {
      const redirectUrl = isCatalogCard
        ? `${CLIENT_URL}/editor?cardId=${cardId}&autodownload=1`
        : `${CLIENT_URL}/editor?template=${encodeURIComponent(cardId)}&autodownload=1&paymobSession=${encodeURIComponent(sessionId)}`

      const updatePayload = {
        sessionId,
        customerName,
        customerPhone,
        customerEmail,
        amount,
        currency,
        merchantOrderId,
        status: 'pending',
        paymentMethod: 'paymob_flash',
        postPaymentRedirect: redirectUrl,
        createdAt: new Date(),
      }
      if (isCatalogCard) {
        updatePayload.cardId = cardId
      }

      checkoutSession = await CheckoutSession.findOneAndUpdate(
        { sessionId },
        updatePayload,
        { upsert: true, new: true }
      )
    }

    console.log('[Paymob Flash] Creating intention for:', {
      merchantOrderId,
      amount,
      currency,
      customer: customerEmail,
      mode: PAYMOB_MODE
    })

    // Split customer name
    const nameParts = customerName.trim().split(' ')
    const firstName = nameParts[0] || 'Customer'
    const lastName = nameParts.slice(1).join(' ') || 'N/A'

    // Create payment intention
    const intention = await createPaymentIntention({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: {
        first_name: firstName,
        last_name: lastName,
        email: customerEmail,
        phone: customerPhone.replace(/[\s\-()]/g, '').replace(/^00/, '+'),
      },
      payment_methods: process.env.PAYMOB_INTEGRATION_ID 
        ? [parseInt(process.env.PAYMOB_INTEGRATION_ID, 10)]
        : [5577534], // Test integration ID
      billing_data: {
        first_name: firstName,
        last_name: lastName,
        email: customerEmail,
        phone_number: customerPhone,
        country: billing_data.country || 'N/A',
        state: billing_data.state || 'N/A',
        city: billing_data.city || 'N/A',
        street: billing_data.street || 'N/A',
        building: billing_data.building || 'N/A',
        floor: billing_data.floor || 'N/A',
        apartment: billing_data.apartment || 'N/A',
        postal_code: billing_data.postal_code || '00000',
      },
      extras: {
        merchant_order_id: merchantOrderId,
        card_id: cardId,
        session_id: sessionId,
        notification_url: `${BACKEND_URL}/api/v1/paymob-flash/callback`,
        redirection_url: `${CLIENT_URL}/payment-result`,
        items: [{
          name: card.title || 'تهنئة العيد',
          amount: Math.round(amount * 100),
          description: 'Eid Greeting Card',
          quantity: 1,
        }],
      }
    })

    const clientSecret = intention.client_secret || intention.clientSecret || null
    const checkoutUrl =
      intention.unified_checkout_url ||
      buildUnifiedCheckoutUrl(clientSecret) ||
      intention.payment_url ||
      null

    if (!checkoutUrl) {
      console.error('[Paymob Flash] Missing checkout URL from intention response')
      throw new Error('تعذر إنشاء رابط الدفع من Paymob. تأكد من ضبط PAYMOB_PUBLIC_KEY.')
    }

    // Update session with intention details (skip for test cards)
    if (!isTestCard && checkoutSession) {
      await CheckoutSession.findOneAndUpdate(
        { sessionId },
        {
          intentionId: intention.intention_id,
          clientSecret,
          paymentUrl: checkoutUrl,
        }
      )
    }

    console.log('[Paymob Flash] Intention created:', {
      intentionId: intention.intention_id,
      hasCheckoutUrl: !!checkoutUrl
    })

    res.json({
      success: true,
      intentionId: intention.intention_id,
      clientSecret,
      paymentUrl: checkoutUrl,
      checkoutUrl,
      merchantOrderId,
    })

  } catch (error) {
    console.error('[Paymob Flash] Create intention error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data || error.response || 'No response data'
    })
    res.status(500).json({
      success: false,
      error: error.message || 'فشل إنشاء الطلب. يرجى المحاولة مرة أخرى',
      details: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    })
  }
})

/**
 * Get active payment methods
 * GET /api/v1/paymob-flash/payment-methods
 */
router.get('/payment-methods', async (_req, res) => {
  try {
    const methods = await getPaymentMethods()
    res.json({ success: true, methods })
  } catch (error) {
    console.error('[Paymob Flash] Payment methods error:', error.message)
    // Return empty array so the UI still loads (logos are cosmetic only)
    res.json({ success: true, methods: [] })
  }
})

/**
 * Payment Callback/Webhook from Paymob
 * POST /api/v1/paymob-flash/callback
 */
router.post('/callback', async (req, res) => {
  try {
    console.log('[Paymob Flash] Callback received:', {
      type: req.body.type,
      obj_id: req.body.obj?.id,
      success: req.body.obj?.success,
    })

    const { obj, type, hmac } = req.body

    if (!obj || type !== 'TRANSACTION') {
      console.log('[Paymob Flash] Invalid callback type:', type)
      return res.status(400).json({ message: 'Invalid callback' })
    }

    // Verify HMAC
    const isValidHmac = verifyPaymobHMAC(obj, hmac)
    if (!isValidHmac) {
      console.error('[Paymob Flash] Invalid HMAC signature')
      return res.status(403).json({ message: 'Invalid signature' })
    }

    const {
      id: transactionId,
      success,
      pending,
      amount_cents,
      currency,
      order,
      created_at,
    } = obj

    // Extract identifiers from callback (merchant order id is preferred)
    const merchantOrderId = order?.merchant_order_id || obj.merchant_order_id || null
    const callbackSessionId =
      obj.session_id ||
      order?.session_id ||
      order?.extras?.session_id ||
      obj.extras?.session_id ||
      obj.metadata?.session_id ||
      null
    const paymobOrderId = order?.id ? String(order.id) : null
    if (!merchantOrderId && !callbackSessionId && !paymobOrderId) {
      console.error('[Paymob Flash] Missing callback identifiers')
      return res.status(400).json({ message: 'Missing payment identifiers' })
    }

    // ── Company order callback (merchant_order_id starts with "co-") ──
    if (merchantOrderId && merchantOrderId.startsWith('co-')) {
      const companyOrder = await CompanyOrder.findOne({ merchantOrderId })
      if (companyOrder && companyOrder.status !== 'completed') {
        const newStatus = success ? 'completed' : pending ? 'initiated' : 'failed'
        companyOrder.status = newStatus
        if (transactionId) companyOrder.paymobTransactionId = String(transactionId)
        if (paymobOrderId && !companyOrder.paymobOrderId) companyOrder.paymobOrderId = paymobOrderId
        await companyOrder.save()
        console.log('[Paymob Flash] Company order updated:', { merchantOrderId, status: newStatus })
      }
      return res.json({ message: 'Company callback processed' })
    }

    // Find checkout session with fallbacks
    const session = await CheckoutSession.findOne({
      $or: [
        ...(merchantOrderId ? [{ merchantOrderId }] : []),
        ...(callbackSessionId ? [{ sessionId: callbackSessionId }] : []),
        ...(paymobOrderId ? [{ paymobOrderId }] : []),
      ],
    })

    if (!session) {
      console.error('[Paymob Flash] Session not found:', {
        merchantOrderId,
        callbackSessionId,
        paymobOrderId,
      })
      return res.status(404).json({ message: 'Session not found' })
    }

    // Update session status
    const alreadyCompleted = session.status === 'completed'
    const newStatus = success ? 'completed' : pending ? 'pending' : 'failed'
    session.status = newStatus
    session.transactionId = String(transactionId || '')
    if (paymobOrderId && !session.paymobOrderId) {
      session.paymobOrderId = paymobOrderId
    }
    session.paymobData = obj
    if (success && !session.completedAt) {
      session.completedAt = new Date()
    }
    await session.save()

    console.log('[Paymob Flash] Payment status:', {
      merchantOrderId,
      status: newStatus,
      transactionId,
      success,
    })

    // If payment successful, record analytics once
    if (success && !alreadyCompleted) {
      const card = await Card.findById(session.cardId)

      if (card) {
        await Analytics.create({
          cardId: session.cardId,
          cardName: card.title || card.name || 'بطاقة تهنئة',
          userId: card.userId,
          action: 'purchase',
          timestamp: new Date(),
          amount: amount_cents / 100,
          currency: currency,
          paymentMethod: 'paymob_flash',
          transactionId,
          merchantOrderId,
        })

        console.log('[Paymob Flash] Analytics recorded for successful payment')
      }
    }

    if (success && !session.paymentEmailSentAt && session.customerEmail) {
      const card = await Card.findById(session.cardId).catch(() => null)
      const sent = await sendPaymentConfirmationEmail(session, card)
      if (sent) {
        session.paymentEmailSentAt = new Date()
        await session.save()
      }
    }

    res.json({ message: 'Callback processed' })

  } catch (error) {
    console.error('[Paymob Flash] Callback error:', error.message)
    res.status(500).json({ message: 'Callback processing failed' })
  }
})

/**
 * Check Payment Status
 * GET /api/v1/paymob-flash/status/:sessionId
 */
router.get('/status/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params

    const session = await CheckoutSession.findOne({ sessionId })

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'الجلسة غير موجودة'
      })
    }

    // If we have an intention ID, get latest status from Paymob
    let intentionStatus = null
    if (session.intentionId) {
      try {
        intentionStatus = await getIntentionStatus(session.intentionId)
        if (intentionStatus?.success && intentionStatus.data) {
          const resolved = resolveIntentionState(intentionStatus.data)
          if (resolved.state === 'completed' && session.status !== 'completed') {
            session.status = 'completed'
            if (resolved.transactionId && !session.transactionId) {
              session.transactionId = String(resolved.transactionId)
            }
            if (!session.completedAt) session.completedAt = new Date()
            await session.save()
          }
        }
      } catch (error) {
        console.error('[Paymob Flash] Failed to get intention status:', error.message)
      }
    }

    res.json({
      success: true,
      status: session.status,
      transactionId: session.transactionId,
      merchantOrderId: session.merchantOrderId,
      amount: session.amount,
      currency: session.currency,
      completedAt: session.completedAt,
      redirectUrl: buildFallbackRedirect(session),
      paymentEmailSentAt: session.paymentEmailSentAt,
      intentionStatus: intentionStatus?.data,
    })

  } catch (error) {
    console.error('[Paymob Flash] Status check error:', error.message)
    res.status(500).json({
      success: false,
      error: 'فشل التحقق من حالة الدفع'
    })
  }
})

/**
 * Get Transaction Details
 * GET /api/v1/paymob-flash/transaction/:transactionId
 */
router.get('/transaction/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params

    const transaction = await getTransactionDetails(parseInt(transactionId, 10))

    res.json({
      success: true,
      transaction: transaction.data
    })

  } catch (error) {
    console.error('[Paymob Flash] Transaction details error:', error.message)
    res.status(500).json({
      success: false,
      error: 'فشل الحصول على تفاصيل المعاملة'
    })
  }
})

/**
 * Confirm successful payment (webhook is source of truth)
 * POST /api/v1/paymob-flash/confirm-success
 */
router.post('/confirm-success', async (req, res) => {
  try {
    const { sessionId, transactionId: urlTransactionId } = req.body
    if (!sessionId && !urlTransactionId) {
      return res.status(400).json({ success: false, error: 'معرف الجلسة مطلوب' })
    }

    let session = sessionId ? await CheckoutSession.findOne({ sessionId }) : null

    // Fallback: look up by transaction ID (when sessionId is missing from localStorage)
    if (!session && urlTransactionId) {
      session = await CheckoutSession.findOne({ transactionId: String(urlTransactionId) })
    }

    if (!session) {
      return res.status(404).json({ success: false, error: 'الجلسة غير موجودة' })
    }

    if (session.status !== 'completed') {
      // Try direct transaction verification first (most reliable)
      const txId = urlTransactionId || session.transactionId
      if (txId) {
        try {
          const txDetails = await getTransactionDetails(parseInt(txId, 10))
          if (txDetails?.data?.success === true) {
            session.status = 'completed'
            if (!session.transactionId) session.transactionId = String(txId)
            if (!session.completedAt) session.completedAt = new Date()
            await session.save()
          }
        } catch (e) {
          console.error('[Paymob Flash] Transaction verification error:', e.message)
        }
      }

      // Fallback: check intention status
      if (session.status !== 'completed' && session.intentionId) {
        try {
          const intentionStatus = await getIntentionStatus(session.intentionId)
          if (intentionStatus?.success && intentionStatus.data) {
            const resolved = resolveIntentionState(intentionStatus.data)
            if (resolved.state === 'completed') {
              session.status = 'completed'
              if (resolved.transactionId && !session.transactionId) {
                session.transactionId = String(resolved.transactionId)
              }
              if (!session.completedAt) session.completedAt = new Date()
              await session.save()
            }
          }
        } catch (error) {
          console.error('[Paymob Flash] Confirm success reconcile error:', error.message)
        }
      }
    }

    if (session.status !== 'completed') {
      return res.status(409).json({
        success: false,
        code: 'PAYMENT_NOT_CONFIRMED',
        status: session.status,
        error: 'بانتظار تأكيد الدفع من بوابة الدفع',
      })
    }

    const card = await Card.findById(session.cardId).catch(() => null)

    if (!session.paymentEmailSentAt && session.customerEmail) {
      const sent = await sendPaymentConfirmationEmail(session, card)
      if (sent) {
        session.paymentEmailSentAt = new Date()
        await session.save()
      }
    }

    const redirectUrl = buildFallbackRedirect(session)

    res.json({
      success: true,
      status: session.status,
      message: 'تم تأكيد الدفع بنجاح',
      redirectUrl,
      cardId: session.cardId,
      transactionId: session.transactionId,
      merchantOrderId: session.merchantOrderId,
    })

  } catch (error) {
    console.error('[Paymob Flash] Confirm success error:', error.message)
    res.status(500).json({
      success: false,
      error: 'فشل تأكيد الدفع'
    })
  }
})

/**
 * Send payment confirmation email
 */
async function sendPaymentConfirmationEmail(session, card) {
  if (!session?.customerEmail) return false

  const orderRef = session.merchantOrderId || session.intentionId || session.sessionId
  const fallbackPath = buildFallbackRedirect(session)
  const redirectPath = session.postPaymentRedirect || fallbackPath
  const fullRedirect = redirectPath.startsWith('http')
    ? redirectPath
    : `${CLIENT_URL}${redirectPath.startsWith('/') ? '' : '/'}${redirectPath}`

  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; color:#0f172a; line-height:1.8">
      <h2 style="margin:0 0 16px;">تم تأكيد الدفع بنجاح ✅</h2>
      <p>مرحباً ${session.customerName || 'عميلنا العزيز'}،</p>
      <p>تم تأكيد عملية الدفع الخاصة بك بنجاح.</p>
      <ul style="padding-right:18px;">
        <li>رقم الطلب: <strong>${orderRef}</strong></li>
        <li>المبلغ: <strong>${session.amount} ${session.currency || 'EGP'}</strong></li>
        <li>المنتج: <strong>${card?.title || card?.name || 'بطاقة تهنئة'}</strong></li>
      </ul>
      <p style="margin-top:16px;">
        يمكنك فتح التصميم مباشرة من هنا:
      </p>
      <p>
        <a href="${fullRedirect}" style="display:inline-block;padding:10px 18px;background:#111827;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;">
          فتح التصميم
        </a>
      </p>
    </div>
  `

  return sendEmail({
    to: session.customerEmail,
    subject: 'تم تأكيد الدفع - منصة سلّم',
    html,
  })
}

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    mode: PAYMOB_MODE,
    message: 'Paymob Flash Integration is operational'
  })
})

export default router
