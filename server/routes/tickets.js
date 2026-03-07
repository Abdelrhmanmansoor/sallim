import { Router } from 'express'
import Ticket from '../models/Ticket.js'
import { protectCompanyRoute } from './company.js'

const router = Router()

// Middleware to protect admin routes
const isAdmin = (req, res, next) => {
    const adminKey = req.headers['x-admin-key']
    if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ success: false, error: 'غير مصرح لك للوصول' })
    }
    next()
}

// ═════════════════════════════════════════════
// COMPANY ROUTES
// ═════════════════════════════════════════════

// ═══ Get my tickets ═══
router.get('/my-tickets', protectCompanyRoute, async (req, res) => {
    try {
        const tickets = await Ticket.find({ company: req.company._id }).sort({ createdAt: -1 })
        res.json({ success: true, data: tickets })
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في جلب التذاكر' })
    }
})

// ═══ Create a new ticket ═══
router.post('/my-tickets', protectCompanyRoute, async (req, res) => {
    try {
        const { subject, message, type } = req.body

        if (!subject || !message) {
            return res.status(400).json({ success: false, error: 'العنوان والرسالة مطلوبان' })
        }

        const ticket = await Ticket.create({
            company: req.company._id,
            subject,
            type: type || 'support',
            replies: [{ sender: 'company', message }]
        })

        res.status(201).json({
            success: true,
            message: 'تم إرسال التذكرة بنجاح',
            data: ticket
        })

    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في تقديم التذكرة' })
    }
})

// ═══ Reply to a ticket (Company) ═══
router.post('/my-tickets/:id/reply', protectCompanyRoute, async (req, res) => {
    try {
        const { message } = req.body
        if (!message) return res.status(400).json({ success: false, error: 'الرسالة مطلوبة' })

        const ticket = await Ticket.findOne({ _id: req.params.id, company: req.company._id })

        if (!ticket) {
            return res.status(404).json({ success: false, error: 'التذكرة غير موجودة' })
        }

        if (ticket.status === 'closed') {
            return res.status(400).json({ success: false, error: 'هذه التذكرة مغلقة' })
        }

        ticket.replies.push({ sender: 'company', message })
        ticket.status = 'open' // Status becomes open again since company replied

        await ticket.save()

        res.json({ success: true, message: 'تم إرسال الرد بنجاح', data: ticket })
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء الرد' })
    }
})

// ═════════════════════════════════════════════
// ADMIN ROUTES
// ═════════════════════════════════════════════

// ═══ Get all tickets ═══
router.get('/admin', isAdmin, async (req, res) => {
    try {
        const tickets = await Ticket.find().populate('company', 'name email logoUrl').sort({ createdAt: -1 })
        res.json({ success: true, data: tickets })
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في جلب التذاكر' })
    }
})

// ═══ Reply to a ticket (Admin) ═══
router.post('/admin/:id/reply', isAdmin, async (req, res) => {
    try {
        const { message } = req.body
        if (!message) return res.status(400).json({ success: false, error: 'الرسالة مطلوبة' })

        const ticket = await Ticket.findById(req.params.id)

        if (!ticket) {
            return res.status(404).json({ success: false, error: 'التذكرة غير موجودة' })
        }

        ticket.replies.push({ sender: 'admin', message })
        ticket.status = 'answered'

        await ticket.save()

        res.json({ success: true, message: 'تم إرسال الرد بنجاح', data: ticket })
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء الرد' })
    }
})

// ═══ Close/Update ticket status (Admin) ═══
router.put('/admin/:id/status', isAdmin, async (req, res) => {
    try {
        const { status } = req.body
        const ticket = await Ticket.findById(req.params.id)

        if (!ticket) return res.status(404).json({ success: false, error: 'التذكرة غير موجودة' })

        ticket.status = status
        await ticket.save()

        res.json({ success: true, message: 'تم تحديث حالة التذكرة', data: ticket })
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء التحديث' })
    }
})

export default router
