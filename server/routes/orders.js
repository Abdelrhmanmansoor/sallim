import { Router } from 'express'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import PersonalOrder from '../models/PersonalOrder.js'
import BatchOrder from '../models/BatchOrder.js'
import LicenseKey from '../models/LicenseKey.js'
import Stats from '../models/Stats.js'
import { getAuditRequestMeta, safeAuditLog } from '../utils/audit.js'
import { capturePayPalOrder, createPayPalOrder, getPayPalCapture } from '../utils/paypal.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = Router()

const SUPPORT_CONTACT = process.env.SUPPORT_CONTACT || '+201007835547'
const SECOND_CARD_REFUSAL_MESSAGE = `عذراً 🙏 كل عملية شراء تُتيح بطاقة واحدة فقط.\nللمساعدة: ${SUPPORT_CONTACT}`
const BATCH_ZIP_REFUSAL_MESSAGE = `عذراً 🙏 كل عملية شراء جماعي تُتيح ملف ZIP واحد فقط.\nللمساعدة: ${SUPPORT_CONTACT}`

const BATCH_DEFAULT_MAX_RECIPIENTS = 50
const BATCH_PAYPAL_AMOUNT = Number(process.env.BATCH_PAYPAL_AMOUNT || 21)
const BATCH_PAYPAL_CURRENCY = String(process.env.BATCH_PAYPAL_CURRENCY || 'USD').toUpperCase()

// License JWT Secret - MUST be set in environment variables
if (!process.env.LICENSE_JWT_SECRET && !process.env.JWT_SECRET) {
  console.error('❌ FATAL ERROR: LICENSE_JWT_SECRET or JWT_SECRET is not defined in environment variables.')
  console.error('👉 Add LICENSE_JWT_SECRET (or JWT_SECRET) to your .env file and restart the server.')
  process.exit(1)
}
const LICENSE_JWT_SECRET = process.env.LICENSE_JWT_SECRET || process.env.JWT_SECRET

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

function normalizeText(value, maxLength = 120) {
  return String(value || '').trim().slice(0, maxLength)
}

function hashLicenseCode(code) {
  return crypto
    .createHash('sha256')
    .update(String(code || '').trim().toUpperCase())
    .digest('hex')
}

async function verifyLicenseFromRequest(req) {
  const token = req.headers['x-license-token']
  if (!token) return { ok: false }

  let decoded
  try {
    decoded = jwt.verify(token, LICENSE_JWT_SECRET)
  } catch {
    return { ok: false }
  }

  if (!decoded || decoded.type !== 'license' || !decoded.licenseId) return { ok: false }

  const key = await LicenseKey.findById(decoded.licenseId)
  if (!key || key.status !== 'activated') return { ok: false }
  if (key.activatedDeviceId && decoded.deviceId && key.activatedDeviceId !== decoded.deviceId) return { ok: false }

  return { ok: true, key, decoded }
}

function buildSnapshotHash(snapshot) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(snapshot))
    .digest('hex')
}

function buildNamesHash(names) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(names))
    .digest('hex')
}

function normalizeNames(names) {
  if (!Array.isArray(names)) return []
  return names
    .map(name => normalizeText(name, 120))
    .filter(Boolean)
}

