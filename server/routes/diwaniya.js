import { Router } from 'express';
import Diwaniya from '../models/Diwan.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import xss from 'xss';
import Joi from 'joi';

// JWT Secret - MUST be set in environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL ERROR: JWT_SECRET is not defined in environment variables.')
  console.error('👉 Add JWT_SECRET to your .env file and restart the server.')
  process.exit(1)
}
const JWT_SECRET = process.env.JWT_SECRET

const router = Router();

// Rate limit creation of diwaniya pages to prevent spam (e.g. 5 per hour per IP)
const createDiwaniyaLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { success: false, error: 'لقد تجاوزت الحد المسموح لإنشاء ديوانية جديدة. حاول مجدداً لاحقاً.' }
});

// Rate limit greetings (e.g. 20 per hour per IP)
const postGreetingLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: { success: false, error: 'لقد أرسلت تهاني كثيرة مؤخراً. حاول مجدداً لاحقاً.' }
});

// Validation schemas
const createDiwaniyaSchema = Joi.object({
    username: Joi.string().pattern(/^[a-zA-Z0-9_\-]+$/).min(3).max(30).required().messages({
        'string.pattern.base': 'اسم المستخدم يجب أن يحتوي على حروف إنجليزية وأرقام فقط',
        'string.min': 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل',
        'string.max': 'اسم المستخدم يجب أن يكون 30 حرف كحد أقصى',
        'any.required': 'اسم المستخدم مطلوب'
    }),
    ownerName: Joi.string().min(2).max(50).required().messages({
        'string.min': 'الاسم يجب أن يكون 2 أحرف على الأقل',
        'string.max': 'الاسم يجب أن يكون 50 حرف كحد أقصى',
        'any.required': 'الاسم مطلوب'
    })
});

const greetingSchema = Joi.object({
    senderName: Joi.string().min(2).max(50).optional().allow('').messages({
        'string.min': 'الاسم يجب أن يكون 2 أحرف على الأقل',
        'string.max': 'الاسم يجب أن يكون 50 حرف كحد أقصى'
    }),
    senderEmail: Joi.string().email().optional().allow('').messages({
        'string.email': 'البريد الإلكتروني غير صالح'
    }),
    senderAvatar: Joi.string().optional().allow(''),
    message: Joi.string().min(5).max(500).required().messages({
        'string.min': 'نص التهنئة يجب أن يكون 5 أحرف على الأقل',
        'string.max': 'نص التهنئة يجب أن يكون 500 حرف كحد أقصى',
        'any.required': 'نص التهنئة مطلوب'
    }),
    isAnonymous: Joi.boolean().default(true),
    visibility: Joi.string().valid('public', 'private').default('public').messages({
        'any.only': 'قيمة الرؤية يجب أن تكون عامة أو خاصة'
    })
});

// Eidiya Game validation schemas
const questionSchema = Joi.object({
    question: Joi.string().min(5).max(500).required().messages({
        'string.min': 'السؤال يجب أن يكون 5 أحرف على الأقل',
        'string.max': 'السؤال يجب أن يكون 500 حرف كحد أقصى',
        'any.required': 'السؤال مطلوب'
    }),
    answers: Joi.array().items(Joi.string().required()).min(2).max(6).required().messages({
        'array.min': 'يجب إضافة إجابتين على الأقل',
        'array.max': 'الحد الأقصى 6 إجابات'
    }),
    correctAnswer: Joi.number().min(0).required().messages({
        'any.required': 'رقم الإجابة الصحيحة مطلوب'
    }),
    rewardAmount: Joi.number().min(1).max(1000).required().messages({
        'number.min': 'المكافأة يجب أن تكون 1 ريال على الأقل',
        'number.max': 'المكافأة يجب أن لا تتجاوز 1000 ريال',
        'any.required': 'المكافأة مطلوبة'
    })
});

const answerSubmissionSchema = Joi.object({
    questionIndex: Joi.number().min(0).required(),
    answerIndex: Joi.number().min(0).required(),
    sessionId: Joi.string().required()
});

