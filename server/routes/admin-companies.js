import { Router } from 'express'
import Company from '../models/Company.js'
import Wallet from '../models/Wallet.js'
import Transaction from '../models/Transaction.js'
import Card from '../models/Card.js'
import CardCampaign from '../models/CardCampaign.js'
import AuditLog from '../models/AuditLog.js'
import isAdmin from '../middleware/adminAuth.js'

const router = Router()

// Protect all routes in this file
router.use(isAdmin)

// ═══ Get All Companies ═══
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search, plan } = req.query

    const query = {}
    if (status) query.status = status
    if (plan) query['subscription.plan'] = plan
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const companies = await Company
      .find(query)
      .populate('wallet')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Company.countDocuments(query)

    res.json({
      success: true,
      data: {
        companies,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get companies error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب الشركات' })
  }
})

// ═══ Get Company Details ═══
router.get('/:id', async (req, res) => {
  try {
    const company = await Company
      .findById(req.params.id)
      .populate('wallet')
      .populate('teamMembers')
      .populate('customTemplates')

    if (!company) {
      return res.status(404).json({ success: false, error: 'الشركة غير موجودة' })
    }

    // Get additional stats
    const cardsCount = await Card.countDocuments({ company: company._id })
    const campaignsCount = await CardCampaign.countDocuments({ company: company._id })
    const transactions = await Transaction.find({ company: company._id }).countDocuments()

    res.json({
      success: true,
      data: {
        company,
        stats: {
          cardsCount,
          campaignsCount,
          transactionsCount: transactions
        }
      }
    })
  } catch (error) {
    console.error('Get company error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب بيانات الشركة' })
  }
})

// ═══ Update Company Status ═══
router.put('/:id/status', async (req, res) => {
  try {
    const { status, updatedBy } = req.body

    if (!status || !['pending', 'active', 'suspended'].includes(status)) {
      return res.status(400).json({ success: false, error: 'حالة غير صحيحة' })
    }

    const company = await Company.findById(req.params.id)
    if (!company) {
      return res.status(404).json({ success: false, error: 'الشركة غير موجودة' })
    }

    const oldStatus = company.status
    company.status = status
    await company.save()

    // Log action
    await AuditLog.create({
      user: updatedBy,
      userType: 'super_admin',
      action: status === 'active' ? 'activate' : 'deactivate',
      entity: 'company',
      entityId: company._id,
      description: `تغيير حالة شركة ${company.name} من ${oldStatus} إلى ${status}`,
      changes: { before: { status: oldStatus }, after: { status } },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم تحديث الحالة بنجاح',
      data: company
    })
  } catch (error) {
    console.error('Update company status error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في تحديث الحالة' })
  }
})

// ═══ Update Company Features ═══
router.put('/:id/features', async (req, res) => {
  try {
    const { features, updatedBy } = req.body

    if (!Array.isArray(features)) {
      return res.status(400).json({ success: false, error: 'الميزات يجب أن تكون مصفوفة' })
    }

    const company = await Company.findById(req.params.id)
    if (!company) {
      return res.status(404).json({ success: false, error: 'الشركة غير موجودة' })
    }

    const oldFeatures = [...company.features]
    company.features = features
    await company.save()

    // Log action
    await AuditLog.create({
      user: updatedBy,
      userType: 'super_admin',
      action: 'update',
      entity: 'company',
      entityId: company._id,
      description: `تحديث ميزات شركة ${company.name}`,
      changes: { before: { features: oldFeatures }, after: { features } },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم تحديث الميزات بنجاح',
      data: company
    })
  } catch (error) {
    console.error('Update company features error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في تحديث الميزات' })
  }
})