function hasSuspiciousInput(value = '') {
  const text = String(value)
  const patterns = [
    /<script/i,
    /javascript:/i,
    /\$where/i,
    /\$gt/i,
    /\$ne/i,
    /\bselect\b.+\bfrom\b/i,
    /\bdrop\s+table\b/i,
    /function\s*\(/i,
  ]

  return patterns.some(pattern => pattern.test(text))
}

async function logEvent(req, {
  userType = 'guest',
  action = 'attempt',
  entity = 'security_event',
  description,
  metadata = {},
  success = false,
}) {
  await safeAuditLog({
    userType,
    action,
    entity,
    description,
    metadata,
    success,
    ...getAuditRequestMeta(req),
  })
}

router.post('/personal/checkout', async (req, res) => {
  try {
    const snapshot = req.body?.snapshot
    const templateId = normalizeText(req.body?.templateId, 80)
    const recipientName = normalizeText(req.body?.recipientName, 120)
    const senderName = normalizeText(req.body?.senderName, 120)
    const claimedRole = normalizeText(req.body?.role || req.body?.claimedRole, 40).toLowerCase()

    if (!snapshot || !templateId || !recipientName) {
      return res.status(400).json({ success: false, error: 'بيانات البطاقة غير مكتملة.' })
    }

    const combinedPayload = JSON.stringify({ templateId, recipientName, senderName, snapshot })
    if (hasSuspiciousInput(combinedPayload)) {
      await logEvent(req, {
        action: 'reject',
        description: 'تم رفض محاولة شراء فردي بسبب مدخلات مشبوهة',
        metadata: { eventType: 'injection_attempt', templateId, recipientName },
      })
      return res.status(400).json({ success: false, error: 'تعذر إكمال الطلب الحالي.' })
    }

    if (claimedRole === 'admin') {
      await logEvent(req, {
        action: 'reject',
        description: 'تم تجاهل ادعاء صلاحيات أدمن أثناء شراء فردي',
        metadata: { eventType: 'admin_claim', templateId, recipientName },
      })
    }

    const order = await PersonalOrder.create({
      templateId,
      recipientName,
      senderName,
      snapshot,
      snapshotHash: buildSnapshotHash(snapshot),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: {
        checkoutSource: 'web',
      },
    })

    await logEvent(req, {
      userType: 'customer',
      action: 'purchase',
      entity: 'order',
      description: `شراء بطاقة فردية للتصميم ${templateId}`,
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        recipientName,
      },
      success: true,
    })

    res.status(201).json({
      success: true,
      message: 'تم تأكيد الدفع بنجاح.',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        price: order.price,
        currency: order.currency,
        supportContact: SUPPORT_CONTACT,
      },
    })
  } catch (error) {
    console.error('Personal checkout error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء إتمام الطلب.' })
  }
})

router.get('/personal/:orderId', async (req, res) => {
  try {
    const order = await PersonalOrder.findById(req.params.orderId)

    if (!order) {
      return res.status(404).json({ success: false, error: 'الطلب غير موجود.' })
    }

    res.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        price: order.price,
        currency: order.currency,
        templateId: order.templateId,
        recipientName: order.recipientName,
        senderName: order.senderName,
        snapshot: order.snapshot,
        downloadedAt: order.downloadedAt,
        supportContact: SUPPORT_CONTACT,
      },
    })
  } catch (error) {
    console.error('Get personal order error:', error)
    res.status(500).json({ success: false, error: 'تعذر جلب بيانات الطلب.' })
  }
})

