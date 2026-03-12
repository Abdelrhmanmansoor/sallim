import { Router } from 'express'
import Theme from '../models/Theme.js'
import Company from '../models/Company.js'
import AuditLog from '../models/AuditLog.js'

const router = Router()

// ═══ Get All Themes (Admin View) ═══
router.get('/', async (req, res) => {
  try {
    const { status, category, isActive, page = 1, limit = 50 } = req.query

    const query = {}
    if (status) query.status = status
    if (category) query.category = category
    if (isActive !== undefined) query.isActive = isActive === 'true'

    const themes = await Theme
      .find(query)
      .populate('exclusiveCompanies', 'name email')
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Theme.countDocuments(query)

    res.json({
      success: true,
      data: {
        themes,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get themes error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في جلب الثيمات' })
  }
})

// ═══ Create New Theme ═══
router.post('/', async (req, res) => {
  try {
    const { name, previewUrl, fileUrl, status, category, description, exclusiveCompanyIds, requiredFeature, sortOrder } = req.body

    if (!name || !previewUrl || !fileUrl) {
      return res.status(400).json({ success: false, error: 'الاسم ورابط المعاينة ورابط الملف مطلوبة' })
    }

    const theme = await Theme.create({
      name,
      previewUrl,
      fileUrl,
      status: status || 'public',
      category: category || 'general',
      description,
      requiredFeature,
      sortOrder: sortOrder || 0
    })

    // Add exclusive companies if provided
    if (exclusiveCompanyIds && Array.isArray(exclusiveCompanyIds)) {
      theme.exclusiveCompanies = exclusiveCompanyIds
      await theme.save()
    }

    // Log action
    await AuditLog.create({
      user: req.body.createdBy,
      userType: 'super_admin',
      action: 'create',
      entity: 'theme',
      entityId: theme._id,
      description: `إنشاء ثيم جديد: ${name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الثيم بنجاح',
      data: theme
    })
  } catch (error) {
    console.error('Create theme error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في إنشاء الثيم' })
  }
})

// ═══ Update Theme ═══
router.put('/:id', async (req, res) => {
  try {
    const { name, previewUrl, fileUrl, status, category, description, exclusiveCompanyIds, requiredFeature, sortOrder, isActive, updatedBy } = req.body

    const theme = await Theme.findById(req.params.id)
    if (!theme) {
      return res.status(404).json({ success: false, error: 'الثيم غير موجود' })
    }

    const oldTheme = { ...theme.toObject() }

    if (name !== undefined) theme.name = name
    if (previewUrl !== undefined) theme.previewUrl = previewUrl
    if (fileUrl !== undefined) theme.fileUrl = fileUrl
    if (status !== undefined) theme.status = status
    if (category !== undefined) theme.category = category
    if (description !== undefined) theme.description = description
    if (requiredFeature !== undefined) theme.requiredFeature = requiredFeature
    if (sortOrder !== undefined) theme.sortOrder = sortOrder
    if (isActive !== undefined) theme.isActive = isActive
    if (exclusiveCompanyIds !== undefined) theme.exclusiveCompanies = exclusiveCompanyIds

    await theme.save()

    // Log action
    await AuditLog.create({
      user: updatedBy,
      userType: 'super_admin',
      action: 'update',
      entity: 'theme',
      entityId: theme._id,
      description: `تحديث الثيم: ${theme.name}`,
      changes: { before: { oldTheme }, after: { newTheme: theme.toObject() } },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم تحديث الثيم بنجاح',
      data: theme
    })
  } catch (error) {
    console.error('Update theme error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في تحديث الثيم' })
  }
})

// ═══ Delete Theme (Soft Delete - set to inactive) ═══
router.delete('/:id', async (req, res) => {
  try {
    const { deletedBy } = req.body

    const theme = await Theme.findById(req.params.id)
    if (!theme) {
      return res.status(404).json({ success: false, error: 'الثيم غير موجود' })
    }

    theme.isActive = false
    await theme.save()

    // Log action
    await AuditLog.create({
      user: deletedBy,
      userType: 'super_admin',
      action: 'delete',
      entity: 'theme',
      entityId: theme._id,
      description: `حذف الثيم: ${theme.name}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم حذف الثيم بنجاح'
    })
  } catch (error) {
    console.error('Delete theme error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في حذف الثيم' })
  }
})

// ═══ Assign Theme to Companies ═══
router.post('/:id/assign', async (req, res) => {
  try {
    const { companyIds, assignedBy } = req.body

    if (!companyIds || !Array.isArray(companyIds) || companyIds.length === 0) {
      return res.status(400).json({ success: false, error: 'يجب تحديد شركات' })
    }

    const theme = await Theme.findById(req.params.id)
    if (!theme) {
      return res.status(404).json({ success: false, error: 'الثيم غير موجود' })
    }

    // Update theme to exclusive and assign companies
    theme.status = 'exclusive'
    theme.exclusiveCompanies = companyIds
    await theme.save()

    // Update companies to include this theme in allowed themes
    await Company.updateMany(
      { _id: { $in: companyIds } },
      { $addToSet: { allowedThemeIds: theme._id } }
    )

    // Log action
    await AuditLog.create({
      user: assignedBy,
      userType: 'super_admin',
      action: 'assign',
      entity: 'theme',
      entityId: theme._id,
      description: `تعيين الثيم ${theme.name} لشركات: ${companyIds.length}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم تعيين الثيم للشركات بنجاح',
      data: theme
    })
  } catch (error) {
    console.error('Assign theme error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في تعيين الثيم' })
  }
})

// ═══ Remove Theme from Companies ═══
router.post('/:id/unassign', async (req, res) => {
  try {
    const { companyIds, unassignedBy } = req.body

    const theme = await Theme.findById(req.params.id)
    if (!theme) {
      return res.status(404).json({ success: false, error: 'الثيم غير موجود' })
    }

    // Remove companies from exclusive list
    theme.exclusiveCompanies = theme.exclusiveCompanies.filter(
      companyId => !companyIds.includes(companyId.toString())
    )

    // If no more exclusive companies, make it public
    if (theme.exclusiveCompanies.length === 0) {
      theme.status = 'public'
    }

    await theme.save()

    // Update companies to remove this theme from allowed themes
    await Company.updateMany(
      { _id: { $in: companyIds } },
      { $pull: { allowedThemeIds: theme._id } }
    )

    // Log action
    await AuditLog.create({
      user: unassignedBy,
      userType: 'super_admin',
      action: 'unassign',
      entity: 'theme',
      entityId: theme._id,
      description: `إزالة الثيم ${theme.name} من شركات: ${companyIds.length}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    })

    res.json({
      success: true,
      message: 'تم إزالة الثيم من الشركات بنجاح',
      data: theme
    })
  } catch (error) {
    console.error('Unassign theme error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في إزالة الثيم' })
  }
})

export default router