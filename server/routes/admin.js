import { Router } from 'express'
import crypto from 'crypto'
import Company from '../models/Company.js'
import Template from '../models/Template.js'
import Post from '../models/Post.js'
import LicenseKey from '../models/LicenseKey.js'
import { upload } from '../config/upload.js'
import { sendEmail, getActivationEmailHtml } from '../utils/sendMail.js'

const router = Router()

// Middleware to protect admin routes
const isAdmin = (req, res, next) => {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ success: false, error: 'غير مصرح لك للوصول' })
    }
    next()
}

router.post('/licenses/generate', isAdmin, async (req, res) => {
    try {
        const count = Math.max(1, Math.min(Number(req.body?.count || 1), 200))
        const maxRecipients = Math.max(1, Math.min(Number(req.body?.maxRecipients || 500), 10000))
        const note = String(req.body?.note || '').trim().slice(0, 200)

        const codes = []
        for (let i = 0; i < count; i++) {
            const code = crypto.randomBytes(10).toString('hex').toUpperCase()
            const codeHash = crypto.createHash('sha256').update(code).digest('hex')
            await LicenseKey.create({
                codeHash,
                status: 'new',
                maxRecipients,
                note,
            })
            codes.push(code)
        }

        res.status(201).json({
            success: true,
            data: {
                count: codes.length,
                maxRecipients,
                codes,
            }
        })
    } catch (error) {
        console.error('Generate license error:', error)
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء إنشاء الأكواد' })
    }
})

// ═══ Create a new company and send invitation ═══
router.post('/companies', isAdmin, async (req, res) => {
    try {
        const { name, email, features } = req.body

        if (!name || !email) {
            return res.status(400).json({ success: false, error: 'الاسم والبريد الإلكتروني مطلوبان' })
        }

        // Check if company already exists
        const existingCompany = await Company.findOne({ email })
        if (existingCompany) {
            return res.status(400).json({ success: false, error: 'الشركة مسجلة مسبقاً بهذا البريد' })
        }

        // Generate random activation code (6 alphanumeric chars)
        const activationCode = crypto.randomBytes(3).toString('hex').toUpperCase()

        // Valid for 48 hours
        const expires = new Date()
        expires.setHours(expires.getHours() + 48)

        // Save company with pending status
        const company = await Company.create({
            name,
            email,
            status: 'pending',
            activationCode,
            activationExpires: expires,
            features: features || ['basic_templates'],
            role: 'company'
        })

        // Send the email
        // The frontend client URL needs a route like /company/activate to handle this
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
        const activationLink = `${clientUrl}/company-activation?email=${encodeURIComponent(email)}`

        const emailSent = await sendEmail({
            to: email,
            subject: `دعوة الانضمام لمنصة سَلِّم | ${name}`,
            html: getActivationEmailHtml(name, activationLink, activationCode)
        })

        res.status(201).json({
            success: true,
            message: emailSent ? 'تم التسجيل وإرسال رمز التفعيل بنجاح' : 'تم التسجيل لكن فشل إرسال البريد',
            data: {
                companyId: company._id,
                email: company.email,
                activationCode: activationCode // Sending it back for manual testing as well
            }
        })

    } catch (error) {
        console.error('Error creating company:', error)
        res.status(500).json({ success: false, error: 'حدث خطأ في النظام' })
    }
})

// ═══ List all registered companies ═══
router.get('/companies', isAdmin, async (req, res) => {
    try {
        const companies = await Company.find()
            .select('-password -activationCode -activationExpires')
            .sort({ createdAt: -1 })

        res.json({ success: true, data: companies })
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في جلب الشركات' })
    }
})

// ═══ Update specific company (Targeting features & status) ═══
router.put('/companies/:id', isAdmin, async (req, res) => {
    try {
        const { status, features, name } = req.body

        const company = await Company.findById(req.params.id)
        if (!company) {
            return res.status(404).json({ success: false, error: 'الشركة غير موجودة' })
        }

        if (status) company.status = status
        if (features && Array.isArray(features)) company.features = features
        if (name) company.name = name

        await company.save()

        res.json({
            success: true,
            message: 'تم تحديث بيانات الشركة بنجاح',
            data: company
        })
    } catch (error) {
        console.error('Error updating company:', error)
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء التحديث' })
    }
})

// ═════════════════════════════════════════════
// TEMPLATES (CMS)
// ═════════════════════════════════════════════

