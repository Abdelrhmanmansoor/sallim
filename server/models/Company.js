import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid'

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        default: () => nanoid(10).toLowerCase(),
    },
    password: {
        type: String,
        select: false,
    },
    logoUrl: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'suspended'],
        default: 'pending',
    },
    activationCode: {
        type: String,
        select: false,
    },
    activationExpires: {
        type: Date,
        select: false,
    },
    features: {
        type: [String],
        default: ['basic_templates'], // Can be updated by admin
    },
    role: {
        type: String,
        default: 'company', // admin, company
    },

    // Enterprise: Branding
    brandColors: {
        primary: {
            type: String,
            default: '#2563eb'
        },
        secondary: {
            type: String,
            default: '#1e40af'
        },
        accent: {
            type: String,
            default: '#f59e0b'
        }
    },
    brandFonts: {
        heading: {
            type: String,
            default: 'Cairo'
        },
        body: {
            type: String,
            default: 'Cairo'
        }
    },
    contactInfo: {
        phone: String,
        address: String,
        website: String,
        socialMedia: {
            twitter: String,
            linkedin: String,
            instagram: String
        }
    },

    // Enterprise: Wallet reference
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet'
    },

    // Enterprise: Advanced features
    customTemplates: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template'
    }],
    teamMembers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CompanyTeam'
    }],

    // Enterprise: Settings
    settings: {
        defaultTemplate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Template'
        },
        autoSaveDrafts: {
            type: Boolean,
            default: true
        },
        allowBulkCreation: {
            type: Boolean,
            default: true
        },
        requireApprovalForCampaigns: {
            type: Boolean,
            default: false
        }
    },

    // White Label: Package reference
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package'
    },
    // White Label: Allowed themes for this company
    allowedThemeIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theme'
    }],
    // White Label: Card limits and usage
    cardsLimit: {
        type: Number,
        default: 0 // 0 = unlimited
    },
    cardsUsed: {
        type: Number,
        default: 0
    },
    
    // Enterprise: Subscription info
    subscription: {
        plan: {
            type: String,
            enum: ['basic', 'pro', 'enterprise'],
            default: 'basic'
        },
        startDate: Date,
        renewalDate: Date,
        expiresAt: Date,
        isActive: {
            type: Boolean,
            default: true
        },
        limits: {
            cardsPerMonth: {
                type: Number,
                default: 100
            },
            teamMembers: {
                type: Number,
                default: 3
            },
            campaignsPerMonth: {
                type: Number,
                default: 5
            }
        }
    },

    // Enterprise: Usage tracking
    usage: {
        cardsThisMonth: {
            type: Number,
            default: 0
        },
        campaignsThisMonth: {
            type: Number,
            default: 0
        },
        lastReset: {
            type: Date,
            default: Date.now
        }
    },

    // Enterprise: Onboarding status
    onboardingCompleted: {
        type: Boolean,
        default: false
    },

    // Basic stats for dashboards
    stats: {
        views: { type: Number, default: 0 },
        downloads: { type: Number, default: 0 }
    },

    // Metadata
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true,
})

// Hash password before saving if modified
companySchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    } catch (error) {
        throw error
    }
})

// Compare given password with hashed password
companySchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const Company = mongoose.model('Company', companySchema)
export default Company
