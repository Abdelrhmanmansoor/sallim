import { Router } from 'express';
import Diwaniya from '../models/Diwan.js';
import Joi from 'joi';
import NodeCache from 'node-cache';

const router = Router();

// Cache for public diwaniya data (10 minutes TTL)
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

// Validation schemas
const eidiyaRequestSchema = Joi.object({
    requesterName: Joi.string().min(2).max(50).required().messages({
        'string.min': 'الاسم يجب أن يكون 2 أحرف على الأقل',
        'string.max': 'الاسم طويل جداً',
        'any.required': 'الاسم مطلوب'
    }),
    requesterEmail: Joi.string().email().optional().messages({
        'string.email': 'البريد الإلكتروني غير صالح'
    }),
    amount: Joi.number().min(0).optional(),
    message: Joi.string().max(200).optional().messages({
        'string.max': 'الرسالة طويلة جداً (200 حرف كحد أقصى)'
    })
});

const familyMemberSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.min': 'الاسم يجب أن يكون 2 أحرف على الأقل',
        'string.max': 'الاسم طويل جداً',
        'any.required': 'الاسم مطلوب'
    }),
    relation: Joi.string().valid('father', 'mother', 'brother', 'sister', 'grandfather', 'grandmother', 'uncle', 'aunt', 'cousin', 'other').required().messages({
        'any.required': 'القرابة مطلوبة',
        'any.only': 'قيمة القرابة غير صالحة'
    }),
    email: Joi.string().email().optional().messages({
        'string.email': 'البريد الإلكتروني غير صالح'
    })
});

const familyStorySchema = Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
        'string.min': 'العنوان قصير جداً',
        'string.max': 'العنوان طويل جداً',
        'any.required': 'العنوان مطلوب'
    }),
    story: Joi.string().min(10).max(1000).required().messages({
        'string.min': 'القصة قصيرة جداً',
        'string.max': 'القصة طويلة جداً (1000 حرف كحد أقصى)',
        'any.required': 'القصة مطلوبة'
    }),
    type: Joi.string().valid('memory', 'update').required(),
    author: Joi.string().max(50).optional()
});

// ═══ Toggle Family Mode ═══
router.put('/:username/family-mode', async (req, res) => {
    try {
        const { isFamilyMode } = req.body;

        const diwaniya = await Diwaniya.findOne({ username: req.params.username });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'الديوانية غير موجودة' });
        }

        diwaniya.isFamilyMode = isFamilyMode;
        await diwaniya.save();

        // Invalidate cache
        cache.del(req.params.username);

        res.json({ success: true, data: diwaniya });
    } catch (error) {
        console.error('Family mode toggle error:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء التحديث' });
    }
});

// ═══ Eidiya Requests ═══

// Create eidiya request
router.post('/:username/eidiya-request', async (req, res) => {
    try {
        const { error, value } = eidiyaRequestSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const diwaniya = await Diwaniya.findOne({ username: req.params.username });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'الديوانية غير موجودة' });
        }

        if (!diwaniya.isFamilyMode) {
            return res.status(400).json({ success: false, error: 'وضع العائلة غير مُفعّل' });
        }

        const request = {
            ...value,
            status: 'pending',
            createdAt: new Date()
        };

        diwaniya.eidiyaRequests.push(request);
        await diwaniya.save();

        res.json({ success: true, data: request });
    } catch (error) {
        console.error('Eidiya request error:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء إرسال الطلب' });
    }
});

// Get all eidiya requests
router.get('/:username/eidiya-requests', async (req, res) => {
    try {
        const diwaniya = await Diwaniya.findOne({ username: req.params.username });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'الديوانية غير موجودة' });
        }

        res.json({ success: true, data: diwaniya.eidiyaRequests });
    } catch (error) {
        console.error('Get eidiya requests error:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء جلب الطلبات' });
    }
});

// Update eidiya request status
router.put('/:username/eidiya-request/:requestId', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: 'الحالة غير صالحة' });
        }

        const diwaniya = await Diwaniya.findOne({ username: req.params.username });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'الديوانية غير موجودة' });
        }

        const request = diwaniya.eidiyaRequests.id(req.params.requestId);
        if (!request) {
            return res.status(404).json({ success: false, error: 'الطلب غير موجود' });
        }

        request.status = status;
        await diwaniya.save();

        res.json({ success: true, data: request });
    } catch (error) {
        console.error('Update eidiya request error:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء تحديث الطلب' });
    }
});

// ═══ Family Members ═══

// Add family member
router.post('/:username/family-member', async (req, res) => {
    try {
        const { error, value } = familyMemberSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const diwaniya = await Diwaniya.findOne({ username: req.params.username });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'الديوانية غير موجودة' });
        }

        if (!diwaniya.isFamilyMode) {
            return res.status(400).json({ success: false, error: 'وضع العائلة غير مُفعّل' });
        }

        const member = {
            ...value,
            joinedAt: new Date()
        };

        diwaniya.familyMembers.push(member);
        await diwaniya.save();

        res.json({ success: true, data: member });
    } catch (error) {
        console.error('Add family member error:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء إضافة فرد العائلة' });
    }
});

// Delete family member
router.delete('/:username/family-member/:memberId', async (req, res) => {
    try {
        const diwaniya = await Diwaniya.findOne({ username: req.params.username });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'الديوانية غير موجودة' });
        }

        diwaniya.familyMembers.id(req.params.memberId).remove();
        await diwaniya.save();

        res.json({ success: true, message: 'تم حذف فرد العائلة' });
    } catch (error) {
        console.error('Delete family member error:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء حذف فرد العائلة' });
    }
});

// ═══ Family Stories ═══

// Add family story
router.post('/:username/family-story', async (req, res) => {
    try {
        const { error, value } = familyStorySchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const diwaniya = await Diwaniya.findOne({ username: req.params.username });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'الديوانية غير موجودة' });
        }

        if (!diwaniya.isFamilyMode) {
            return res.status(400).json({ success: false, error: 'وضع العائلة غير مُفعّل' });
        }

        const story = {
            ...value,
            createdAt: new Date()
        };

        diwaniya.familyStories.push(story);
        await diwaniya.save();

        res.json({ success: true, data: story });
    } catch (error) {
        console.error('Add family story error:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء إضافة القصة' });
    }
});

// Delete family story
router.delete('/:username/family-story/:storyId', async (req, res) => {
    try {
        const diwaniya = await Diwaniya.findOne({ username: req.params.username });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'الديوانية غير موجودة' });
        }

        diwaniya.familyStories.id(req.params.storyId).remove();
        await diwaniya.save();

        res.json({ success: true, message: 'تم حذف القصة' });
    } catch (error) {
        console.error('Delete family story error:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء حذف القصة' });
    }
});

// ═══ Get Family Mode Data (with cache) ═══
router.get('/:username/family-data', async (req, res) => {
    try {
        const cacheKey = `family-${req.params.username}`;
        const cached = cache.get(cacheKey);

        if (cached) {
            return res.json({ success: true, data: cached, cached: true });
        }

        const diwaniya = await Diwaniya.findOne({ username: req.params.username });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'الديوانية غير موجودة' });
        }

        const familyData = {
            isFamilyMode: diwaniya.isFamilyMode,
            familyMembers: diwaniya.familyMembers,
            familyStories: diwaniya.familyStories,
            eidiyaRequests: diwaniya.eidiyaRequests.filter(r => r.status === 'approved')
        };

        cache.set(cacheKey, familyData);
        res.json({ success: true, data: familyData, cached: false });
    } catch (error) {
        console.error('Get family data error:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء جلب البيانات' });
    }
});

export default router;