// ═══ Get all templates (for admin to manage) ═══
router.get('/templates', isAdmin, async (req, res) => {
    try {
        const templates = await Template.find().sort({ createdAt: -1 })
        res.json({ success: true, data: templates })
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في جلب القوالب' })
    }
})

// ═══ Add a new template ═══
router.post('/templates', isAdmin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'صورة القالب مطلوبة' })
        }

        const { name, type, season, requiredFeature, isActive } = req.body

        const serverUrl = process.env.SERVER_URL || 'http://localhost:3001'
        const imageUrl = `${serverUrl}/uploads/templates/${req.file.filename}`

        const template = await Template.create({
            name,
            imageUrl,
            type: type || 'public',
            season: season || 'eid_al_fitr',
            requiredFeature: requiredFeature || '',
            isActive: isActive === undefined ? true : isActive === 'true'
        })

        res.status(201).json({
            success: true,
            message: 'تم إضافة القالب بنجاح',
            data: template
        })

    } catch (error) {
        console.error('Error adding template:', error)
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء إضافة القالب' })
    }
})

// ═══ Update template (e.g., toggle active status) ═══
router.put('/templates/:id', isAdmin, async (req, res) => {
    try {
        const { isActive, name, type } = req.body
        const template = await Template.findById(req.params.id)

        if (!template) {
            return res.status(404).json({ success: false, error: 'القالب غير موجود' })
        }

        if (isActive !== undefined) template.isActive = isActive
        if (name) template.name = name
        if (type) template.type = type

        await template.save()

        res.json({
            success: true,
            message: 'تم تحديث القالب',
            data: template
        })
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء التحديث' })
    }
})

// ═══ Delete template ═══
router.delete('/templates/:id', isAdmin, async (req, res) => {
    try {
        const template = await Template.findByIdAndDelete(req.params.id)

        if (!template) {
            return res.status(404).json({ success: false, error: 'القالب غير موجود' })
        }

        res.json({
            success: true,
            message: 'تم حذف القالب بنجاح',
            data: template
        })
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء الحذف' })
    }
})

// ═════════════════════════════════════════════
// BLOG (CMS)
// ═════════════════════════════════════════════

// ═══ Get all posts (for admin to manage) ═══
router.get('/blog', isAdmin, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
        res.json({ success: true, data: posts })
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في جلب المقالات' })
    }
})

// ═══ Add a new post ═══
router.post('/blog', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, slug, content, author, status, category } = req.body

        if (!title || !slug || !content) {
            return res.status(400).json({ success: false, error: 'العنوان والرابط والمحتوى مطلوبون' })
        }

        const existingPost = await Post.findOne({ slug })
        if (existingPost) {
            return res.status(400).json({ success: false, error: 'هذا الرابط مستخدم مسبقاً، اختر رابط آخر' })
        }

        let imageUrl = ''
        if (req.file) {
            const serverUrl = process.env.SERVER_URL || 'http://localhost:3001'
            imageUrl = `${serverUrl}/uploads/blog/${req.file.filename}`
        }

        const post = await Post.create({
            title,
            slug,
            content,
            author: author || 'الإدارة',
            status: status || 'draft',
            category: category || 'عام',
            imageUrl
        })

        res.status(201).json({
            success: true,
            message: 'تم إضافة المقال بنجاح',
            data: post
        })

    } catch (error) {
        console.error('Error adding post:', error)
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء إضافة المقال' })
    }
})

// ═══ Update post (e.g., status, content) ═══
router.put('/blog/:id', isAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, slug, content, author, status, category } = req.body
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ success: false, error: 'المقال غير موجود' })
        }

        if (title) post.title = title
        if (slug) post.slug = slug
        if (content) post.content = content
        if (author) post.author = author
        if (status) post.status = status
        if (category) post.category = category

        if (req.file) {
            const serverUrl = process.env.SERVER_URL || 'http://localhost:3001'
            post.imageUrl = `${serverUrl}/uploads/blog/${req.file.filename}`
        }

        await post.save()

        res.json({
            success: true,
            message: 'تم تحديث المقال',
            data: post
        })
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء تحديث المقال' })
    }
})

// ═══ Delete post ═══
router.delete('/blog/:id', isAdmin, async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id)

        if (!post) {
            return res.status(404).json({ success: false, error: 'المقال غير موجود' })
        }

        res.json({
            success: true,
            message: 'تم حذف المقال بنجاح',
            data: post
        })
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء החذف' })
    }
})

export default router
