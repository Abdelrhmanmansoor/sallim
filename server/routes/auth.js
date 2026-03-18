import { Router } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Diwaniya from '../models/Diwan.js';
import Company from '../models/Company.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import Joi from 'joi';

const router = Router();

// JWT Secret - MUST be set in environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL ERROR: JWT_SECRET is not defined in environment variables.')
  console.error('👉 Add JWT_SECRET to your .env file and restart the server.')
  process.exit(1)
}
const JWT_SECRET = process.env.JWT_SECRET

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
};

// Validation schemas
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.min': 'الاسم يجب أن يكون 2 أحرف على الأقل',
        'string.max': 'الاسم يجب أن يكون 50 حرف كحد أقصى',
        'any.required': 'الاسم مطلوب'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'البريد الإلكتروني غير صالح',
        'any.required': 'البريد الإلكتروني مطلوب'
    }),
    password: Joi.string().min(6).max(100).required().messages({
        'string.min': 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
        'string.max': 'كلمة المرور طويلة جداً',
        'any.required': 'كلمة المرور مطلوبة'
    }),
    companySlug: Joi.string().trim().lowercase().optional().allow(''),
    companyAccessCode: Joi.string().trim().uppercase().optional().allow('')
});

const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(50).optional(),
    bio: Joi.string().max(200).allow('').optional(),
    avatar: Joi.string().optional().allow('', null)
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'البريد الإلكتروني غير صالح',
        'any.required': 'البريد الإلكتروني مطلوب'
    }),
    password: Joi.string().required().messages({
        'any.required': 'كلمة المرور مطلوبة'
    }),
    role: Joi.string().optional()
});

import bcrypt from 'bcryptjs';

const claimDiwaniyaSchema = Joi.object({
    diwaniyaId: Joi.string().required().messages({
        'any.required': 'معرف الديوانية مطلوب'
    })
});

async function resolveActiveCompany({ companySlug, companyAccessCode }) {
    if (companySlug) {
        return Company.findOne({
            slug: String(companySlug).trim().toLowerCase(),
            status: 'active',
            $or: [{ isActive: true }, { isActive: { $exists: false } }]
        })
    }
    if (companyAccessCode) {
        return Company.findOne({
            accessCode: String(companyAccessCode).trim().toUpperCase(),
            status: 'active',
            $or: [{ isActive: true }, { isActive: { $exists: false } }]
        })
    }
    return null
}

// ═══ Register New User ═══
router.post('/register', authLimiter, async (req, res) => {
    try {
        // Validate input
        const { error, value } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const { name, email, password, companySlug, companyAccessCode } = value;

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'هذا البريد الإلكتروني مستخدم بالفعل' });
        }

        const linkedCompany = await resolveActiveCompany({ companySlug, companyAccessCode });

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            company: linkedCompany?._id || null,
        });

        // Generate token
        const token = generateToken(user._id);
        const createdUser = await User.findById(user._id)
            .populate('diwaniyas')
            .populate('company', 'name slug logoUrl brandColors allowedFonts status isActive');

        res.status(201).json({
            success: true,
            data: {
                user: createdUser,
                token
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء التسجيل' });
    }
});

// ═══ Login User ═══
router.post('/login', authLimiter, async (req, res) => {
    try {
        // Validate input
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const { email, password } = value;

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

        // Generate token
        const token = generateToken(user._id);

        // Populate diwaniyas
        const userWithDiwaniyas = await User.findById(user._id)
            .populate('diwaniyas')
            .populate('company', 'name slug logoUrl brandColors allowedFonts status isActive');

        res.json({
            success: true,
            data: {
                user: userWithDiwaniyas,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء تسجيل الدخول' });
    }
});

// ═══ Claim Diwaniya (link existing diwaniya to user) ═══
router.post('/claim-diwaniya', async (req, res) => {
    try {
        // Get user from token
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ success: false, error: 'يرجى تسجيل الدخول' });
        }

        // Validate token
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ success: false, error: 'المستخدم غير موجود' });
        }

        // Validate input
        const { error, value } = claimDiwaniyaSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const { diwaniyaId } = value;

        // Find diwaniya
        const diwaniya = await Diwaniya.findById(diwaniyaId);
        if (!diwaniya) {
            return res.status(404).json({ success: false, error: 'الديوانية غير موجودة' });
        }

        // Check if already claimed
        if (user.diwaniyas.includes(diwaniyaId)) {
            return res.status(400).json({ success: false, error: 'الديوانية مرتبطة بحسابك بالفعل' });
        }

        // Add diwaniya to user
        user.diwaniyas.push(diwaniyaId);
        await user.save();

        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Claim error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, error: 'رمز المصادقة غير صالح' });
        }
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء ربط الديوانية' });
    }
});

