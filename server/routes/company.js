import { Router } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { nanoid } from 'nanoid'
import { v2 as cloudinaryV2 } from 'cloudinary'
import Company from '../models/Company.js'
import CompanyTeam from '../models/CompanyTeam.js'
import LicenseKey from '../models/LicenseKey.js'
import Card from '../models/Card.js'
import GreetLink from '../models/GreetLink.js'
import Template from '../models/Template.js'
import { upload } from '../config/upload.js'
import { loginLimiter, activationLimiter, employeeLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// Helper: Encode URL with Arabic characters
function encodeArabicUrl(url) {
  try {
    const u = new URL(url)
    // Encode each path segment separately
    u.pathname = u.pathname.split('/').map(seg => encodeURIComponent(decodeURIComponent(seg))).join('/')
    return u.toString()
  } catch {
    return url
  }
}

// Helper: Upload image URL to Cloudinary (for template images)
async function uploadToCloudinary(imageUrl) {
  try {
    // If already a Cloudinary URL, return as-is
    if (imageUrl.includes('cloudinary.com') || imageUrl.includes('res.cloudinary')) {
      return imageUrl
    }
    
    // Encode Arabic characters in the URL
    const encodedUrl = encodeArabicUrl(imageUrl)
    console.log('[Cloudinary] Uploading from:', encodedUrl)
    
    // Upload the remote image to Cloudinary
    const result = await cloudinaryV2.uploader.upload(encodedUrl, {
      folder: 'sallim/greet-templates',
      resource_type: 'image',
      format: 'png',
      transformation: [{ quality: 'auto:best' }]
    })
    
    console.log('[Cloudinary] Uploaded successfully:', result.secure_url)
    return result.secure_url
  } catch (error) {
    console.error('[Cloudinary] Upload failed:', error.message, error)
    // Return original URL if upload fails
    return imageUrl
  }
}

// JWT Secret - MUST be set in environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL ERROR: JWT_SECRET is not defined in environment variables.')
  console.error('👉 Add JWT_SECRET to your .env file and restart the server.')
  process.exit(1)
}
const JWT_SECRET = process.env.JWT_SECRET

const buildCompanyContext = (company) => ({
  id: company._id,
  name: company.name,
  slug: company.slug,
  logoUrl: company.logoUrl || '',
  brandColors: company.brandColors || {
    primary: company.primaryColor || '#2563eb',
    secondary: '#1e40af',
  },
  allowedFonts: Array.isArray(company.allowedFonts) ? company.allowedFonts : [],
  isActive: company.status === 'active' && company.isActive !== false,
  status: company.status,
})

const issueCompanyContextToken = (company) => jwt.sign(
  {
    type: 'company_context',
    companyId: String(company._id),
    slug: company.slug,
  },
  JWT_SECRET,
  { expiresIn: '12h' }
)

// ─── Helpers ───
const hashLicenseCode = (code) => {
  return crypto
    .createHash('sha256')
    .update(String(code || '').trim().toUpperCase())
    .digest('hex')
}

const generateSlug = () => nanoid(10).toLowerCase()

const generateEmail = (slug) => `company_${slug}@sallim.co`

const generateStrongPassword = () => crypto.randomBytes(12).toString('base64url')