router.post('/personal/consume', async (req, res) => {
  try {
    const orderId = normalizeText(req.body?.orderId, 80)
    const snapshot = req.body?.snapshot

    if (!orderId || !snapshot) {
      return res.status(400).json({ success: false, error: 'بيانات الطلب غير مكتملة.' })
    }

    const order = await PersonalOrder.findById(orderId)
    if (!order) {
      await logEvent(req, {
        action: 'reject',
        entity: 'order',
        description: 'محاولة استخدام طلب فردي غير موجود',
        metadata: { eventType: 'invalid_order', orderId },
      })
      return res.status(404).json({ success: false, error: 'الطلب غير موجود.' })
    }

    const snapshotText = JSON.stringify(snapshot)
    if (hasSuspiciousInput(snapshotText)) {
      order.attemptCount += 1
      order.lastAttemptAt = new Date()
      await order.save()

      await logEvent(req, {
        userType: 'customer',
        action: 'reject',
        description: 'تم رفض محاولة تحميل بسبب مدخلات مشبوهة',
        metadata: { eventType: 'injection_attempt', orderId },
      })

      return res.status(400).json({ success: false, error: 'تعذر تجهيز البطاقة الحالية.' })
    }

    if (order.status === 'consumed' || order.downloadedAt) {
      order.attemptCount += 1
      order.lastAttemptAt = new Date()
      order.lockedReason = 'single_card_limit'
      await order.save()

      await logEvent(req, {
        userType: 'customer',
        action: 'reject',
        entity: 'order',
        description: 'محاولة طلب بطاقة ثانية بعد عملية شراء مكتملة',
        metadata: {
          eventType: 'second_card_request',
          orderId,
          orderNumber: order.orderNumber,
        },
      })

      return res.status(409).json({
        success: false,
        code: 'ORDER_ALREADY_USED',
        error: SECOND_CARD_REFUSAL_MESSAGE,
      })
    }

    const snapshotHash = buildSnapshotHash(snapshot)
    if (snapshotHash !== order.snapshotHash) {
      order.attemptCount += 1
      order.lastAttemptAt = new Date()
      await order.save()

      await logEvent(req, {
        userType: 'customer',
        action: 'reject',
        entity: 'order',
        description: 'تم رفض محاولة تعديل الاسم أو التصميم بعد الدفع',
        metadata: {
          eventType: 'post_payment_snapshot_mismatch',
          orderId,
          orderNumber: order.orderNumber,
        },
      })

      return res.status(403).json({
        success: false,
        code: 'SNAPSHOT_MISMATCH',
        error: 'الاسم الذي أدخلته نهائي ولن يمكن تعديله بعد الدفع.',
      })
    }

    order.status = 'consumed'
    order.downloadedAt = new Date()
    order.lastAttemptAt = new Date()
    await order.save()

    Stats.incrementToday('downloads').catch(() => { })

    await logEvent(req, {
      userType: 'customer',
      action: 'download',
      entity: 'order',
      description: `تم تنزيل البطاقة للطلب ${order.orderNumber}`,
      metadata: {
        eventType: 'personal_download_success',
        orderId,
        orderNumber: order.orderNumber,
      },
      success: true,
    })

    res.json({
      success: true,
      message: '🎉 بطاقتك جاهزة! نتمنى أن تُسعد من تُهديها.',
      data: {
        orderId: order._id,
        downloadedAt: order.downloadedAt,
      },
    })
  } catch (error) {
    console.error('Consume personal order error:', error)
    res.status(500).json({ success: false, error: 'تعذر تجهيز البطاقة النهائية.' })
  }
})

router.post('/batch/checkout', async (req, res) => {
  try {
    const snapshot = req.body?.snapshot
    const templateId = normalizeText(req.body?.templateId, 80)
    const names = normalizeNames(req.body?.names)
    const claimedRole = normalizeText(req.body?.role || req.body?.claimedRole, 40).toLowerCase()
    const paymentProvider = normalizeText(req.body?.paymentProvider, 20).toLowerCase()
    const paypalCaptureId = normalizeText(req.body?.paypalCaptureId, 80)
    const paypalOrderId = normalizeText(req.body?.paypalOrderId, 80)

    const maxRecipients = Number.isFinite(req.body?.maxRecipients)
      ? Math.max(1, Math.min(Number(req.body.maxRecipients), BATCH_DEFAULT_MAX_RECIPIENTS))
      : BATCH_DEFAULT_MAX_RECIPIENTS

    if (!snapshot || !templateId || names.length === 0) {
      return res.status(400).json({ success: false, error: 'بيانات الإرسال الجماعي غير مكتملة.' })
    }

    if (names.length > maxRecipients) {
      return res.status(400).json({ success: false, error: `الحد الأقصى لهذه الباقة هو ${maxRecipients} اسماً.` })
    }

    const combinedPayload = JSON.stringify({ templateId, snapshot, names })
    if (hasSuspiciousInput(combinedPayload)) {
      await logEvent(req, {
        action: 'reject',
        description: 'تم رفض محاولة شراء جماعي بسبب مدخلات مشبوهة',
        metadata: { eventType: 'injection_attempt', templateId, recipientCount: names.length },
      })
      return res.status(400).json({ success: false, error: 'تعذر إكمال الطلب الحالي.' })
    }

    if (claimedRole === 'admin') {
      await logEvent(req, {
        action: 'reject',
        description: 'تم تجاهل ادعاء صلاحيات أدمن أثناء شراء جماعي',
        metadata: { eventType: 'admin_claim', templateId },
      })
    }

    const license = await verifyLicenseFromRequest(req)
    if (!license.ok) {
      if (paymentProvider !== 'paypal' || !paypalCaptureId) {
        return res.status(402).json({ success: false, error: 'يرجى الدفع عبر بايبال أو تفعيل كود الشركة.' })
      }

      const capture = await getPayPalCapture(paypalCaptureId)
      if (!capture || capture.status !== 'COMPLETED') {
        return res.status(402).json({ success: false, error: 'الدفع غير مكتمل.' })
      }

      const paidAmount = Number(capture.amountValue || 0)
      if (!Number.isFinite(paidAmount) || Math.abs(paidAmount - BATCH_PAYPAL_AMOUNT) > 0.01 || String(capture.currencyCode || '').toUpperCase() !== BATCH_PAYPAL_CURRENCY) {
        return res.status(402).json({ success: false, error: 'قيمة الدفع غير صحيحة.' })
      }
    }

    const order = await BatchOrder.create({
      templateId,
      recipientCount: names.length,
      maxRecipients,
      snapshot,
      snapshotHash: buildSnapshotHash(snapshot),
      namesHash: buildNamesHash(names),
      paymentProvider: license.ok ? 'manual' : 'paypal',
      paypalOrderId: license.ok ? undefined : paypalOrderId,
      paypalCaptureId: license.ok ? undefined : paypalCaptureId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      metadata: {
        checkoutSource: 'web',
      },
    })

    await logEvent(req, {
      userType: 'customer',
      action: 'purchase',
      entity: 'order',
      description: `شراء إرسال جماعي للتصميم ${templateId}`,
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
        recipientCount: order.recipientCount,
      },
      success: true,
    })

    res.status(201).json({
      success: true,
      message: 'تم تأكيد الدفع بنجاح.',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        price: order.price,
        currency: order.currency,
        maxRecipients: order.maxRecipients,
        recipientCount: order.recipientCount,
        supportContact: SUPPORT_CONTACT,
      },
    })
  } catch (error) {
    console.error('Batch checkout error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء إتمام الطلب.' })
  }
})

