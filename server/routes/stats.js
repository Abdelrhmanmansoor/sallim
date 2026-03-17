import { Router } from 'express'
import Stats from '../models/Stats.js'
import { statsLimiter } from '../middleware/rateLimiter.js'

const router = Router()

// ═══ Get aggregated stats (last 30 days) ═══
router.get('/', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const dateStr = thirtyDaysAgo.toISOString().split('T')[0]

    const stats = await Stats.find({ date: { $gte: dateStr } }).sort({ date: -1 })

    const totals = stats.reduce(
      (acc, s) => ({
        cardsCreated: acc.cardsCreated + s.cardsCreated,
        cardViews: acc.cardViews + s.cardViews,
        uniqueVisitors: acc.uniqueVisitors + s.uniqueVisitors,
        downloads: (acc.downloads || 0) + (s.downloads || 0),
      }),
      { cardsCreated: 0, cardViews: 0, uniqueVisitors: 0, downloads: 0 }
    )

    res.json({
      success: true,
      data: {
        ...totals,
        daily: stats,
      },
    })
  } catch (error) {
    res.status(500).json({ success: false, error: 'حدث خطأ' })
  }
})

// ═══ Increment a specific stat ═══
router.post('/increment', statsLimiter, async (req, res) => {
  try {
    const { field } = req.body
    const allowedFields = ['cardsCreated', 'cardViews', 'uniqueVisitors', 'downloads']

    if (!field || !allowedFields.includes(field)) {
      return res.status(400).json({ success: false, error: 'حقل غير صالح' })
    }

    await Stats.incrementToday(field)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, error: 'حدث خطأ' })
  }
})

export default router
