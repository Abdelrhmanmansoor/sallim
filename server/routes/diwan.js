import { Router } from 'express';
import Diwan from '../models/Diwan.js';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit creation of diwans to prevent spam (e.g. 5 per hour per IP)
const createDiwanLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { success: false, error: 'لقد تجاوزت الحد المسموح لإنشاء ديوان جديد. حاول مجدداً لاحقاً.' }
});

// Rate limit greetings (e.g. 20 per hour per IP)
const postGreetingLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: { success: false, error: 'لقد أرسلت تهاني كثيرة مؤخراً. حاول مجدداً لاحقاً.' }
});

// ═══ Create a new Diwan page ═══
router.post('/', createDiwanLimiter, async (req, res) => {
    try {
        let { username, ownerName } = req.body;

        if (!username || !ownerName) {
            return res.status(400).json({ success: false, error: 'اسم المستخدم واسم صاحب الديوان مطلوبان' });
        }

        username = username.toLowerCase().trim();

        // Check if username already exists
        const existing = await Diwan.findOne({ username });
        if (existing) {
            return res.status(400).json({ success: false, error: 'اسم المستخدم هذا مستخدم مسبقاً، اختر اسماً آخر' });
        }

        const diwan = await Diwan.create({
            username,
            ownerName
        });

        res.status(201).json({ success: true, data: diwan });
    } catch (error) {
        console.error('Error creating Diwan:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ في النظام' });
    }
});

// ═══ Get a specific Diwan by username ═══
router.get('/:username', async (req, res) => {
    try {
        const username = req.params.username.toLowerCase().trim();
        const diwan = await Diwan.findOne({ username });

        if (!diwan) {
            return res.status(404).json({ success: false, error: 'لا يوجد ديوان بهذا الاسم' });
        }

        res.json({ success: true, data: diwan });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في النظام' });
    }
});

// ═══ Record a view for a Diwan ═══
router.post('/:username/view', async (req, res) => {
    try {
        const username = req.params.username.toLowerCase().trim();

        const diwan = await Diwan.findOneAndUpdate(
            { username },
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!diwan) {
            return res.status(404).json({ success: false, error: 'لا يوجد ديوان بهذا الاسم' });
        }

        res.json({ success: true, data: { views: diwan.views } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في نظام الزيارات' });
    }
});

// ═══ Add a greeting to a Diwan ═══
router.post('/:username/greet', postGreetingLimiter, async (req, res) => {
    try {
        const username = req.params.username.toLowerCase().trim();
        const { senderName, message } = req.body;

        if (!senderName || !message) {
            return res.status(400).json({ success: false, error: 'اسمك ونص التهنئة مطلوبان' });
        }

        const diwan = await Diwan.findOne({ username });
        if (!diwan) {
            return res.status(404).json({ success: false, error: 'ديوان غير موجود' });
        }

        diwan.greetings.push({
            senderName,
            message
        });

        await diwan.save();

        // Return the newly added greeting (the last one in the array)
        const newGreeting = diwan.greetings[diwan.greetings.length - 1];

        res.status(201).json({ success: true, data: newGreeting });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء إضافة التهنئة' });
    }
});

// ═══ Like a specific greeting ═══
router.post('/:username/greet/:greetId/like', async (req, res) => {
    try {
        const { username, greetId } = req.params;

        const diwan = await Diwan.findOne({ username: username.toLowerCase().trim() });
        if (!diwan) {
            return res.status(404).json({ success: false, error: 'ديوان غير موجود' });
        }

        const greeting = diwan.greetings.id(greetId);
        if (!greeting) {
            return res.status(404).json({ success: false, error: 'التهنئة غير موجودة' });
        }

        greeting.likes += 1;
        await diwan.save();

        res.json({ success: true, data: greeting.likes });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء الإعجاب' });
    }
});

export default router;