// In-memory store for pending PayPal orders (verified on capture)
const pendingPayPalOrders = new Map()
setInterval(() => {
  const now = Date.now()
  for (const [id, d] of pendingPayPalOrders) {
    if (now - d.createdAt > 3600000) pendingPayPalOrders.delete(id)
  }
}, 1800000)

router.post('/paypal/create', async (req, res) => {
  try {
    const product = normalizeText(req.body?.product || 'batch', 40).toLowerCase()

    // PayPal doesn't support SAR — convert all prices to USD
    const SAR_TO_USD = 0.2667  // 1 SAR ≈ 0.2667 USD (1 USD ≈ 3.75 SAR)
    let amount, currency, description

    if (product === 'batch') {
      amount = BATCH_PAYPAL_AMOUNT
      currency = BATCH_PAYPAL_CURRENCY
      description = 'بطاقات تهنئة جماعية'
    } else if (product === 'eid-song') {
      amount = Math.ceil(50 * SAR_TO_USD * 100) / 100  // ~13.34 USD
      currency = 'USD'
      description = 'أغنية العيد'
    } else if (product === 'custom-design') {
      amount = Math.ceil(35 * SAR_TO_USD * 100) / 100  // ~9.34 USD
      currency = 'USD'
      description = 'تصميم خاص'
    } else if (product === 'template' || product === 'card') {
      const sarAmount = Number(req.body?.amount)
      if (!Number.isFinite(sarAmount) || sarAmount < 0.5 || sarAmount > 500) {
        return res.status(400).json({ success: false, error: 'سعر غير صالح.' })
      }
      amount = Math.ceil(sarAmount * SAR_TO_USD * 100) / 100
      currency = 'USD'
      description = normalizeText(req.body?.description || 'قالب مميز', 80)
    } else {
      return res.status(400).json({ success: false, error: 'نوع المنتج غير صالح.' })
    }

    // Smart Buttons popup flow doesn't need return/cancel URLs
    const order = await createPayPalOrder({
      amount,
      currency,
      description,
    })

    pendingPayPalOrders.set(order.id, {
      product,
      amount,
      currency,
      customerName: normalizeText(req.body?.customerName, 120),
      customerPhone: normalizeText(req.body?.customerPhone, 20),
      customerEmail: normalizeText(req.body?.customerEmail, 120),
      cardId: normalizeText(req.body?.cardId, 80),
      sessionId: normalizeText(req.body?.sessionId, 80),
      templateId: normalizeText(req.body?.templateId, 80),
      createdAt: Date.now(),
    })

    await logEvent(req, {
      userType: 'customer',
      action: 'attempt',
      entity: 'payment',
      description: `إنشاء طلب دفع بايبال — ${product}`,
      metadata: { provider: 'paypal', orderId: order.id, product, amount, currency },
      success: true,
    })

    res.json({
      success: true,
      data: {
        orderId: order.id,
        approveUrl: order.approveUrl,
      },
    })
  } catch (error) {
    console.error('PayPal create error:', error?.message, JSON.stringify(error?.details || ''))
    if (error?.code === 'PAYPAL_CONFIG_MISSING') {
      return res.status(500).json({ success: false, error: 'إعدادات بايبال غير مكتملة على السيرفر.' })
    }
    const issues = error?.details?.details || error?.details?.issues || []
    const detail = issues?.[0]?.description || error?.details?.error_description || error?.details?.message || error?.message || ''
    res.status(500).json({
      success: false,
      error: 'تعذر بدء عملية الدفع.',
      detail: detail,
      paypalError: error?.details?.name || error?.details?.error || '',
      issues: issues,
    })
  }
})

