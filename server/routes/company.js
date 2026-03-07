import { Router } from 'express'
import jwt from 'jsonwebtoken'
import Company from '../models/Company.js'
import { upload } from '../config/upload.js'

const router = Router()

// Initialize JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'sallim_super_secret_corporate_key'

// ═══ Activate Company Account ═══
// Handles the link that the user clicks from their email
router.post('/activate', async (req, res) => {
    try {
        const { email, code, password } = req.body

        if (!email || !code || !password) {
            return res.status(400).json({ success: false, error: 'البريد الإلكتروني وكود التفعيل وكلمة المرور مطلوبة' })
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
        }

        // Find company by email and code
        // We need to explicitly select the hidden fields
        const company = await Company.findOne({
            email: email.toLowerCase(),
            activationCode: code
        }).select('+activationCode +activationExpires +password')

        if (!company) {
            return res.status(400).json({ success: false, error: 'بيانات التفعيل غير صحيحة' })
        }

        if (company.status === 'active') {
            return res.status(400).json({ success: false, error: 'هذا الحساب مفعل مسبقاً' })
        }

        // Check expiration
        if (new Date() > company.activationExpires) {
            return res.status(400).json({ success: false, error: 'كود التفعيل هذا منتهي الصلاحية. يرجى طلب كود جديد.' })
        }

        // Activate the account
        company.status = 'active'
        company.password = password
        company.activationCode = undefined // clear it
        company.activationExpires = undefined

        await company.save()

        // Generate JWT token
        const token = jwt.sign(
            { id: company._id, role: company.role },
            JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.json({
            success: true,
            message: 'تم تفعيل الحساب بنجاح',
            data: {
                token,
                company: {
                    id: company._id,
                    name: company.name,
                    email: company.email,
                    logoUrl: company.logoUrl,
                    features: company.features
                }
            }
        })

    } catch (error) {
        console.error('Activation error:', error)
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء التفعيل' })
    }
})

// ═══ Company Login ═══
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'البريد وكلمة المرور مطلوبة' })
        }

        // Find company and explicitly select the password
        const company = await Company.findOne({ email: email.toLowerCase() }).select('+password')

        if (!company || company.status !== 'active') {
            return res.status(401).json({ success: false, error: 'البيانات غير صحيحة أو الحساب غير مفعل' })
        }

        // Check password
        const isMatch = await company.comparePassword(password)
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'البيانات غير صحيحة' })
        }

        // Generate token
        const token = jwt.sign(
            { id: company._id, role: company.role },
            JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.json({
            success: true,
            message: 'تم تسجيل الدخول',
            data: {
                token,
                company: {
                    id: company._id,
                    name: company.name,
                    email: company.email,
                    logoUrl: company.logoUrl,
                    features: company.features
                }
            }
        })

    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في النظام' })
    }
})

// Authentication Middleware to protect company routes
export const protectCompanyRoute = async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'تسجيل الدخول مطلوب' })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.company = await Company.findById(decoded.id)
        if (!req.company) {
            return res.status(404).json({ success: false, error: 'الشركة غير موجودة' })
        }
        next()
    } catch (error) {
        res.status(401).json({ success: false, error: 'الجلسة منتهية أو غير صالحة' })
    }
}

// ═══ Get Current Company Profile ═══
router.get('/profile', protectCompanyRoute, (req, res) => {
    res.json({
        success: true,
        data: req.company
    })
})

// ═══ Update Company Profile (Upload Logo) ═══
router.put('/profile', protectCompanyRoute, upload.single('logo'), async (req, res) => {
    try {
        // If a file was uploaded, the path will be in req.file.filename
        if (req.file) {
            const serverUrl = process.env.SERVER_URL || 'http://localhost:3001'
            const logoUrl = `${serverUrl}/uploads/companies/${req.file.filename}`
            req.company.logoUrl = logoUrl
        }

        // You can also allow updating other profile fields here via req.body
        if (req.body.name) {
            // For now, let's say only admin can change names. Or we can allow it.
            // req.company.name = req.body.name 
        }

        await req.company.save()

        res.json({
            success: true,
            message: 'تم تحديث البيانات بنجاح',
            data: req.company
        })

    } catch (error) {
        console.error('Update profile error:', error)
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء تحديث البيانات' })
    }
})

export default router
