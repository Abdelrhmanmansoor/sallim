import { Router } from 'express'
import Template from '../models/Template.js'

const router = Router()

// ═══ Get all active templates (Public API) ═══
// Used by the editor to list templates. Can be filtered by season.
router.get('/', async (req, res) => {
    try {
        const { season } = req.query

        let query = { isActive: true }
        if (season) {
            query.season = season
        }

        const templates = await Template.find(query).sort({ createdAt: -1 })

        // At this level, we just return all active templates matching season.
        // It's up to the frontend to look at the 'type' and 'requiredFeature'
        // and decide if the current logged-in company is allowed to use them.

        res.json({ success: true, data: templates })
    } catch (error) {
        console.error('Error fetching templates:', error)
        res.status(500).json({ success: false, error: 'حدث خطأ في جلب القوالب' })
    }
})

export default router