router.post('/paypal/capture', async (req, res) => {
  try {
    const orderId = normalizeText(req.body?.orderId, 120)
    if (!orderId) return res.status(400).json({ success: false, error: 'معرّف الدفع غير صحيح.' })

    const pending = pendingPayPalOrders.get(orderId)
    if (!pending) {
      return res.status(404).json({ success: false, error: 'طلب الدفع غير موجود أو منتهي الصلاحية.' })
    }

    const result = await capturePayPalOrder(orderId)
    const ok = result.captureId && result.captureStatus === 'COMPLETED'
    if (!ok) return res.status(402).json({ success: false, error: 'الدفع غير مكتمل.' })

    const paidAmount = Number(result.amountValue || 0)
    if (!Number.isFinite(paidAmount) || Math.abs(paidAmount - pending.amount) > 0.01) {
      return res.status(402).json({ success: false, error: 'قيمة الدفع غير صحيحة.' })
    }

    pendingPayPalOrders.delete(orderId)

    await logEvent(req, {
      userType: 'customer',
      action: 'purchase',
      entity: 'payment',
      description: `تأكيد دفع بايبال — ${pending.product}`,
      metadata: {
        provider: 'paypal',
        orderId,
        captureId: result.captureId,
        status: result.captureStatus,
        product: pending.product,
        amount: paidAmount,
        currency: result.currencyCode,
        customerName: pending.customerName,
      },
      success: true,
    })

    res.json({
      success: true,
      data: {
        orderId,
        captureId: result.captureId,
        captureStatus: result.captureStatus,
        amount: result.amountValue,
        currency: result.currencyCode,
        product: pending.product,
        cardId: pending.cardId,
        templateId: pending.templateId,
      },
    })
  } catch (error) {
    console.error('PayPal capture error:', error)
    res.status(500).json({ success: false, error: 'تعذر تأكيد الدفع.' })
  }
})