// ═══ تفعيل الشركة باستخدام كود التفعيل ═══
router.post('/activate', activationLimiter, async (req, res) => {
  try {
    const code = String(req.body?.code || '').trim()
    const userEmail = String(req.body?.email || '').trim().toLowerCase()
    const userPassword = String(req.body?.password || '').trim()

    if (!code) {
      return res.status(400).json({ success: false, error: 'كود التفعيل مطلوب' })
    }

    console.warn('Activation attempt', {
      code: code.slice(0, 5),
      ip: req.ip,
      time: new Date()
    })

    const codeHash = hashLicenseCode(code)
    const license = await LicenseKey.findOne({ codeHash, status: 'new' })

    if (!license) {
      return res.status(400).json({ success: false, error: 'كود التفعيل غير صحيح أو مستخدم' })
    }

    // Use user-provided email if valid, otherwise generate
    let slug = generateSlug()
    let email = userEmail && userEmail.includes('@') ? userEmail : generateEmail(slug)
    const password = userPassword && userPassword.length >= 6 ? userPassword : generateStrongPassword()

    // Check email uniqueness
    const existingEmail = await Company.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ success: false, error: 'هذا البريد الإلكتروني مستخدم بالفعل. جرّب بريد آخر أو سجّل دخول.' })
    }
    // Check slug uniqueness
    for (let i = 0; i < 5; i++) {
      const exists = await Company.findOne({ slug })
      if (!exists) break
      slug = generateSlug()
    }

    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setFullYear(expiresAt.getFullYear() + 1)

    const company = await Company.create({
      name: `شركة ${slug}`,
      email,
      password,
      slug,
      cardsLimit: Number(license.maxRecipients || 0),
      cardsUsed: 0,
      status: 'active',
      subscription: {
        plan: 'basic',
        startDate: now,
        renewalDate: expiresAt,
        expiresAt,
        isActive: true,
        limits: {
          cardsPerMonth: 100,
          teamMembers: 3,
          campaignsPerMonth: 5
        }
      },
      usage: {
        cardsThisMonth: 0,
        campaignsThisMonth: 0,
        lastReset: now,
      },
      stats: {
        views: 0,
        downloads: 0
      }
    })

    // Mark license as used
    license.status = 'activated'
    license.activatedAt = now
    license.activatedIp = req.ip
    license.activatedUserAgent = req.headers['user-agent'] || ''
    await license.save()

    // JWT for dashboard access
    const token = jwt.sign(
      { id: company._id, role: company.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    )

    res.json({
      success: true,
      message: '🎉 تم تفعيل حساب شركتك',
      data: {
        token,
        login: { email, password },
        company: {
          id: company._id,
          name: company.name,
          email: company.email,
          slug: company.slug,
          logoUrl: company.logoUrl,
          primaryColor: company.primaryColor,
          brandColors: company.brandColors,
          allowedFonts: company.allowedFonts || [],
          isActive: company.isActive !== false,
          cardsLimit: company.cardsLimit,
          cardsUsed: company.cardsUsed,
          features: company.features,
          subscriptionActive: company.subscription?.isActive,
          link: `${process.env.CLIENT_URL || ''}/c/${company.slug}?utm=company`
        }
      },
      notice: 'احتفظ ببيانات الدخول لن تظهر مرة أخرى'
    })
  } catch (error) {
    console.error('Activation error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء التفعيل' })
  }
})

// ═══ Company Login ═══
router.post('/login', loginLimiter, async (req, res) => {
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
                    slug: company.slug,
                    logoUrl: company.logoUrl,
                    primaryColor: company.primaryColor,
                    brandColors: company.brandColors,
                    allowedFonts: company.allowedFonts || [],
                    isActive: company.isActive !== false,
                    cardsLimit: company.cardsLimit,
                    cardsUsed: company.cardsUsed,
                    features: company.features,
                    subscriptionActive: company.subscription?.isActive,
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
        if (req.company.status !== 'active' || req.company.isActive === false) {
            return res.status(403).json({ success: false, error: 'حساب الشركة غير مفعل حالياً' })
        }
        next()
    } catch (error) {
        res.status(401).json({ success: false, error: 'الجلسة منتهية أو غير صالحة' })
    }
}