const visibilityUpdateSchema = Joi.object({
    visibility: Joi.string().valid('public', 'private').required().messages({
        'any.only': 'قيمة الرؤية يجب أن تكون عامة أو خاصة',
        'any.required': 'قيمة الرؤية مطلوبة'
    })
});

// ═══ Create a new Diwaniya page ═══
router.post('/', async (req, res) => {
    try {
        console.log('POST /diwaniya - Request body:', req.body);
        console.log('POST /diwaniya - Headers:', req.headers.authorization);

        // Validate input
        const { error, value } = createDiwaniyaSchema.validate(req.body);
        if (error) {
            console.log('Validation error:', error.details[0].message);
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const { username, ownerName } = value;

        // Check if username already exists
        const existing = await Diwaniya.findOne({ username });
        if (existing) {
            console.log('Username already exists:', username);
            return res.status(400).json({ success: false, error: 'اسم المستخدم هذا مستخدم مسبقاً، اختر اسماً آخر' });
        }

        // Get user from token if available
        let userId = null;
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                userId = decoded.userId;
                console.log('User ID from token:', userId);
            } catch (error) {
                // Invalid token, but we'll still create the diwaniya (anonymous creation)
                console.log('Invalid token provided, creating anonymous diwaniya');
            }
        }

        const diwaniya = await Diwaniya.create({
            user: userId,
            username,
            ownerName
        });

        console.log('Diwaniya created:', diwaniya._id);

        // If user is logged in, add diwaniya to user's diwaniyas array
        if (userId) {
            const user = await User.findById(userId);
            if (user) {
                user.diwaniyas.push(diwaniya._id);
                await user.save();
                console.log('Diwaniya added to user:', userId);
            }
        }

        res.status(201).json({ success: true, data: diwaniya });
    } catch (error) {
        console.error('Error creating Diwaniya:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ في النظام' });
    }
});

// ═══ Update Diwaniya settings (owner action) ═══
router.put('/:username', async (req, res) => {
    try {
        const username = req.params.username.toLowerCase().trim();
        const { isFamilyMode, eidiyaGameEnabled } = req.body;

        const diwaniya = await Diwaniya.findOne({ username });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'ديوانية غير موجودة' });
        }

        if (isFamilyMode !== undefined) diwaniya.isFamilyMode = isFamilyMode;

        if (eidiyaGameEnabled !== undefined) {
            if (!diwaniya.eidiyaGame) diwaniya.eidiyaGame = {};
            diwaniya.eidiyaGame.enabled = eidiyaGameEnabled;
        }

        await diwaniya.save();
        res.json({ success: true, data: diwaniya });
    } catch (error) {
        console.error('Error updating Diwaniya settings:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء تحديث الإعدادات' });
    }
});

// ═══ Get a specific Diwaniya by username (public view) ═══
router.get('/:username', async (req, res) => {
    try {
        const username = req.params.username.toLowerCase().trim();
        const diwaniya = await Diwaniya.findOne({ username });

        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'لا توجد ديوانية بهذا الاسم' });
        }

        // Only return public greetings for public view
        const publicGreetings = diwaniya.greetings
            .filter(g => g.visibility === 'public')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({
            success: true,
            data: {
                ...diwaniya.toObject(),
                greetings: publicGreetings,
                totalGreetings: diwaniya.greetings.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في النظام' });
    }
});

// ═══ Get all greetings for owner (including private) ═══
router.get('/:username/manage', async (req, res) => {
    try {
        const username = req.params.username.toLowerCase().trim();
        const diwaniya = await Diwaniya.findOne({ username });

        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'ديوانية غير موجودة' });
        }

        // Return all greetings sorted by date
        const allGreetings = diwaniya.greetings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({
            success: true,
            data: {
                ...diwaniya.toObject(),
                greetings: allGreetings
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في النظام' });
    }
});

