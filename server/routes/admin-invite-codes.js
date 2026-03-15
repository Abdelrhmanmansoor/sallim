import { Router } from 'express'
import crypto from 'crypto'
import InviteCode from '../models/InviteCode.js'
import User from '../models/User.js'
import AuditLog from '../models/AuditLog.js'

const router = Router()

// ═══ Create Invite Code ═══
router.post('/generate', async (req, res) => {
  try {
    const { companyName, companyEmail, expirationDays = 7, features, initialCredits, createdBy } = req.body

    if (!companyName || !companyEmail || !createdBy) {
      return res.status(400).json({ success: false, error: 'البيانات مطلوبة: companyName, companyEmail, createdBy' })
    }

    // Generate unique code
    const code = 'SALLIM-' + crypto.randomBytes(8).toString('hex').toUpperCase()
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + expirationDays)

    const isBatchCode = features && features.includes('batch_templates') && !(features.includes('company_registration'))
    const inviteCode = await InviteCode.create({
      code,
      companyName,
      companyEmail: companyEmail.toLowerCase(),
      expirationDate,
      features: features || ['basic_templates'],
      initialCredits: initialCredits || 0,
      createdBy,
      status: isBatchCode ? 'activated' : 'generated'
    })

    // Log action
    await AuditLog.create({
      user: createdBy,
      userType: 'super_admin',
      action: 'create',
      entity: 'invite_code',
      entityId: inviteCode._id,
      description: `إنشاء كود اشتراك للشركة: ${companyName}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم إنشاء الكود بنجاح',
      data: inviteCode
    })
  } catch (error) {
    console.error('Generate invite code error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في إنشاء الكود' })
  }
})

// ═══ Get All Invite Codes ═══
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query

    const query = {}
    if (status) query.status = status
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { companyEmail: { $regex: search, $options: 'i' } }
      ]
    }

    const inviteCodes = await InviteCode
      .find(query)
      .populate('createdBy', 'name email')
      .populate('activatedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await InviteCode.countDocuments(query)

    res.json({
      success: true,
      data: {
        inviteCodes,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get invite codes error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب الأكواد' })
  }
})

// ═══ Stats Summary (must be before /:id) ═══
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await InviteCode.countDocuments()
    const generated = await InviteCode.countDocuments({ status: 'generated' })
    const sent = await InviteCode.countDocuments({ status: 'sent' })
    const activated = await InviteCode.countDocuments({ status: 'activated' })
    const expired = await InviteCode.countDocuments({ status: 'expired' })
    const revoked = await InviteCode.countDocuments({ status: 'revoked' })

    res.json({
      success: true,
      data: {
        total,
        generated,
        sent,
        activated,
        expired,
        revoked,
        activationRate: total > 0 ? Math.round((activated / total) * 100) : 0
      }
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب الإحصائيات' })
  }
})

// ═══ Get Single Invite Code ═══
router.get('/:id', async (req, res) => {
  try {
    const inviteCode = await InviteCode
      .findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('activatedBy', 'name email')

    if (!inviteCode) {
      return res.status(404).json({ success: false, error: 'الكود غير موجود' })
    }

    res.json({
      success: true,
      data: inviteCode
    })
  } catch (error) {
    console.error('Get invite code error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب الكود' })
  }
})

// ═══ Update Invite Code ═══
router.put('/:id', async (req, res) => {
  try {
    const { companyName, companyEmail, expirationDate, features, initialCredits, status } = req.body

    const inviteCode = await InviteCode.findById(req.params.id)
    if (!inviteCode) {
      return res.status(404).json({ success: false, error: 'الكود غير موجود' })
    }

    const updates = {}
    if (companyName) updates.companyName = companyName
    if (companyEmail) updates.companyEmail = companyEmail.toLowerCase()
    if (expirationDate) updates.expirationDate = new Date(expirationDate)
    if (features) updates.features = features
    if (initialCredits !== undefined) updates.initialCredits = initialCredits
    if (status) updates.status = status

    const updated = await InviteCode.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('createdBy', 'name email')

    // Log action
    await AuditLog.create({
      user: req.body.updatedBy,
      userType: 'super_admin',
      action: 'update',
      entity: 'invite_code',
      entityId: inviteCode._id,
      description: `تحديث كود اشتراك: ${inviteCode.code}`,
      changes: { before: inviteCode.toObject(), after: updated.toObject() },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم تحديث الكود بنجاح',
      data: updated
    })
  } catch (error) {
    console.error('Update invite code error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في تحديث الكود' })
  }
})

// ═══ Delete Invite Code ═══
router.delete('/:id', async (req, res) => {
  try {
    const inviteCode = await InviteCode.findById(req.params.id)
    if (!inviteCode) {
      return res.status(404).json({ success: false, error: 'الكود غير موجود' })
    }

    if (inviteCode.status === 'activated') {
      return res.status(400).json({ success: false, error: 'لا يمكن حذف كود مفعل بالفعل' })
    }

    await InviteCode.findByIdAndDelete(req.params.id)

    // Log action
    await AuditLog.create({
      user: req.body.deletedBy,
      userType: 'super_admin',
      action: 'delete',
      entity: 'invite_code',
      entityId: inviteCode._id,
      description: `حذف كود اشتراك: ${inviteCode.code}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم حذف الكود بنجاح'
    })
  } catch (error) {
    console.error('Delete invite code error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في حذف الكود' })
  }
})

// ═══ Resend Invite Code ═══
router.post('/:id/resend', async (req, res) => {
  try {
    const inviteCode = await InviteCode.findById(req.params.id)
    if (!inviteCode) {
      return res.status(404).json({ success: false, error: 'الكود غير موجود' })
    }

    if (inviteCode.status === 'activated') {
      return res.status(400).json({ success: false, error: 'هذا الكود مفعل بالفعل' })
    }

    if (inviteCode.status === 'expired') {
      // Update expiration
      const newExpiration = new Date()
      newExpiration.setDate(newExpiration.getDate() + 7)
      inviteCode.expirationDate = newExpiration
    }

    inviteCode.status = 'sent'
    await inviteCode.save()

    // TODO: Send email with the code
    // await sendInviteEmail(inviteCode.companyEmail, inviteCode.code)

    // Log action
    await AuditLog.create({
      user: req.body.sentBy,
      userType: 'super_admin',
      action: 'send',
      entity: 'invite_code',
      entityId: inviteCode._id,
      description: `إعادة إرسال كود اشتراك: ${inviteCode.code}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم إرسال الكود بنجاح',
      data: {
        code: inviteCode.code,
        email: inviteCode.companyEmail,
        expirationDate: inviteCode.expirationDate
      }
    })
  } catch (error) {
    console.error('Resend invite code error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في إرسال الكود' })
  }
})

// ═══ Public: Check batch code by code string ═══
router.get('/public/check/:code', async (req, res) => {
  try {
    const inviteCode = await InviteCode.findOne({ code: req.params.code })
    if (!inviteCode) {
      return res.status(404).json({ success: false, error: 'الكود غير موجود' })
    }
    const isExpired = new Date() > inviteCode.expirationDate
    res.json({
      success: true,
      data: {
        code: inviteCode.code,
        companyName: inviteCode.companyName,
        status: inviteCode.status,
        features: inviteCode.features,
        initialCredits: inviteCode.initialCredits,
        expirationDate: inviteCode.expirationDate,
        isExpired,
        isBatch: inviteCode.features.includes('batch_templates') && !inviteCode.features.includes('company_registration')
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'حدث خطأ' })
  }
})

export default router