// ═══ Dashboard (Company Auth) ═══
router.get('/dashboard', protectCompanyRoute, async (req, res) => {
  try {
    const company = req.company
    const remaining = company.cardsLimit === 0
      ? 'unlimited'
      : Math.max(0, company.cardsLimit - company.cardsUsed)

    res.json({
      success: true,
      data: {
        name: company.name,
        email: company.email,
        slug: company.slug,
        cardsLimit: company.cardsLimit,
        cardsUsed: company.cardsUsed,
        cardsRemaining: remaining,
        link: `${process.env.CLIENT_URL || ''}/c/${company.slug}?utm=company`,
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'تعذر جلب البيانات' })
  }
})

// Middleware to check team member permissions
export const checkTeamPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // If user is company admin (logged in as company), allow all
      if (req.company) {
        return next()
      }

      // If user is team member, check their permissions
      const token = req.headers.authorization?.split(' ')[1]
      if (!token) {
        console.warn('🚨 [SECURITY] Unauthorized access attempt - No token provided', {
          ip: req.ip,
          path: req.path,
          method: req.method
        })
        return res.status(401).json({ success: false, error: 'تسجيل الدخول مطلوب' })
      }

      const decoded = jwt.verify(token, JWT_SECRET)
      
      // Check if this is a team member token
      if (decoded.type === 'team_member') {
        const teamMember = await CompanyTeam.findById(decoded.id).select('+permissions')
        
        if (!teamMember || teamMember.status !== 'active') {
          console.warn('🚨 [SECURITY] Inactive account access attempt', {
            teamMemberId: decoded.id,
            status: teamMember?.status,
            ip: req.ip,
            path: req.path
          })
          return res.status(403).json({ success: false, error: 'حسابك غير نشط' })
        }

        // CRITICAL: Verify team member belongs to the same company FIRST
        const companyId = req.params.companyId || req.body.companyId || req.company?._id
        if (companyId && teamMember.company.toString() !== companyId.toString()) {
          console.error('🚨 [SECURITY] CRITICAL - Cross-company access attempt blocked', {
            teamMemberId: teamMember._id,
            teamMemberEmail: teamMember.email,
            teamMemberCompany: teamMember.company,
            attemptedCompany: companyId,
            ip: req.ip,
            path: req.path,
            method: req.method,
            userAgent: req.headers['user-agent']
          })
          return res.status(403).json({ 
            success: false, 
            error: 'غير مصرح' // Generic message - no data leak
          })
        }

        // Check if team member has the required permission
        if (requiredPermission && !teamMember.hasPermission(requiredPermission)) {
          console.warn('🚨 [SECURITY] Permission denied', {
            teamMemberId: teamMember._id,
            teamMemberEmail: teamMember.email,
            companyId: teamMember.company,
            requiredPermission,
            hasPermission: teamMember.permissions[requiredPermission],
            ip: req.ip,
            path: req.path,
            method: req.method
          })
          return res.status(403).json({ 
            success: false, 
            error: `ليس لديك صلاحية ${getPermissionNameInArabic(requiredPermission)}` 
          })
        }

        // Success - log access granted
        console.log('✅ [ACCESS] Team member access granted', {
          teamMemberId: teamMember._id,
          companyId: teamMember.company,
          permission: requiredPermission,
          path: req.path
        })

        // Attach team member to request
        req.teamMember = teamMember
        req.company = await Company.findById(teamMember.company)
        return next()
      }

      // If neither company nor team member, deny access
      console.warn('🚨 [SECURITY] Unknown user type access attempt', {
        tokenType: decoded.type,
        ip: req.ip,
        path: req.path
      })
      return res.status(403).json({ success: false, error: 'غير مصرح' })
      
    } catch (error) {
      console.error('🚨 [SECURITY] Permission check error', {
        error: error.message,
        ip: req.ip,
        path: req.path
      })
      return res.status(401).json({ success: false, error: 'الجلسة منتهية أو غير صالحة' })
    }
  }
}

