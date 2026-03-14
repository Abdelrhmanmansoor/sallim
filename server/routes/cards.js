import { Router } from 'express'
import Card from '../models/Card.js'
import Company from '../models/Company.js'
import Stats from '../models/Stats.js'
import { protectCompanyRoute, checkTeamPermission } from './company.js'

const router = Router()

// Create a card
router.post('/', protectCompanyRoute, checkTeamPermission('createCards'), async (req, res) => {
  try {
    const {
      mainText,
      subText,
      senderName,
      recipientName,
      templateId,
      theme,
      font,
      fontSize,
      textColor,
    } = req.body

    if (!mainText || !templateId) {
      return res.status(400).json({ success: false, error: 'mainText و templateId مطلوبين' })
    }

    // Get company from authenticated session (set by protectCompanyRoute)
    const company = req.company

    if (!company) {
      return res.status(401).json({ success: false, error: 'تسجيل الدخول مطلوب' })
    }

    // Check if subscription is active
    if (!company.subscription.isActive || new Date(company.subscription.expiresAt) < new Date()) {
      return res.status(403).json({ 
        success: false, 
        error: 'انتهت صلاحية الاشتراك. يرجى التواصل مع الإدارة' 
      })
    }

    // Check card limit (0 = unlimited)
    if (company.cardsLimit > 0 && company.cardsUsed >= company.cardsLimit) {
      return res.status(403).json({ 
        success: false, 
        error: `تم استنفاد رصيد البطاقات (${company.cardsLimit}). يرجى ترقية الباقة` 
      })
    }

    const card = await Card.create({
      mainText: mainText.slice(0, 500),
      subText: (subText || '').slice(0, 500),
      senderName: (senderName || '').slice(0, 100),
      recipientName: (recipientName || '').slice(0, 100),
      templateId,
      theme: theme || 'golden',
      font: font || 'cairo',
      fontSize: fontSize || 42,
      textColor: textColor || '#ffffff',
      createdByIp: req.ip,
      company: company._id,
    })

    // Increment authenticated company usage
    await Company.findByIdAndUpdate(company._id, {
      $inc: { 
        cardsUsed: 1,
        'usage.cardsThisMonth': 1 
      }
    })

    await Stats.incrementToday('cardsCreated')

    res.status(201).json({
      success: true,
      data: {
        shareId: card.shareId,
        shareUrl: `${process.env.CLIENT_URL || ''}/card/${card.shareId}`,
        createdAt: card.createdAt,
      },
    })
  } catch (error) {
    console.error('Card creation error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في إنشاء البطاقة' })
  }
})

// Get card by Mongo ID for checkout/editor flows
router.get('/id/:cardId', async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId)

    if (!card || card.status !== 'active') {
      return res.status(404).json({ success: false, error: 'البطاقة غير موجودة' })
    }

    res.json({
      success: true,
      data: {
        _id: card._id,
        name: card.mainText || card.recipientName || 'بطاقة رقمية',
        image: card.image || '',
        price: Number(card.price || 0),
        templateId: card.templateId,
        shareId: card.shareId,
      },
    })
  } catch (error) {
    console.error('Card by id fetch error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ' })
  }
})

// Get public stats
router.get('/public/stats', async (req, res) => {
  try {
    const totalCards = await Card.countDocuments({ status: 'active' })
    const totalViews = await Card.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$viewCount' } } },
    ])

    res.json({
      success: true,
      data: {
        totalCards,
        totalViews: totalViews[0]?.total || 0,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'حدث خطأ' })
  }
})

// Admin: Get all cards
router.get('/admin/all', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({ success: false, error: 'غير مصرح لك بالوصول' })
    }

    const cards = await Card.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(100)

    res.json({
      success: true,
      data: cards,
    })
  } catch (error) {
    console.error('Admin fetch error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في النظام' })
  }
})

// Get card by shareId
router.get('/:shareId', async (req, res) => {
  try {
    const card = await Card.findOne({
      shareId: req.params.shareId,
      status: 'active',
    })

    if (!card) {
      return res.status(404).json({ success: false, error: 'البطاقة غير موجودة' })
    }

    card.viewCount += 1
    card.save().catch(() => {})
    Stats.incrementToday('cardViews').catch(() => {})

    res.json({
      success: true,
      data: {
        mainText: card.mainText,
        subText: card.subText,
        senderName: card.senderName,
        recipientName: card.recipientName,
        templateId: card.templateId,
        theme: card.theme,
        font: card.font,
        fontSize: card.fontSize,
        textColor: card.textColor,
        viewCount: card.viewCount,
        createdAt: card.createdAt,
      },
    })
  } catch (error) {
    console.error('Card fetch error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ' })
  }
})

export default router
