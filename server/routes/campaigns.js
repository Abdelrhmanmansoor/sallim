import { Router } from 'express'
import CardCampaign from '../models/CardCampaign.js'
import Card from '../models/Card.js'
import { protectCompanyRoute } from './company.js'
import AuditLog from '../models/AuditLog.js'

const router = Router()

// ═══ Create Campaign ═══
router.post('/', protectCompanyRoute, async (req, res) => {
  try {
    const { name, description, cardIds, sentVia, scheduledFor, tags } = req.body

    if (!name || !cardIds || !Array.isArray(cardIds)) {
      return res.status(400).json({ 
        success: false, 
        error: 'الاسم وقائمة البطاقات مطلوبة' 
      })
    }

    // Verify cards belong to company
    const cards = await Card.find({ 
      _id: { $in: cardIds },
      company: req.company._id 
    })

    if (cards.length !== cardIds.length) {
      return res.status(400).json({ 
        success: false, 
        error: 'بعض البطاقات غير موجودة أو لا تنتمي لهذه الشركة' 
      })
    }

    const campaign = await CardCampaign.create({
      company: req.company._id,
      name,
      description,
      cards: cardIds,
      totalCards: cardIds.length,
      sentVia: sentVia || 'manual',
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      tags: tags || [],
      status: scheduledFor ? 'scheduled' : 'draft'
    })

    // Update cards with campaign reference
    await Card.updateMany(
      { _id: { $in: cardIds } },
      { campaign: campaign._id }
    )

    // Log action
    await AuditLog.create({
      user: req.company._id,
      userType: 'company_admin',
      action: 'create',
      entity: 'campaign',
      entityId: campaign._id,
      description: `إنشاء حملة: ${name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحملة بنجاح',
      data: campaign
    })
  } catch (error) {
    console.error('Create campaign error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في إنشاء الحملة' })
  }
})

// ═══ Get All Campaigns ═══
router.get('/', protectCompanyRoute, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, sentVia } = req.query

    const query = { company: req.company._id }
    if (status) query.status = status
    if (sentVia) query.sentVia = sentVia

    const campaigns = await CardCampaign
      .find(query)
      .populate('cards', 'mainText recipientName viewCount')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await CardCampaign.countDocuments(query)

    res.json({
      success: true,
      data: {
        campaigns,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get campaigns error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب الحملات' })
  }
})

// ═══ Get Single Campaign ═══
router.get('/:id', protectCompanyRoute, async (req, res) => {
  try {
    const campaign = await CardCampaign
      .findOne({ _id: req.params.id, company: req.company._id })
      .populate('cards')

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'الحملة غير موجودة' })
    }

    // Recalculate click rate
    campaign.calculateClickRate()

    res.json({
      success: true,
      data: campaign
    })
  } catch (error) {
    console.error('Get campaign error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب الحملة' })
  }
})

// ═══ Get Campaign Analytics ═══
router.get('/:id/analytics', protectCompanyRoute, async (req, res) => {
  try {
    const campaign = await CardCampaign.findOne({ 
      _id: req.params.id, 
      company: req.company._id 
    })

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'الحملة غير موجودة' })
    }

    // Get detailed analytics from cards
    const cards = await Card.find({ 
      campaign: campaign._id 
    }).select('viewCount detailedViews shares')

    const uniqueViewers = new Set()
    cards.forEach(card => {
      card.detailedViews?.forEach(view => {
        if (view.ip) uniqueViewers.add(view.ip)
      })
    })

    const topViewingHours = campaign.stats.viewsByHour
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const topViewingDays = campaign.stats.viewsByDay
      .sort((a, b) => b.count - a.count)
      .slice(0, 7)

    res.json({
      success: true,
      data: {
        campaign,
        stats: campaign.stats,
        uniqueViewers: uniqueViewers.size,
        topViewingHours,
        topViewingDays,
        avgViewsPerCard: campaign.stats.totalViews / campaign.totalCards,
        engagementRate: campaign.totalCards > 0 
          ? (campaign.stats.uniqueViews / campaign.totalCards) * 100 
          : 0
      }
    })
  } catch (error) {
    console.error('Get campaign analytics error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب التحليلات' })
  }
})

// ═══ Update Campaign ═══
router.put('/:id', protectCompanyRoute, async (req, res) => {
  try {
    const { name, description, scheduledFor, status, tags } = req.body

    const campaign = await CardCampaign.findOne({ 
      _id: req.params.id, 
      company: req.company._id 
    })

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'الحملة غير موجودة' })
    }

    if (campaign.status === 'sent' || campaign.status === 'completed') {
      return res.status(400).json({ 
        success: false, 
        error: 'لا يمكن تعديل حملة مرسلة' 
      })
    }

    const updates = {}
    if (name) updates.name = name
    if (description !== undefined) updates.description = description
    if (scheduledFor) updates.scheduledFor = new Date(scheduledFor)
    if (status && ['draft', 'scheduled'].includes(status)) updates.status = status
    if (tags) updates.tags = tags

    const updated = await CardCampaign.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    )

    // Log action
    await AuditLog.create({
      user: req.company._id,
      userType: 'company_admin',
      action: 'update',
      entity: 'campaign',
      entityId: campaign._id,
      description: `تحديث حملة: ${campaign.name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم تحديث الحملة بنجاح',
      data: updated
    })
  } catch (error) {
    console.error('Update campaign error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في تحديث الحملة' })
  }
})

// ═══ Send Campaign via WhatsApp (Placeholder) ═══
router.post('/:id/send-whatsapp', protectCompanyRoute, async (req, res) => {
  try {
    const campaign = await CardCampaign.findOne({ 
      _id: req.params.id, 
      company: req.company._id 
    })

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'الحملة غير موجودة' })
    }

    if (campaign.status === 'sent' || campaign.status === 'completed') {
      return res.status(400).json({ 
        success: false, 
        error: 'الحملة مرسلة بالفعل' 
      })
    }

    // TODO: Implement WhatsApp API integration
    // For now, mark as sent (placeholder)
    
    campaign.status = 'sent'
    campaign.sentAt = new Date()
    await campaign.save()

    // Log action
    await AuditLog.create({
      user: req.company._id,
      userType: 'company_admin',
      action: 'send',
      entity: 'campaign',
      entityId: campaign._id,
      description: `إرسال حملة واتساب: ${campaign.name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: '📱 إرسال WhatsApp قيد التطوير - سيتم إطلاقه قريباً',
      data: campaign
    })
  } catch (error) {
    console.error('Send campaign error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في إرسال الحملة' })
  }
})

// ═══ Delete Campaign ═══
router.delete('/:id', protectCompanyRoute, async (req, res) => {
  try {
    const campaign = await CardCampaign.findOne({ 
      _id: req.params.id, 
      company: req.company._id 
    })

    if (!campaign) {
      return res.status(404).json({ success: false, error: 'الحملة غير موجودة' })
    }

    await CardCampaign.findByIdAndDelete(req.params.id)

    // Remove campaign reference from cards
    await Card.updateMany(
      { campaign: req.params.id },
      { $unset: { campaign: 1 } }
    )

    // Log action
    await AuditLog.create({
      user: req.company._id,
      userType: 'company_admin',
      action: 'delete',
      entity: 'campaign',
      entityId: campaign._id,
      description: `حذف حملة: ${campaign.name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم حذف الحملة بنجاح'
    })
  } catch (error) {
    console.error('Delete campaign error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في حذف الحملة' })
  }
})

export default router