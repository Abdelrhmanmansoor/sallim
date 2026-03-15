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
    price: {
        type: Number,
        default: 0
    },
    isFree: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Template = mongoose.model('Template', templateSchema)
export default Template