// Helper: Get permission name in Arabic for error messages
function getPermissionNameInArabic(permission) {
  const names = {
    createCards: 'إنشاء البطاقات',
    editCards: 'تعديل البطاقات',
    deleteCards: 'حذف البطاقات',
    viewAnalytics: 'عرض الإحصائيات',
    manageTemplates: 'إدارة القوالب',
    manageTeam: 'إدارة الفريق',
    viewWallet: 'عرض المحفظة',
    createCampaigns: 'إنشاء الحملات'
  }
  return names[permission] || permission
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

        // Allow updating profile fields from body
        if (req.body.companyName && req.body.companyName.trim()) {
            req.company.name = req.body.companyName.trim()
        }
        if (req.body.primaryColor) {
            req.company.primaryColor = req.body.primaryColor
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

// ═══ Company context by slug (for /company/:slug) ═══
router.get('/context/:slug', async (req, res) => {
  try {
    const slug = String(req.params.slug || '').trim().toLowerCase()
    if (!slug) {
      return res.status(400).json({ success: false, error: 'رابط الشركة غير صالح' })
    }

    const company = await Company.findOne({
      slug,
      status: 'active',
      $or: [{ isActive: true }, { isActive: { $exists: false } }]
    }).select('name slug logoUrl primaryColor brandColors brandFonts allowedFonts status isActive cardsLimit cardsUsed subscription usage')

    if (!company) {
      return res.status(404).json({ success: false, error: 'الشركة غير موجودة أو غير مفعلة' })
    }

    const companyContext = buildCompanyContext(company)
    const companyContextToken = issueCompanyContextToken(company)

    res.json({
      success: true,
      data: {
        ...companyContext,
        cardsLimit: company.cardsLimit,
        cardsUsed: company.cardsUsed,
        subscriptionActive: company.subscription?.isActive !== false,
      },
      companyContextToken,
    })
  } catch (error) {
    console.error('Company context error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء تحميل بيانات الشركة' })
  }
})

// ═══ Company context by access code (Method 2) ═══
router.post('/access-code', loginLimiter, async (req, res) => {
  try {
    const accessCode = String(req.body?.accessCode || '').trim().toUpperCase()
    if (!accessCode) {
      return res.status(400).json({ success: false, error: 'كود الدخول مطلوب' })
    }

    const company = await Company.findOne({
      accessCode,
      status: 'active',
      $or: [{ isActive: true }, { isActive: { $exists: false } }]
    }).select('name slug logoUrl primaryColor brandColors brandFonts allowedFonts status isActive cardsLimit cardsUsed subscription usage')

    if (!company) {
      return res.status(404).json({ success: false, error: 'كود الشركة غير صحيح أو الشركة غير مفعلة' })
    }

    const companyContext = buildCompanyContext(company)
    const companyContextToken = issueCompanyContextToken(company)

    res.json({
      success: true,
      data: {
        ...companyContext,
        cardsLimit: company.cardsLimit,
        cardsUsed: company.cardsUsed,
        subscriptionActive: company.subscription?.isActive !== false,
      },
      companyContextToken,
    })
  } catch (error) {
    console.error('Company access code error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء التحقق من كود الشركة' })
  }
})