router.post('/batch/consume', async (req, res) => {
  try {
    const orderId = normalizeText(req.body?.orderId, 80)
    const snapshot = req.body?.snapshot
    const names = normalizeNames(req.body?.names)

    if (!orderId || !snapshot || names.length === 0) {
      return res.status(400).json({ success: false, error: 'بيانات الطلب غير مكتملة.' })
    }

    const order = await BatchOrder.findById(orderId)
    if (!order) {
      await logEvent(req, {
        action: 'reject',
        entity: 'order',
        description: 'محاولة استخدام طلب جماعي غير موجود',
        metadata: { eventType: 'invalid_order', orderId },
      })
      return res.status(404).json({ success: false, error: 'الطلب غير موجود.' })
    }

    const combinedPayload = JSON.stringify({ snapshot, names })
    if (hasSuspiciousInput(combinedPayload)) {
      order.attemptCount += 1
      order.lastAttemptAt = new Date()
      await order.save()

      await logEvent(req, {
        userType: 'customer',
        action: 'reject',
        description: 'تم رفض محاولة تحميل ZIP بسبب مدخلات مشبوهة',
        metadata: { eventType: 'injection_attempt', orderId },
      })

      return res.status(400).json({ success: false, error: 'تعذر تجهيز الملف الحالي.' })
    }

    if (order.status === 'consumed' || order.downloadedAt) {
      order.attemptCount += 1
      order.lastAttemptAt = new Date()
      order.lockedReason = 'single_zip_limit'
      await order.save()

      await logEvent(req, {
        userType: 'customer',
        action: 'reject',
        entity: 'order',
        description: 'محاولة تنزيل ZIP ثانية بعد عملية شراء جماعي مكتملة',
        metadata: {
          eventType: 'second_zip_request',
          orderId,
          orderNumber: order.orderNumber,
        },
      })

      return res.status(409).json({
        success: false,
        code: 'ORDER_ALREADY_USED',
        error: BATCH_ZIP_REFUSAL_MESSAGE,
      })
    }

    if (names.length > order.maxRecipients) {
      return res.status(400).json({ success: false, error: `الحد الأقصى لهذه الباقة هو ${order.maxRecipients} اسماً.` })
    }

    const snapshotHash = buildSnapshotHash(snapshot)
    const namesHash = buildNamesHash(names)
    if (snapshotHash !== order.snapshotHash || namesHash !== order.namesHash || names.length !== order.recipientCount) {
      order.attemptCount += 1
      order.lastAttemptAt = new Date()
      await order.save()

      await logEvent(req, {
        userType: 'customer',
        action: 'reject',
        entity: 'order',
        description: 'تم رفض محاولة تعديل بيانات الإرسال الجماعي بعد الدفع',
        metadata: {
          eventType: 'post_payment_batch_mismatch',
          orderId,
          orderNumber: order.orderNumber,
        },
      })

      return res.status(403).json({
        success: false,
        code: 'BATCH_MISMATCH',
        error: 'القائمة/التصميم أصبح نهائياً بعد الدفع ولا يمكن تغييره.',
      })
    }

    order.status = 'consumed'
    order.downloadedAt = new Date()
    order.lastAttemptAt = new Date()
    await order.save()

    Stats.incrementToday('downloads').catch(() => { })

    await logEvent(req, {
      userType: 'customer',
      action: 'download',
      entity: 'order',
      description: `تم تنزيل ZIP للطلب ${order.orderNumber}`,
      metadata: {
        eventType: 'batch_download_success',
        orderId,
        orderNumber: order.orderNumber,
        recipientCount: order.recipientCount,
      },
      success: true,
    })

    res.json({
      success: true,
      message: '🎉 ملف ZIP جاهز! تم تجهيز بطاقات الإرسال الجماعي.',
      data: {
        orderId: order._id,
        downloadedAt: order.downloadedAt,
      },
    })
  } catch (error) {
    console.error('Consume batch order error:', error)
    res.status(500).json({ success: false, error: 'تعذر تجهيز الملف النهائي.' })
  }
})

router.post('/license/activate', authLimiter, async (req, res) => {
  try {
    const code = normalizeText(req.body?.code, 200)
    const deviceId = normalizeText(req.body?.deviceId, 120)

    if (!code || code.length < 6 || !deviceId) {
      return res.status(400).json({ success: false, error: 'بيانات التفعيل غير مكتملة.' })
    }

    const codeHash = hashLicenseCode(code)
    const key = await LicenseKey.findOne({ codeHash })

    if (!key || key.status !== 'new') {
      await logEvent(req, {
        action: 'reject',
        entity: 'license',
        description: 'محاولة تفعيل كود غير صالح أو مستخدم',
        metadata: { eventType: 'invalid_license_code' },
      })
      return res.status(400).json({ success: false, error: 'كود التفعيل غير صحيح أو مستخدم.' })
    }

    key.status = 'activated'
    key.activatedAt = new Date()
    key.activatedDeviceId = deviceId
    key.activatedIp = req.ip
    key.activatedUserAgent = req.headers['user-agent'] || ''
    await key.save()

    const token = jwt.sign(
      {
        type: 'license',
        licenseId: key._id.toString(),
        deviceId,
        maxRecipients: key.maxRecipients,
      },
      LICENSE_JWT_SECRET,
      { expiresIn: '365d' }
    )

    await logEvent(req, {
      userType: 'customer',
      action: 'activate',
      entity: 'license',
      description: 'تم تفعيل كود شركة بنجاح',
      metadata: { eventType: 'license_activated', licenseId: key._id.toString(), maxRecipients: key.maxRecipients },
      success: true,
    })

    res.json({
      success: true,
      message: 'تم تفعيل الكود بنجاح.',
      data: {
        token,
        maxRecipients: key.maxRecipients,
      },
    })
  } catch (error) {
    console.error('License activate error:', error)
    res.status(500).json({ success: false, error: 'تعذر تفعيل الكود حالياً.' })
  }
})