// ═══ Record a view for a Diwaniya ═══
router.post('/:username/view', async (req, res) => {
    try {
        const username = req.params.username.toLowerCase().trim();

        // Use findOneAndUpdate with $inc for atomic update
        const diwaniya = await Diwaniya.findOneAndUpdate(
            { username },
            { $inc: { views: 1 } },
            { new: true }
        );

        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'ديوانية غير موجودة' });
        }

        res.json({ success: true, data: { views: diwaniya.views } });
    } catch (error) {
        console.error('Error recording view:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ في النظام' });
    }
});
// ═══ Add a greeting to a Diwaniya ═══
router.post('/:username/greet', postGreetingLimiter, async (req, res) => {
    try {
        const username = req.params.username.toLowerCase().trim();

        // Validate input
        const { error, value } = greetingSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const { senderName, senderEmail, senderAvatar, message, isAnonymous, visibility } = value;

        const diwaniya = await Diwaniya.findOne({ username });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'ديوانية غير موجودة' });
        }

        // If not anonymous, sender name is required
        if (!isAnonymous && !senderName) {
            return res.status(400).json({ success: false, error: 'اسمك مطلوب إذا كنت تريد إرسال التهنئة باسمك' });
        }

        // Sanitize all inputs with XSS protection
        const newGreeting = {
            senderName: isAnonymous ? null : xss(senderName || ''),
            senderEmail: isAnonymous ? null : xss(senderEmail || ''),
            senderAvatar: isAnonymous ? null : senderAvatar || '',
            message: xss(message),
            isAnonymous: isAnonymous !== undefined ? isAnonymous : true,
            visibility: visibility || 'public'
        };

        diwaniya.greetings.push(newGreeting);
        await diwaniya.save();

        // Return the newly added greeting (the last one in the array)
        const addedGreeting = diwaniya.greetings[diwaniya.greetings.length - 1];

        res.status(201).json({ success: true, data: addedGreeting });
    } catch (error) {
        console.error('Error adding greeting:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء إضافة التهنئة' });
    }
});

// ═══ Like a specific greeting ═══
router.post('/:username/greet/:greetId/like', async (req, res) => {
    try {
        const { username, greetId } = req.params;

        const diwaniya = await Diwaniya.findOne({ username: username.toLowerCase().trim() });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'ديوانية غير موجودة' });
        }

        const greeting = diwaniya.greetings.id(greetId);
        if (!greeting) {
            return res.status(404).json({ success: false, error: 'التهنئة غير موجودة' });
        }

        greeting.likes += 1;
        await diwaniya.save();

        res.json({ success: true, data: greeting.likes });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء الإعجاب' });
    }
});

// ═══ Update greeting visibility (owner action) ═══
router.put('/:username/greet/:greetId/visibility', async (req, res) => {
    try {
        const { username, greetId } = req.params;

        // Validate input
        const { error, value } = visibilityUpdateSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const { visibility } = value;

        const diwaniya = await Diwaniya.findOne({ username: username.toLowerCase().trim() });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'ديوانية غير موجودة' });
        }

        const greeting = diwaniya.greetings.id(greetId);
        if (!greeting) {
            return res.status(404).json({ success: false, error: 'التهنئة غير موجودة' });
        }

        greeting.visibility = visibility;
        await diwaniya.save();

        res.json({ success: true, data: greeting });
    } catch (error) {
        console.error('Error updating visibility:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء تحديث الرؤية' });
    }
});

// ═══ Delete a greeting (owner action) ═══
router.delete('/:username/greet/:greetId', async (req, res) => {
    try {
        const { username, greetId } = req.params;

        const diwaniya = await Diwaniya.findOne({ username: username.toLowerCase().trim() });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'ديوانية غير موجودة' });
        }

        const greetingIndex = diwaniya.greetings.findIndex(g => g._id.toString() === greetId);
        if (greetingIndex === -1) {
            return res.status(404).json({ success: false, error: 'التهنئة غير موجودة' });
        }

        diwaniya.greetings.splice(greetingIndex, 1);
        await diwaniya.save();

        res.json({ success: true, message: 'تم حذف التهنئة بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء حذف التهنئة' });
    }
});