// ═══ Public company info (for /c/:slug) ═══
router.get('/public/:slug', async (req, res) => {
  try {
    const company = await Company.findOne({
      slug: req.params.slug,
      status: 'active',
      $or: [{ isActive: true }, { isActive: { $exists: false } }]
    }).select('name slug logoUrl cardsLimit cardsUsed subscription usage primaryColor brandColors brandFonts allowedFonts status isActive')

    if (!company) {
      return res.status(404).json({ success: false, error: 'الشركة غير موجودة أو غير مفعلة' })
    }

    Company.updateOne(
      { _id: company._id },
      { $inc: { 'stats.views': 1 } }
    ).catch(() => {})

    const remaining = company.cardsLimit === 0
      ? 'unlimited'
      : Math.max(0, company.cardsLimit - company.cardsUsed)

    res.json({
      success: true,
      data: {
        name: company.name,
        slug: company.slug,
        logoUrl: company.logoUrl,
        primaryColor: company.primaryColor,
        brandColors: company.brandColors || {
          primary: company.primaryColor || '#2563eb',
          secondary: '#1e40af',
        },
        brandFonts: company.brandFonts || { heading: 'Cairo', body: 'Cairo' },
        allowedFonts: Array.isArray(company.allowedFonts) ? company.allowedFonts : [],
        isActive: company.status === 'active' && company.isActive !== false,
        cardsLimit: company.cardsLimit,
        cardsUsed: company.cardsUsed,
        cardsRemaining: remaining,
        subscriptionActive: company.subscription?.isActive !== false,
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'حدث خطأ' })
  }
})

// ═══ إنشاء بطاقة من صفحة الموظف (public) ═══
router.post('/public/:slug/cards', employeeLimiter, async (req, res) => {
  try {
    const company = await Company.findOne({
      slug: req.params.slug,
      status: 'active',
      $or: [{ isActive: true }, { isActive: { $exists: false } }]
    })

    if (!company) {
      return res.status(404).json({ success: false, error: 'الشركة غير موجودة أو غير مفعلة' })
    }

    // Subscription check
    const isExpired = company.subscription?.expiresAt && new Date(company.subscription.expiresAt) < new Date()
    if (company.subscription?.isActive === false || isExpired) {
      return res.status(403).json({ success: false, error: 'انتهت صلاحية الاشتراك، يرجى التواصل مع الإدارة' })
    }

    // Quota check
    if (company.cardsLimit > 0 && company.cardsUsed >= company.cardsLimit) {
      return res.status(403).json({ success: false, error: 'عذراً انتهت بطاقات الشركة.' })
    }

    const senderName = String(req.body?.name || req.body?.senderName || '').trim().slice(0, 100)
    const customMainText = String(req.body?.mainText || '').trim().slice(0, 500)
    const customSubText = String(req.body?.subText || '').trim().slice(0, 500)
    const templateId = String(req.body?.templateId || company.settings?.defaultTemplate || 'default-template').trim()

    if (!senderName) {
      return res.status(400).json({ success: false, error: 'الاسم مطلوب' })
    }
    if (!templateId) {
      return res.status(400).json({ success: false, error: 'القالب مطلوب' })
    }

    const dbTemplate = await Template.findById(templateId).catch(() => null)
    if (dbTemplate) {
      if (!dbTemplate.isActive) {
        return res.status(403).json({ success: false, error: 'القالب غير متاح حالياً' })
      }
      const visibility = dbTemplate.visibility || 'public'
      if (visibility === 'company_exclusive') {
        if (!dbTemplate.companyId || String(dbTemplate.companyId) !== String(company._id)) {
          return res.status(403).json({ success: false, error: 'هذا القالب غير متاح لهذه الشركة' })
        }
      }
      if (dbTemplate.type === 'exclusive' && dbTemplate.requiredFeature) {
        if (!company.features?.includes(dbTemplate.requiredFeature)) {
          return res.status(403).json({ success: false, error: 'هذا القالب غير متاح في باقة شركتك' })
        }
      }
    }

    const card = await Card.create({
      mainText: customMainText || `كل عام وأنت بخير ${senderName}`,
      subText: customSubText,
      senderName,
      recipientName: '',
      templateId,
      theme: req.body?.theme || 'golden',
      font: req.body?.font || 'cairo',
      fontSize: req.body?.fontSize || 42,
      textColor: req.body?.textColor || '#ffffff',
      createdByIp: req.ip,
      company: company._id,
      category: 'business',
    })

    await Company.findByIdAndUpdate(company._id, {
      $inc: {
        cardsUsed: 1,
        'usage.cardsThisMonth': 1,
        'stats.downloads': 1
      }
    })

    res.status(201).json({
      success: true,
      data: {
        shareId: card.shareId,
        shareUrl: `${process.env.CLIENT_URL || ''}/card/${card.shareId}`,
        createdAt: card.createdAt,
      },
    })
  } catch (error) {
    console.error('Public card create error:', error)
    res.status(500).json({ success: false, error: 'حدث خطأ أثناء إنشاء البطاقة' })
  }
})

// ═══ Batch consume cards (Company Auth) ═══
router.post('/consume-batch', protectCompanyRoute, async (req, res) => {
  try {
    const count = Math.max(1, Math.min(parseInt(req.body?.count) || 1, 10000))
    const company = req.company

    if (company.cardsLimit > 0 && company.cardsUsed + count > company.cardsLimit) {
      return res.status(403).json({ success: false, error: 'الرصيد غير كافٍ' })
    }

    await Company.findByIdAndUpdate(company._id, {
      $inc: { cardsUsed: count, 'usage.cardsThisMonth': count, 'stats.downloads': count }
    })

    const updated = await Company.findById(company._id).select('cardsUsed cardsLimit')
    res.json({
      success: true,
      data: { cardsUsed: updated.cardsUsed, cardsRemaining: Math.max(0, updated.cardsLimit - updated.cardsUsed) }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'حدث خطأ' })
  }
})

// ═══ GreetLink: Create short link (company auth required) ═══
router.post('/greet-links', protectCompanyRoute, async (req, res) => {
  try {
    const company = req.company
    const { occasionName, greetingText, customCompanyName, templateId, templateImage, templateTextColor, font, fontSize, nameY, nameColor, expiresAt } = req.body
    if (!templateImage) return res.status(400).json({ success: false, error: 'رابط صورة القالب مطلوب' })

    // Ensure templateImage is absolute URL (convert relative paths)
    let imageUrl = templateImage
    if (!templateImage.startsWith('http')) {
      imageUrl = `https://www.sallim.co${templateImage.startsWith('/') ? '' : '/'}${templateImage}`
    }
    
    // Upload to Cloudinary for reliable CDN hosting (handles Arabic paths, CORS, etc.)
    console.log('[greet-links] uploading to Cloudinary:', imageUrl)
    const finalTemplateImage = await uploadToCloudinary(imageUrl)
    console.log('[greet-links] final image URL:', finalTemplateImage)

    const shortId = nanoid(6)
    const greetLink = await GreetLink.create({
      shortId,
      companyId: company._id,
      companySlug: company.slug,
      customCompanyName: customCompanyName || company.name || '',
      occasionName: occasionName || '',
      greetingText: greetingText || '',
      templateId: String(templateId || ''),
      templateImage: finalTemplateImage,
      templateTextColor: templateTextColor || '#ffffff',
      font: font || 'amiri',
      fontSize: Number(fontSize) || 60,
      nameY: Number(nameY) || 0.65,
      nameColor: nameColor || '',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    })
    res.json({ success: true, data: { shortId: greetLink.shortId } })
  } catch (error) {
    console.error('greet-links create error', error)
    res.status(500).json({ success: false, error: 'حدث خطأ في إنشاء الرابط' })
  }
})

// ═══ GreetLink: Get link data (public) ═══
router.get('/greet-links/:shortId', async (req, res) => {
  try {
    const link = await GreetLink.findOne({ shortId: req.params.shortId, active: true })
    if (!link) return res.status(404).json({ success: false, error: 'الرابط غير موجود أو انتهت صلاحيته' })
    if (link.expiresAt && link.expiresAt < new Date()) {
      return res.status(410).json({ success: false, error: 'انتهت صلاحية هذا الرابط' })
    }
    // Increment view count (fire-and-forget)
    GreetLink.findByIdAndUpdate(link._id, { $inc: { views: 1 } }).catch(() => {})
    // Fetch company branding
    const company = await Company.findById(link.companyId).select('name logoUrl slug').lean()
    
    // Get template image - if not on Cloudinary, upload it now (lazy migration)
    let templateImage = link.templateImage || ''
    if (templateImage && !templateImage.includes('cloudinary.com') && !templateImage.includes('res.cloudinary')) {
      // Convert relative to absolute first
      if (!templateImage.startsWith('http')) {
        templateImage = `https://www.sallim.co${templateImage.startsWith('/') ? '' : '/'}${templateImage}`
      }
      // Upload to Cloudinary in background (lazy migration)
      uploadToCloudinary(templateImage).then(cloudinaryUrl => {
        if (cloudinaryUrl !== templateImage) {
          // Update the record with Cloudinary URL for future requests
          GreetLink.findByIdAndUpdate(link._id, { templateImage: cloudinaryUrl }).catch(() => {})
        }
      }).catch(() => {})
    }
    console.log('[greet-links GET] returning templateImage:', templateImage)
    
    res.json({
      success: true,
      data: {
        shortId: link.shortId,
        companySlug: link.companySlug,
        customCompanyName: link.customCompanyName || (company && company.name) || '',
        occasionName: link.occasionName,
        greetingText: link.greetingText,
        templateImage,
        templateTextColor: link.templateTextColor,
        font: link.font,
        fontSize: link.fontSize,
        nameY: link.nameY,
        nameColor: link.nameColor,
        company: company ? { name: company.name, logoUrl: company.logoUrl, slug: company.slug } : null,
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'حدث خطأ' })
  }
})

// ═══ GreetLink: Record card generated by employee (deducts credit) ═══
router.post('/greet-links/:shortId/record', employeeLimiter, async (req, res) => {
  try {
    const link = await GreetLink.findOne({ shortId: req.params.shortId, active: true })
    if (!link) return res.status(404).json({ success: false, error: 'رابط غير صالح' })

    const company = await Company.findById(link.companyId)
    if (!company) return res.status(404).json({ success: false, error: 'الشركة غير موجودة' })

    // Quota check
    if (company.cardsLimit > 0 && company.cardsUsed >= company.cardsLimit) {
      return res.status(403).json({ success: false, error: 'انتهى رصيد الشركة' })
    }

    await Company.findByIdAndUpdate(company._id, {
      $inc: { cardsUsed: 1, 'usage.cardsThisMonth': 1, 'stats.downloads': 1 }
    })

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: 'حدث خطأ' })
  }
})

export default router