router.get('/license/verify', async (req, res) => {
  try {
    const token = req.headers['x-license-token']
    if (!token) return res.status(401).json({ success: false, error: 'لا يوجد كود مفعل.' })

    let decoded
    try {
      decoded = jwt.verify(token, LICENSE_JWT_SECRET)
    } catch {
      return res.status(401).json({ success: false, error: 'رمز التفعيل غير صالح.' })
    }

    if (!decoded || decoded.type !== 'license' || !decoded.licenseId) {
      return res.status(401).json({ success: false, error: 'رمز التفعيل غير صالح.' })
    }

    const key = await LicenseKey.findById(decoded.licenseId)
    if (!key || key.status !== 'activated') {
      return res.status(401).json({ success: false, error: 'تم إلغاء هذا الكود أو انتهت صلاحيته.' })
    }

    if (key.activatedDeviceId && decoded.deviceId && key.activatedDeviceId !== decoded.deviceId) {
      return res.status(401).json({ success: false, error: 'رمز التفعيل غير صالح على هذا الجهاز.' })
    }

    res.json({
      success: true,
      data: {
        active: true,
        maxRecipients: key.maxRecipients,
      },
    })
  } catch (error) {
    console.error('License verify error:', error)
    res.status(500).json({ success: false, error: 'تعذر التحقق من الكود.' })
  }
})

router.post('/events', async (req, res) => {
  try {
    const eventType = normalizeText(req.body?.eventType, 80)
    const orderId = normalizeText(req.body?.orderId, 80)
    const details = req.body?.details || {}
    const claimedRole = normalizeText(req.body?.claimedRole, 40).toLowerCase()

    if (!eventType) {
      return res.status(400).json({ success: false, error: 'نوع الحدث مطلوب.' })
    }

    const eventDescriptionMap = {
      preview_opened: 'فتح معاينة بطاقة محمية',
      download_before_payment: 'محاولة تحميل قبل الدفع',
      technical_issue_claim: 'ادعاء خطأ تقني من المستخدم',
      injection_attempt: 'محاولة حقن أو أوامر برمجية',
      admin_claim: 'ادعاء صلاحيات أدمن بدون تحقق',
      link_paused_access: 'محاولة دخول عبر لينك شركة موقوف',
      link_expired_access: 'محاولة دخول عبر لينك شركة منتهي',
      printscreen_blocked: 'محاولة Print Screen أثناء المعاينة',
      context_menu_blocked: 'محاولة استخدام الكليك اليمين أثناء المعاينة',
      drag_drop_blocked: 'محاولة سحب أو إفلات أثناء المعاينة',
      save_or_print_blocked: 'محاولة حفظ أو طباعة أثناء المعاينة',
    }

    let resolvedEventType = eventType
    if (claimedRole === 'admin') {
      resolvedEventType = 'admin_claim'
    }

    const securityEvents = ['technical_issue_claim', 'injection_attempt', 'admin_claim']
    const entity = securityEvents.includes(resolvedEventType) ? 'security_event' : 'order'
    const action = ['download_before_payment', 'context_menu_blocked', 'drag_drop_blocked', 'save_or_print_blocked', 'printscreen_blocked'].includes(resolvedEventType)
      ? 'attempt'
      : 'reject'

    await logEvent(req, {
      action,
      entity,
      description: eventDescriptionMap[resolvedEventType] || 'حدث حماية جديد',
      metadata: {
        eventType: resolvedEventType,
        orderId,
        details,
      },
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Protection event logging error:', error)
    res.status(500).json({ success: false, error: 'تعذر تسجيل الحدث.' })
  }
})

export { SUPPORT_CONTACT, SECOND_CARD_REFUSAL_MESSAGE }
export default router
