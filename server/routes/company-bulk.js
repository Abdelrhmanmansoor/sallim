import { Router } from 'express'
import Card from '../models/Card.js'
import CardCampaign from '../models/CardCampaign.js'
import Company from '../models/Company.js'
import Theme from '../models/Theme.js'
import AuditLog from '../models/AuditLog.js'
import { protectCompanyRoute, checkTeamPermission } from './company.js'
import crypto from 'crypto'
import csv from 'csv-parser'
import multer from 'multer'
import fs from 'fs'

const router = Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/bulk/'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      cb(null, true)
    } else {
      cb(new Error('Only CSV and Excel files are allowed'))
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

// Helper: Generate unique token
function generateUniqueToken() {
  return crypto.randomBytes(32).toString('hex')
}

// Helper: Parse CSV file
async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error))
  })
}

// ═══ Upload and Parse Recipients File ═══
router.post('/upload-recipients', protectCompanyRoute, checkTeamPermission('createCampaigns'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'يجب رفع ملف' })
    }

    const recipients = await parseCSV(req.file.path)

    // Validate required fields
    const validRecipients = recipients.filter(rec => {
      return rec.name && (rec.phone || rec.email)
    })

    if (validRecipients.length === 0) {
      fs.unlinkSync(req.file.path)
      return res.status(400).json({ 
        success: false, 
        error: 'لم يتم العثور على بيانات صالحة. يجب أن يحتوي الملف على عمود "name" و "phone" أو "email"' 
      })
    }

    // Delete uploaded file after parsing
    fs.unlinkSync(req.file.path)

    res.json({
      success: true,
      data: {
        totalRecipients: recipients.length,
        validRecipients: validRecipients.length,
        recipients: validRecipients
      }
    })
  } catch (error) {
    console.error('Upload recipients error:', error)
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    res.status(500).json({ success: false, error: 'حدث خطأ في معالجة الملف' })
  }
})

// ═══ Bulk Send Cards ═══
router.post('/bulk-send', protectCompanyRoute, checkTeamPermission('createCampaigns'), async (req, res) => {
  const session = await Card.startSession()
  session.startTransaction()

  try {
    const { 
      recipients, 
      themeId, 
      templateId, 
      message, 
      senderName,
      sendVia = 'whatsapp' 
    } = req.body

    // Get company from authenticated session
    const company = req.company

    if (!company) {
      await session.abortTransaction()
      return res.status(401).json({ success: false, error: 'تسجيل الدخول مطلوب' })
    }

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      await session.abortTransaction()
      return res.status(400).json({ success: false, error: 'بيانات ناقصة' })
    }

    // Check company subscription and limits
    if (!company.subscription.isActive || new Date(company.subscription.expiresAt) < new Date()) {
      await session.abortTransaction()
      return res.status(403).json({ 
        success: false, 
        error: 'انتهت صلاحية الاشتراك. يرجى التجديد' 
      })
    }

    // Check card limit
    const cardsAvailable = company.cardsLimit === 0 ? Infinity : company.cardsLimit - company.cardsUsed
    if (cardsAvailable < recipients.length) {
      await session.abortTransaction()
      return res.status(403).json({ 
        success: false, 
        error: `رصيد غير كافٍ. متبقي ${cardsAvailable} بطاقة فقط` 
      })
    }

    // Verify theme is allowed for this company
    const theme = await Theme.findById(themeId).session(session)
    if (!theme) {
      await session.abortTransaction()
      return res.status(404).json({ success: false, error: 'الثيم غير موجود' })
    }

    // Check if theme is accessible to this company
    if (theme.status === 'exclusive') {
      const hasAccess = theme.exclusiveCompanies.some(
        compId => compId.toString() === company._id.toString()
      ) || company.allowedThemeIds.some(
        themeIdRef => themeIdRef.toString() === themeId
      )
      
      if (!hasAccess) {
        await session.abortTransaction()
        return res.status(403).json({ 
          success: false, 
          error: 'ليس لديك صلاحية لاستخدام هذا الثيم' 
        })
      }
    } else if (theme.status === 'hidden') {
      await session.abortTransaction()
      return res.status(403).json({ 
        success: false, 
        error: 'هذا الثيم غير متاح' 
      })
    }

    // Create campaign
    const campaign = await CardCampaign.create([{
      company: company._id,
      name: `حملة ${new Date().toLocaleDateString('ar-SA')}`,
      recipients: recipients.map(r => r.name),
      message,
      themeId,
      stats: {
        totalRecipients: recipients.length,
        sent: 0,
        delivered: 0,
        opened: 0,
        failed: 0
      },
      status: 'in_progress'
    }], { session })

    const campaignId = campaign[0]._id

    // Create cards for each recipient
    const cards = []
    const now = new Date()

    for (const recipient of recipients) {
      const uniqueToken = generateUniqueToken()
      const card = await Card.create([{
        company: company._id,
        campaign: campaignId,
        recipientName: recipient.name,
        recipientData: {
          phone: recipient.phone,
          email: recipient.email,
          name: recipient.name
        },
        mainText: message || `عيدكم مبارك ${recipient.name}`,
        senderName,
        templateId,
        theme: theme.name,
        uniqueToken,
        sentAt: now,
        deliveryStatus: 'pending',
        status: 'active'
      }], { session })

      cards.push({
        cardId: card[0]._id,
        recipientName: recipient.name,
        phone: recipient.phone,
        email: recipient.email,
        token: uniqueToken,
        cardUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/card/${card[0].shareId}?token=${uniqueToken}`
      })
    }

    // Update company usage
    company.cardsUsed += recipients.length
    company.usage.cardsThisMonth += recipients.length
    await company.save({ session })

    await session.commitTransaction()

    // Log action
    await AuditLog.create({
      user: company._id,
      userType: 'company',
      action: 'bulk_send',
      entity: 'card_campaign',
      entityId: campaignId,
      description: `إرسال ${recipients.length} بطاقة بالجملة`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: `تم إنشاء ${recipients.length} بطاقة بنجاح`,
      data: {
        campaignId,
        totalCards: recipients.length,
        cardsSent: cards.length,
        cards: cards,
        campaign: await CardCampaign.findById(campaignId)
      }
    })
  } catch (error) {
    await session.abortTransaction()
    console.error('Bulk send error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في الإرسال بالجملة' })
  }
})

// ═══ Get Campaign Report ═══
router.get('/campaign/:id/report', async (req, res) => {
  try {
    const { companyId } = req.query
    const campaignId = req.params.id

    const campaign = await CardCampaign
      .findById(campaignId)
      .populate('company', 'name')

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'الحملة غير موجودة' })
    }

    // Verify company access
    if (campaign.company._id.toString() !== companyId) {
      return res.status(403).json({ success: false, error: 'غير مصرح بالوصول لهذه الحملة' })
    }

    // Get all cards for this campaign
    const cards = await Card.find({ campaign: campaignId })

    const report = {
      campaignId: campaign._id,
      campaignName: campaign.name,
      createdAt: campaign.createdAt,
      totalRecipients: campaign.stats.totalRecipients,
      stats: campaign.stats,
      cards: cards.map(card => ({
        cardId: card._id,
        recipientName: card.recipientName,
        phone: card.recipientData.phone,
        email: card.recipientData.email,
        sentAt: card.sentAt,
        openedAt: card.openedAt,
        deliveryStatus: card.deliveryStatus,
        viewCount: card.viewCount,
        cardUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/card/${card.shareId}`
      }))
    }

    res.json({
      success: true,
      data: report
    })
  } catch (error) {
    console.error('Get campaign report error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب تقرير الحملة' })
  }
})

