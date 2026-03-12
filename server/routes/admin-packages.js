import { Router } from 'express'
import Package from '../models/Package.js'
import Company from '../models/Company.js'
import AuditLog from '../models/AuditLog.js'

const router = Router()

// ═══ Get All Packages ═══
router.get('/', async (req, res) => {
  try {
    const { isActive, page = 1, limit = 50 } = req.query

    const query = {}
    if (isActive !== undefined) query.isActive = isActive === 'true'

    const packages = await Package
      .find(query)
      .sort({ sortOrder: 1, price: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Package.countDocuments(query)

    // Get stats for each package
    const packageStats = await Promise.all(
      packages.map(async (pkg) => {
        const companyCount = await Company.countDocuments({ package: pkg._id })
        return {
          ...pkg.toObject(),
          companyCount
        }
      })
    )

    res.json({
      success: true,
      data: {
        packages: packageStats,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get packages error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب الباقات' })
  }
})

// ═══ Create New Package ═══
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      cardLimit, 
      price, 
      currency, 
      durationDays, 
      features, 
      limits, 
      sortOrder,
      annualDiscountPercent,
      createdBy 
    } = req.body

    if (!name || cardLimit === undefined || price === undefined || !durationDays) {
      return res.status(400).json({ 
        success: false, 
        error: 'الاسم وحد البطاقات والسعر ومدة الباقة مطلوبة' 
      })
    }

    const newPackage = await Package.create({
      name,
      description,
      cardLimit,
      price,
      currency: currency || 'SAR',
      durationDays,
      features: features || [],
      limits: limits || {},
      sortOrder: sortOrder || 0,
      annualDiscountPercent: annualDiscountPercent || 0
    })

    // Log action
    await AuditLog.create({
      user: createdBy,
      userType: 'super_admin',
      action: 'create',
      entity: 'package',
      entityId: newPackage._id,
      description: `إنشاء باقة جديدة: ${name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الباقة بنجاح',
      data: newPackage
    })
  } catch (error) {
    console.error('Create package error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في إنشاء الباقة' })
  }
})

// ═══ Update Package ═══
router.put('/:id', async (req, res) => {
  try {
    const { 
      name, 
      description, 
      cardLimit, 
      price, 
      currency, 
      durationDays, 
      features, 
      limits, 
      sortOrder,
      isActive,
      annualDiscountPercent,
      updatedBy 
    } = req.body

    const pkg = await Package.findById(req.params.id)
    if (!pkg) {
      return res.status(404).json({ success: false, error: 'الباقة غير موجودة' })
    }

    const oldPackage = { ...pkg.toObject() }

    if (name !== undefined) pkg.name = name
    if (description !== undefined) pkg.description = description
    if (cardLimit !== undefined) pkg.cardLimit = cardLimit
    if (price !== undefined) pkg.price = price
    if (currency !== undefined) pkg.currency = currency
    if (durationDays !== undefined) pkg.durationDays = durationDays
    if (features !== undefined) pkg.features = features
    if (limits !== undefined) pkg.limits = limits
    if (sortOrder !== undefined) pkg.sortOrder = sortOrder
    if (isActive !== undefined) pkg.isActive = isActive
    if (annualDiscountPercent !== undefined) pkg.annualDiscountPercent = annualDiscountPercent

    await pkg.save()

    // Log action
    await AuditLog.create({
      user: updatedBy,
      userType: 'super_admin',
      action: 'update',
      entity: 'package',
      entityId: pkg._id,
      description: `تحديث الباقة: ${pkg.name}`,
      changes: { before: { oldPackage }, after: { newPackage: pkg.toObject() } },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم تحديث الباقة بنجاح',
      data: pkg
    })
  } catch (error) {
    console.error('Update package error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في تحديث الباقة' })
  }
})

// ═══ Delete Package (Soft Delete) ═══
router.delete('/:id', async (req, res) => {
  try {
    const { deletedBy } = req.body

    const pkg = await Package.findById(req.params.id)
    if (!pkg) {
      return res.status(404).json({ success: false, error: 'الباقة غير موجودة' })
    }

    // Check if any companies are using this package
    const companiesUsingPackage = await Company.countDocuments({ package: pkg._id })
    if (companiesUsingPackage > 0) {
      return res.status(400).json({ 
        success: false, 
        error: `لا يمكن حذف الباقة. هناك ${companiesUsingPackage} شركة تستخدمها حالياً` 
      })
    }

    pkg.isActive = false
    await pkg.save()

    // Log action
    await AuditLog.create({
      user: deletedBy,
      userType: 'super_admin',
      action: 'delete',
      entity: 'package',
      entityId: pkg._id,
      description: `حذف الباقة: ${pkg.name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم حذف الباقة بنجاح'
    })
  } catch (error) {
    console.error('Delete package error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في حذف الباقة' })
  }
})

// ═══ Apply Package to Company ═══
router.post('/apply-to-company', async (req, res) => {
  const session = await Company.startSession()
  session.startTransaction()

  try {
    const { companyId, packageId, expiresAt, appliedBy } = req.body

    if (!companyId || !packageId) {
      await session.abortTransaction()
      return res.status(400).json({ 
        success: false, 
        error: 'معرف الشركة ومعرف الباقة مطلوبان' 
      })
    }

    const pkg = await Package.findById(packageId).session(session)
    if (!pkg || !pkg.isActive) {
      await session.abortTransaction()
      return res.status(404).json({ success: false, error: 'الباقة غير موجودة أو غير نشطة' })
    }

    const company = await Company.findById(companyId).session(session)
    if (!company) {
      await session.abortTransaction()
      return res.status(404).json({ success: false, error: 'الشركة غير موجودة' })
    }

    const oldPackage = company.package

    // Update company package
    company.package = packageId
    company.cardsLimit = pkg.cardLimit
    company.subscription.limits = pkg.limits
    company.subscription.startDate = new Date()
    company.subscription.renewalDate = expiresAt || new Date(Date.now() + pkg.durationDays * 24 * 60 * 60 * 1000)
    company.subscription.expiresAt = company.subscription.renewalDate
    company.subscription.isActive = true
    company.features = pkg.features

    await company.save({ session })

    await session.commitTransaction()

    // Log action
    await AuditLog.create({
      user: appliedBy,
      userType: 'super_admin',
      action: 'assign',
      entity: 'package',
      entityId: packageId,
      description: `تطبيق الباقة ${pkg.name} على شركة ${company.name}`,
      changes: { before: { package: oldPackage }, after: { package: packageId } },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم تطبيق الباقة على الشركة بنجاح',
      data: {
        company: await Company.findById(companyId).populate('package')
      }
    })
  } catch (error) {
    await session.abortTransaction()
    console.error('Apply package error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في تطبيق الباقة' })
  }
})

export default router