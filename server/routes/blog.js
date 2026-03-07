import { Router } from 'express'
import Post from '../models/Post.js'

const router = Router()

// ═══ Get all published posts (Public) ═══
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({ status: 'published' }).sort({ createdAt: -1 })
        res.json({ success: true, data: posts })
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في عرض المقالات' })
    }
})

// ═══ Get a specific post by slug (Public) ═══
router.get('/:slug', async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug, status: 'published' })
        if (!post) {
            return res.status(404).json({ success: false, error: 'المقال غير موجود' })
        }

        // Increment views
        post.views += 1
        await post.save()

        res.json({ success: true, data: post })
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في جلب المقال' })
    }
})

export default router
