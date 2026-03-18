import { Router } from 'express'
import Template from '../models/Template.js'
import Company from '../models/Company.js'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const router = Router()

function toNormalizedTemplate(t) {
    const isPaid = Number(t.price || 0) > 0 || t.isFree === false || t.billingType === 'paid'
    return {
        ...t.toObject(),
        isFree: !isPaid,
        billingType: isPaid ? 'paid' : 'free',
        currency: t.currency || 'SAR',
        visibility: t.visibility || 'public',
        companyId: t.companyId ? String(t.companyId) : null,
        product: {
            id: String(t._id),
            type: isPaid ? 'paid' : 'free',
            price: Number(t.price || 0),
            currency: t.currency || 'SAR',
        }
    }
}

function canAccessByType(template, company) {
    const type = template.type || 'public'
    if (type === 'public') return true
    if (!company) return false
    if (type === 'premium') return true
    if (type === 'exclusive') {
        return Boolean(template.requiredFeature && company.features?.includes(template.requiredFeature))
    }
    return false
}

function canAccessByVisibility(template, company) {
    const visibility = template.visibility || 'public'
    if (visibility !== 'company_exclusive') return true
    if (!company || !template.companyId) return false
    return String(template.companyId) === String(company._id)
}

function decodeToken(token) {
    if (!token || !process.env.JWT_SECRET) return null
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch {
        return null
    }
}

async function resolveCompanyContext(req) {
    const slug = String(req.query.companySlug || req.headers['x-company-slug'] || '').trim().toLowerCase()
    if (slug) {
        const bySlug = await Company.findOne({
            slug,
            status: 'active',
            $or: [{ isActive: true }, { isActive: { $exists: false } }]
        })
        if (bySlug) return bySlug
    }

    const accessCode = String(req.query.companyAccessCode || req.headers['x-company-access-code'] || '').trim().toUpperCase()
    if (accessCode) {
        const byAccessCode = await Company.findOne({
            accessCode,
            status: 'active',
            $or: [{ isActive: true }, { isActive: { $exists: false } }]
        })
        if (byAccessCode) return byAccessCode
    }

    const contextToken = String(req.headers['x-company-context-token'] || req.query.companyContextToken || '').trim()
    const contextDecoded = decodeToken(contextToken)
    if (contextDecoded?.type === 'company_context' && contextDecoded.companyId) {
        const byContextToken = await Company.findOne({
            _id: contextDecoded.companyId,
            status: 'active',
            $or: [{ isActive: true }, { isActive: { $exists: false } }]
        })
        if (byContextToken) return byContextToken
    }

    const companyAuthToken = String(req.headers['x-company-auth-token'] || '').trim()
    const companyAuthDecoded = decodeToken(companyAuthToken)
    if (companyAuthDecoded?.id && companyAuthDecoded?.role === 'company') {
        const byCompanyToken = await Company.findOne({
            _id: companyAuthDecoded.id,
            status: 'active',
            $or: [{ isActive: true }, { isActive: { $exists: false } }]
        })
        if (byCompanyToken) return byCompanyToken
    }

    const authHeader = req.headers.authorization || ''
    const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
    const bearerDecoded = decodeToken(bearerToken)
    if (bearerDecoded?.id && bearerDecoded?.role === 'company') {
        const byCompanyBearer = await Company.findOne({
            _id: bearerDecoded.id,
            status: 'active',
            $or: [{ isActive: true }, { isActive: { $exists: false } }]
        })
        if (byCompanyBearer) return byCompanyBearer
    }

    if (bearerDecoded?.userId) {
        const user = await User.findById(bearerDecoded.userId).select('company')
        if (user?.company) {
            const byUserCompany = await Company.findOne({
                _id: user.company,
                status: 'active',
                $or: [{ isActive: true }, { isActive: { $exists: false } }]
            })
            if (byUserCompany) return byUserCompany
        }
    }

    return null
}

// ═══ Get active templates with server-side access control ═══
router.get('/', async (req, res) => {
    try {
        const { season } = req.query
        const company = await resolveCompanyContext(req)

        const query = { isActive: true }
        if (season) {
            query.season = season
        }

        if (company?._id) {
            query.$or = [
                { visibility: { $exists: false } },
                { visibility: 'public' },
                { visibility: 'company_exclusive', companyId: company._id },
            ]
        } else {
            query.$or = [
                { visibility: { $exists: false } },
                { visibility: 'public' },
            ]
        }

        const templates = await Template.find(query).sort({ createdAt: -1 })
        const visibleTemplates = templates.filter((t) => (
            canAccessByType(t, company) && canAccessByVisibility(t, company)
        ))
        const normalized = visibleTemplates.map(toNormalizedTemplate)

        res.json({
            success: true,
            data: normalized,
            companyContext: company ? {
                id: String(company._id),
                slug: company.slug,
                name: company.name,
            } : null
        })
    } catch (error) {
        console.error('Error fetching templates:', error)
        res.status(500).json({ success: false, error: 'حدث خطأ في جلب القوالب' })
    }
})

// ═══ Get single template with server-side access control ═══
router.get('/:templateId', async (req, res) => {
    try {
        const company = await resolveCompanyContext(req)
        const template = await Template.findOne({ _id: req.params.templateId, isActive: true })

        if (!template) {
            return res.status(404).json({ success: false, error: 'القالب غير موجود' })
        }

        if (!canAccessByType(template, company) || !canAccessByVisibility(template, company)) {
            return res.status(404).json({ success: false, error: 'القالب غير موجود' })
        }

        res.json({ success: true, data: toNormalizedTemplate(template) })
    } catch (error) {
        console.error('Error fetching template:', error)
        res.status(500).json({ success: false, error: 'حدث خطأ في جلب القالب' })
    }
})

export default router