// ═══ Add Credits to Company Wallet ═══
router.post('/:id/credits', async (req, res) => {
  const session = await Company.startSession()
  session.startTransaction()

  try {
    const { amount, reason, addedBy } = req.body

    if (!amount || amount <= 0) {
      await session.abortTransaction()
      return res.status(400).json({ success: false, error: 'المبلغ يجب أن يكون أكبر من صفر' })
    }

    const company = await Company.findById(req.params.id).session(session)
    if (!company) {
      await session.abortTransaction()
      return res.status(404).json({ success: false, error: 'الشركة غير موجودة' })
    }

    // Get or create wallet
    let wallet = await Wallet.findOne({ company: company._id }).session(session)
    if (!wallet) {
      wallet = await Wallet.create([{ company: company._id, balance: amount }], { session })
      wallet = wallet[0]
    } else {
      wallet.balance += amount
      await wallet.save({ session })
    }

    // Record transaction
    await Transaction.create([{
      company: company._id,
      wallet: wallet._id,
      type: 'credit',
      amount,
      description: reason || 'إضافة رصيد من الإدارة',
      category: 'admin_deposit'
    }], { session })

    await session.commitTransaction()

    // Log action
    await AuditLog.create({
      user: addedBy,
      userType: 'super_admin',
      action: 'create',
      entity: 'transaction',
      description: `إضافة رصيد ${amount} لشركة ${company.name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تمت إضافة الرصيد بنجاح',
      data: {
        newBalance: wallet.balance,
        addedAmount: amount
      }
    })
  } catch (error) {
    await session.abortTransaction()
    console.error('Add credits error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في إضافة الرصيد' })
  }
})

// ═══ Update Company Subscription ═══
router.put('/:id/subscription', async (req, res) => {
  try {
    const { plan, startDate, renewalDate, limits, updatedBy } = req.body

    const company = await Company.findById(req.params.id)
    if (!company) {
      return res.status(404).json({ success: false, error: 'الشركة غير موجودة' })
    }

    const oldSubscription = { ...company.subscription.toObject() }

    if (plan) company.subscription.plan = plan
    if (startDate) company.subscription.startDate = new Date(startDate)
    if (renewalDate) company.subscription.renewalDate = new Date(renewalDate)
    if (limits) company.subscription.limits = { ...company.subscription.limits, ...limits }

    await company.save()

    // Log action
    await AuditLog.create({
      user: updatedBy,
      userType: 'super_admin',
      action: 'update',
      entity: 'company',
      entityId: company._id,
      description: `تحديث اشتراك شركة ${company.name}`,
      changes: { before: { subscription: oldSubscription }, after: { subscription: company.subscription } },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم تحديث الاشتراك بنجاح',
      data: company
    })
  } catch (error) {
    console.error('Update subscription error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في تحديث الاشتراك' })
  }
})

// ═══ Get Company Analytics ═══
router.get('/:id/analytics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query

    const dateFilter = {}
    if (startDate) dateFilter.$gte = new Date(startDate)
    if (endDate) dateFilter.$lte = new Date(endDate)

    const company = await Company.findById(req.params.id)
    if (!company) {
      return res.status(404).json({ success: false, error: 'الشركة غير موجودة' })
    }

    // Get cards stats
    const cardsCreated = await Card.countDocuments({
      company: company._id,
      createdAt: dateFilter
    })

    const totalViews = await Card.aggregate([
      { $match: { company: company._id, createdAt: dateFilter } },
      { $group: { _id: null, total: { $sum: '$viewCount' } } }
    ])

    // Get campaigns stats
    const campaigns = await CardCampaign.find({
      company: company._id,
      createdAt: dateFilter
    })

    const totalCampaignViews = campaigns.reduce((sum, c) => sum + c.stats.totalViews, 0)

    // Get wallet transactions
    const transactions = await Transaction.find({
      company: company._id,
      createdAt: dateFilter
    })

    const totalSpent = transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0)

    res.json({
      success: true,
      data: {
        cardsCreated,
        totalViews: totalViews[0]?.total || 0,
        campaigns: campaigns.length,
        totalCampaignViews,
        totalSpent,
        walletBalance: company.wallet?.balance || 0
      }
    })
  } catch (error) {
    console.error('Get company analytics error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب التحليلات' })
  }
})

// ═══ Delete Company (Soft Delete) ═══
router.delete('/:id', async (req, res) => {
  try {
    const { deletedBy } = req.body

    const company = await Company.findById(req.params.id)
    if (!company) {
      return res.status(404).json({ success: false, error: 'الشركة غير موجودة' })
    }

    company.status = 'suspended'
    await company.save()

    // Log action
    await AuditLog.create({
      user: deletedBy,
      userType: 'super_admin',
      action: 'delete',
      entity: 'company',
      entityId: company._id,
      description: `تعليق حساب شركة ${company.name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم تعليق الشركة بنجاح'
    })
  } catch (error) {
    console.error('Delete company error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في تعليق الشركة' })
  }
})

export default router