// ═══ Mark Card as Opened ═══
router.post('/card/:token/opened', async (req, res) => {
  try {
    const { token } = req.params

    const card = await Card.findOne({ uniqueToken: token })
    if (!card) {
      return res.status(404).json({ success: false, error: 'البطاقة غير موجودة' })
    }

    // Update card opened status
    if (!card.openedAt) {
      card.openedAt = new Date()
      card.deliveryStatus = 'opened'
      await card.save()

      // Update campaign stats
      if (card.campaign) {
        await CardCampaign.findByIdAndUpdate(
          card.campaign,
          { $inc: { 'stats.opened': 1 } }
        )
      }
    }

    res.json({
      success: true,
      data: {
        cardId: card._id,
        recipientName: card.recipientName
      }
    })
  } catch (error) {
    console.error('Mark card opened error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ' })
  }
})

// ═══ Get Company Cards Report with Filters ═══
router.get('/report', async (req, res) => {
  try {
    const { 
      companyId, 
      status = 'all', 
      deliveryStatus = 'all',
      startDate, 
      endDate,
      page = 1, 
      limit = 50 
    } = req.query

    const query = { company: companyId }

    if (status !== 'all') {
      query.status = status
    }

    if (deliveryStatus !== 'all') {
      query.deliveryStatus = deliveryStatus
    }

    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }

    const cards = await Card
      .find(query)
      .populate('campaign', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Card.countDocuments(query)

    // Calculate stats
    const stats = await Card.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalCards: { $sum: 1 },
          sent: { $sum: { $cond: [{ $eq: ['$deliveryStatus', 'sent'] }, 1, 0] } },
          opened: { $sum: { $cond: [{ $eq: ['$deliveryStatus', 'opened'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$deliveryStatus', 'failed'] }, 1, 0] } },
          totalViews: { $sum: '$viewCount' }
        }
      }
    ])

    res.json({
      success: true,
      data: {
        cards,
        stats: stats[0] || {
          totalCards: 0,
          sent: 0,
          opened: 0,
          failed: 0,
          totalViews: 0
        },
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get cards report error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب التقرير' })
  }
})

// ═══ Export Report to CSV ═══
router.get('/export/csv', async (req, res) => {
  try {
    const { companyId, campaignId, startDate, endDate } = req.query

    const query = { company: companyId }
    if (campaignId) query.campaign = campaignId
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }

    const cards = await Card.find(query).sort({ createdAt: -1 })

    // Generate CSV content
    let csvContent = 'اسم المستلم,رقم الهاتف,البريد الإلكتروني,حالة التسليم,تم الفتح,عدد المشاهدات,وقت الإرسال,وقت الفتح,رابط البطاقة\n'

    cards.forEach(card => {
      csvContent += `${card.recipientName},${card.recipientData.phone || ''},${card.recipientData.email || ''},${card.deliveryStatus},${card.openedAt ? 'نعم' : 'لا'},${card.viewCount},${card.sentAt ? card.sentAt.toLocaleDateString('ar-SA') : ''},${card.openedAt ? card.openedAt.toLocaleDateString('ar-SA') : ''},${process.env.FRONTEND_URL || 'http://localhost:5173'}/card/${card.shareId}\n`
    })

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="report-${new Date().toISOString().split('T')[0]}.csv"`)
    res.send(csvContent)
  } catch (error) {
    console.error('Export CSV error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في تصدير التقرير' })
  }
})

export default router