import { Router } from 'express'
import Stats from '../models/Stats.js'

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
      }),
      { cardsCreated: 0, cardViews: 0, uniqueVisitors: 0 }
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

export default router
