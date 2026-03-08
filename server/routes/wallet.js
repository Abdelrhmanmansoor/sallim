import { Router } from 'express'
import Wallet from '../models/Wallet.js'
import Transaction from '../models/Transaction.js'
import Company from '../models/Company.js'
import Template from '../models/Template.js'
import { protectCompanyRoute } from './company.js'

const router = Router()

// ═══ Get Wallet Balance ═══
router.get('/', protectCompanyRoute, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ company: req.company._id })
    
    if (!wallet) {
      // Create wallet if it doesn't exist
      const newWallet = await Wallet.create({ company: req.company._id })
      return res.json({
        success: true,
        data: {
          balance: newWallet.balance,
          currency: newWallet.currency,
          isActive: newWallet.isActive
        }
      })
    }

    res.json({
      success: true,
      data: {
        balance: wallet.balance,
        currency: wallet.currency,
        isActive: wallet.isActive
      }
    })
  } catch (error) {
    console.error('Get wallet error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب بيانات المحفظة' })
  }
})

// ═══ Get Transaction History ═══
router.get('/transactions', protectCompanyRoute, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, category } = req.query
    
    const wallet = await Wallet.findOne({ company: req.company._id })
    if (!wallet) {
      return res.json({ success: true, data: { transactions: [], total: 0 } })
    }

    const query = { wallet: wallet._id }
    if (type) query.type = type
    if (category) query.category = category

    const transactions = await Transaction
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Transaction.countDocuments(query)

    res.json({
      success: true,
      data: {
        transactions,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get transactions error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب سجل المعاملات' })
  }
})

// ═══ Purchase Template ═══
router.post('/purchase-template', protectCompanyRoute, async (req, res) => {
  const session = await Wallet.startSession()
  session.startTransaction()

  try {
    const { templateId } = req.body

    if (!templateId) {
      await session.abortTransaction()
      return res.status(400).json({ success: false, error: 'معرف القالب مطلوب' })
    }

    const template = await Template.findById(templateId).session(session)
    if (!template) {
      await session.abortTransaction()
      return res.status(404).json({ success: false, error: 'القالب غير موجود' })
    }

    // Check if already purchased
    if (req.company.customTemplates.includes(templateId)) {
      await session.abortTransaction()
      return res.status(400).json({ success: false, error: 'تم شراء هذا القالب مسبقاً' })
    }

    // Get wallet
    const wallet = await Wallet.findOne({ company: req.company._id }).session(session)
    if (!wallet) {
      await session.abortTransaction()
      return res.status(404).json({ success: false, error: 'المحفظة غير موجودة' })
    }

    // Check if premium template has price
    if (template.type === 'premium') {
      const price = template.price || 50 // Default price if not set

      if (wallet.balance < price) {
        await session.abortTransaction()
        return res.status(400).json({ 
          success: false, 
          error: 'الرصيد غير كافي',
          required: price,
          current: wallet.balance
        })
      }

      // Deduct from wallet
      wallet.balance -= price
      await wallet.save({ session })

      // Record transaction
      await Transaction.create([{
        company: req.company._id,
        wallet: wallet._id,
        type: 'debit',
        amount: price,
        description: `شراء قالب: ${template.name}`,
        referenceId: templateId,
        referenceType: 'template',
        category: 'theme_purchase'
      }], { session })
    }

    // Add template to company
    await Company.findByIdAndUpdate(
      req.company._id,
      { $push: { customTemplates: templateId } },
      { session }
    )

    await session.commitTransaction()

    res.json({
      success: true,
      message: 'تم شراء القالب بنجاح',
      data: {
        template,
        newBalance: wallet.balance
      }
    })
  } catch (error) {
    await session.abortTransaction()
    console.error('Purchase template error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء الشراء' })
  }
})

// ═══ Get Wallet History Summary ═══
router.get('/summary', protectCompanyRoute, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ company: req.company._id })
    if (!wallet) {
      return res.json({
        success: true,
        data: {
          balance: 0,
          currency: 'SAR',
          totalSpent: 0,
          totalCredits: 0,
          purchases: 0
        }
      })
    }

    const transactions = await Transaction.find({ wallet: wallet._id })

    const totalSpent = transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalCredits = transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0)

    const purchases = transactions.filter(t => t.category === 'theme_purchase').length

    res.json({
      success: true,
      data: {
        balance: wallet.balance,
        currency: wallet.currency,
        totalSpent,
        totalCredits,
        purchases
      }
    })
  } catch (error) {
    console.error('Wallet summary error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب ملخص المحفظة' })
  }
})

export default router