import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

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
    }
}, {
    timestamps: true,
})

// Hash password before saving if modified
companySchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next()

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

// Compare given password with hashed password
companySchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const Company = mongoose.model('Company', companySchema)
export default Company