// ═══ Get User Profile ═══
router.get('/profile', async (req, res) => {
    try {
        // Get user from token
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ success: false, error: 'يرجى تسجيل الدخول' });
        }

        // Validate token
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId)
            .populate('diwaniyas')
            .populate('company', 'name slug logoUrl brandColors allowedFonts status isActive');

        if (!user) {
            return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Profile error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, error: 'رمز المصادقة غير صالح' });
        }
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء جلب البيانات' });
    }
});

// ═══ Update User Profile ═══
router.put('/profile', async (req, res) => {
    try {
        // Get user from token
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ success: false, error: 'يرجى تسجيل الدخول' });
        }

        // Validate token
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
        }

        // Validate input
        const { error, value } = updateProfileSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, error: error.details[0].message });
        }

        const { name, bio, avatar } = value;

        // Build update object with only provided fields
        const updates = {};
        if (name) updates.name = name;
        if (bio !== undefined) updates.bio = bio;
        if (avatar !== undefined) updates.avatar = avatar;

        // Update user directly (avoiding pre-save hook for password re-hashing)
        await User.findByIdAndUpdate(user._id, { $set: updates }, { returnDocument: 'after' });

        // Return updated user with populated diwaniyas
        const updatedUser = await User.findById(user._id)
            .populate('diwaniyas')
            .populate('company', 'name slug logoUrl brandColors allowedFonts status isActive');

        res.json({ success: true, data: updatedUser });
    } catch (error) {
        console.error('Update profile error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, error: 'رمز المصادقة غير صالح' });
        }
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء تحديث البيانات' });
    }
});

// ═══ Link User Account to Company (slug or access code) ═══
router.post('/link-company', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ success: false, error: 'يرجى تسجيل الدخول' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'المستخدم غير موجود' });
        }

        const companySlug = String(req.body?.companySlug || '').trim().toLowerCase();
        const companyAccessCode = String(req.body?.companyAccessCode || '').trim().toUpperCase();
        const linkedCompany = await resolveActiveCompany({ companySlug, companyAccessCode });

        if (!linkedCompany) {
            return res.status(404).json({ success: false, error: 'الشركة غير موجودة أو غير مفعلة' });
        }

        user.company = linkedCompany._id;
        await user.save();

        const userWithCompany = await User.findById(user._id)
            .populate('diwaniyas')
            .populate('company', 'name slug logoUrl brandColors allowedFonts status isActive');

        res.json({ success: true, data: userWithCompany });
    } catch (error) {
        console.error('Link company error:', error);
        res.status(500).json({ success: false, error: 'حدث خطأ أثناء ربط الشركة' });
    }
});

// ═══ One-time Admin Setup (creates or upgrades admin user) ═══
// PROTECTED: requires X-Admin-Key header (disabled in production unless key is set)
router.get('/setup-admin-x9k2', async (req, res) => {
  // Require admin key to prevent unauthorized setup
  const adminKey = req.headers['x-admin-key']
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ success: false, error: 'غير مصرح' })
  }
  try {
    const byEmail = await User.findOne({ email: 'admin@sallim.co' })
    if (byEmail) {
      if (byEmail.role === 'admin') {
        return res.json({ success: false, message: 'Admin already exists', email: byEmail.email })
      }
      byEmail.role = 'admin'
      await byEmail.save()
      return res.json({ success: true, message: 'Admin role granted', email: byEmail.email })
    }
    // Create fresh admin — password must be passed via env var ADMIN_INITIAL_PASSWORD
    const initialPassword = process.env.ADMIN_INITIAL_PASSWORD
    if (!initialPassword) {
      return res.status(400).json({ success: false, error: 'ADMIN_INITIAL_PASSWORD env var not set' })
    }
    const hashedPassword = await bcrypt.hash(initialPassword, 12)
    await User.create({
      name: 'مدير النظام',
      email: 'admin@sallim.co',
      password: hashedPassword,
      role: 'admin',
      avatar: '',
    })
    // Never return password in response
    res.json({ success: true, message: 'Admin created', email: 'admin@sallim.co' })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router;