// ═══ EIDIYA GAME ROUTES ═══

// Rate limit game answers (prevent spam)
const gameAnswerLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // max 10 answers per minute
    message: { success: false, error: 'يرجى الانتظار قليلاً قبل الإجابة مرة أخرى' }
});

// Get Eidiya Game status and questions
router.get('/:username/game', async (req, res) => {
    try {
        const username = req.params.username.toLowerCase().trim();
        const diwaniya = await Diwaniya.findOne({ username });

        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'ديوانية غير موجودة' });
        }

        if (!diwaniya.eidiyaGame || !diwaniya.eidiyaGame.enabled) {
            return res.status(404).json({ success: false, error: 'اللعبة غير مفعلة حالياً' });
        }

        // Return only questions (without correct answers and without player attempts)
        const questions = diwaniya.eidiyaGame.questions.map(q => ({
            question: q.question,
            answers: q.answers,
            rewardAmount: q.rewardAmount
        }));

        res.json({
            success: true,
            data: {
                enabled: diwaniya.eidiyaGame.enabled,
                totalQuestions: questions.length,
                questions
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في النظام' });
    }
});

// Get Eidiya Game status with sessionId (check if player can play)
router.get('/:username/game/status', async (req, res) => {
    try {
        const username = req.params.username.toLowerCase().trim();
        const { sessionId } = req.query;

        if (!sessionId) {
            return res.status(400).json({ success: false, error: 'معرف الجلسة مطلوب' });
        }

        const diwaniya = await Diwaniya.findOne({ username });

        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'ديوانية غير موجودة' });
        }

        if (!diwaniya.eidiyaGame || !diwaniya.eidiyaGame.enabled) {
            return res.status(404).json({ success: false, error: 'اللعبة غير مفعلة حالياً' });
        }

        // Check if this sessionId has already completed the game
        const existingAttempt = diwaniya.eidiyaGame.playerAttempts?.find(
            attempt => attempt.sessionId === sessionId
        );

        if (existingAttempt) {
            return res.json({
                success: true,
                data: {
                    canPlay: false,
                    message: 'لقد قمت باللعب مسبقاً!',
                    previousScore: existingAttempt.score,
                    totalQuestions: diwaniya.eidiyaGame.questions.length
                }
            });
        }

        res.json({
            success: true,
            data: {
                canPlay: true,
                totalQuestions: diwaniya.eidiyaGame.questions.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في النظام' });
    }
});

