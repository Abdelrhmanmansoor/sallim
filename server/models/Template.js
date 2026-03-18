import mongoose from 'mongoose'

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['public', 'premium', 'exclusive'],
        default: 'public'
        // public = everyone can see
        // premium = only companies with premium feature flag
        // exclusive = only specific targeted companies (e.g if it matches their specific feature flag like "VIP_SALLIM")
    },
    // Which feature flag unlocks this if it's not public
    requiredFeature: {
        type: String,
    },
    season: {
        type: String,
        enum: ['eid_al_fitr', 'eid_al_adha', 'ramadan', 'general'],
        default: 'eid_al_fitr'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    visibility: {
        type: String,
        enum: ['public', 'company_exclusive'],
        default: 'public',
        index: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default: null,
        index: true
    },
    price: {
        type: Number,
        default: 0
    },
    isFree: {
        type: Boolean,
        default: true
    },
    billingType: {
        type: String,
        enum: ['free', 'paid'],
        default: 'free',
        index: true
    },
    currency: {
        type: String,
        default: 'SAR',
        trim: true
    }
}, { timestamps: true })

templateSchema.pre('save', function normalizeBilling(next) {
    const price = Number(this.price || 0)
    const isPaid = price > 0 || this.isFree === false || this.billingType === 'paid'
    this.isFree = !isPaid
    this.billingType = isPaid ? 'paid' : 'free'
    if (!this.currency) this.currency = 'SAR'
    if (this.companyId && this.visibility !== 'company_exclusive') {
        this.visibility = 'company_exclusive'
    }
    if (!this.companyId && this.visibility === 'company_exclusive') {
        this.visibility = 'public'
    }
    next()
})

const Template = mongoose.model('Template', templateSchema)
export default Template