// Submit an answer
router.post('/:username/game/answer', gameAnswerLimiter, async (req, res) => {
    try {
        const username = req.params.username.toLowerCase().trim();

        // Validate input
        const { error, value } = answerSubmissionSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const { questionIndex, answerIndex, sessionId } = value;

        const diwaniya = await Diwaniya.findOne({ username });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'ديوانية غير موجودة' });
        }

        if (!diwaniya.eidiyaGame || !diwaniya.eidiyaGame.enabled) {
            return res.status(404).json({ success: false, error: 'اللعبة غير مفعلة حالياً' });
        }

        const question = diwaniya.eidiyaGame.questions[questionIndex];
        if (!question) {
            return res.status(400).json({ success: false, error: 'السؤال غير موجود' });
        }

        // Check if answerIndex is valid
        if (answerIndex < 0 || answerIndex >= question.answers.length) {
            return res.status(400).json({ success: false, error: 'الإجابة غير صحيحة' });
        }

        const isCorrect = answerIndex === question.correctAnswer;

        // Find or create player attempt
        let playerAttempt = diwaniya.eidiyaGame.playerAttempts?.find(
            attempt => attempt.sessionId === sessionId
        );

        if (!playerAttempt) {
            if (!diwaniya.eidiyaGame.playerAttempts) {
                diwaniya.eidiyaGame.playerAttempts = [];
            }

            playerAttempt = {
                sessionId,
                score: 0,
                answeredQuestions: [],
                completedAt: new Date()
            };
            diwaniya.eidiyaGame.playerAttempts.push(playerAttempt);
        }

        // Check if this question was already answered
        const alreadyAnswered = playerAttempt.answeredQuestions?.some(
            aq => aq.questionIndex === questionIndex
        );

        if (alreadyAnswered) {
            return res.status(400).json({
                success: false,
                error: 'لقد أجبت على هذا السؤال مسبقاً'
            });
        }

        // Record the answer
        if (!playerAttempt.answeredQuestions) {
            playerAttempt.answeredQuestions = [];
        }

        playerAttempt.answeredQuestions.push({
            questionIndex,
            isCorrect,
            timestamp: new Date()
        });

        if (isCorrect) {
            playerAttempt.score += question.rewardAmount;
        }

        await diwaniya.save();

        res.json({
            success: true,
            data: {
                isCorrect,
                rewardAmount: question.rewardAmount,
                currentScore: playerAttempt.score,
                answeredQuestions: playerAttempt.answeredQuestions.length,
                totalQuestions: diwaniya.eidiyaGame.questions.length,
                correctAnswer: isCorrect ? null : question.answers[question.correctAnswer]
            }
        });
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ في النظام' });
    }
});

// Update Eidiya Game questions (owner action)
router.put('/:username/game', async (req, res) => {
    try {
        const username = req.params.username.toLowerCase().trim();

        // Validate questions array
        const { questions, enabled } = req.body;

        if (enabled !== undefined && typeof enabled !== 'boolean') {
            return res.status(400).json({ success: false, error: 'قيمة التفعيل غير صحيحة' });
        }

        if (questions) {
            if (!Array.isArray(questions)) {
                return res.status(400).json({ success: false, error: 'الأسئلة يجب أن تكون مصفوفة' });
            }

            // Validate each question
            for (let i = 0; i < questions.length; i++) {
                const { error } = questionSchema.validate(questions[i]);
                if (error) {
                    return res.status(400).json({
                        success: false,
                        error: `خطأ في السؤال ${i + 1}: ${error.details[0].message}`
                    });
                }
            }
        }

        const diwaniya = await Diwaniya.findOne({ username });
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'ديوانية غير موجودة' });
        }

        if (!diwaniya.eidiyaGame) {
            diwaniya.eidiyaGame = {};
        }

        if (questions !== undefined) {
            diwaniya.eidiyaGame.questions = questions;
        }

        if (enabled !== undefined) {
            diwaniya.eidiyaGame.enabled = enabled;
        }

        await diwaniya.save();

        res.json({ success: true, data: diwaniya.eidiyaGame });
    } catch (error) {
        console.error('Error updating game:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ في النظام' });
    }
});

// Get game statistics (owner action)
router.get('/:username/game/stats', async (req, res) => {
    try {
        const username = req.params.username.toLowerCase().trim();
        const diwaniya = await Diwaniya.findOne({ username });

        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'ديوانية غير موجودة' });
        }

        if (!diwaniya.eidiyaGame) {
            return res.json({
                success: true,
                data: {
                    enabled: false,
                    totalQuestions: 0,
                    totalPlayers: 0,
                    averageScore: 0
                }
            });
        }

        const playerAttempts = diwaniya.eidiyaGame.playerAttempts || [];
        const totalPlayers = playerAttempts.length;
        const averageScore = totalPlayers > 0
            ? playerAttempts.reduce((sum, p) => sum + p.score, 0) / totalPlayers
            : 0;

        res.json({
            success: true,
            data: {
                enabled: diwaniya.eidiyaGame.enabled,
                totalQuestions: diwaniya.eidiyaGame.questions?.length || 0,
                totalPlayers,
                averageScore: Math.round(averageScore)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'حدث خطأ في النظام' });
    }
});

export default router;
