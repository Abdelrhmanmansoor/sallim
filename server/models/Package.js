import mongoose from 'mongoose'

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  cardLimit: {
    type: Number,
    required: true,
    default: 0
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  currency: {
    type: String,
    default: 'SAR'
  },
  durationDays: {
    type: Number,
    required: true,
    default: 30
  },
  // Features included in this package
  features: [{
    type: String,
    enum: ['basic_templates', 'premium_templates', 'exclusive_templates', 
            'custom_branding', 'bulk_sending', 'analytics', 'priority_support',
            'api_access', 'white_label']
  }],
  // Limits within the package
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
    },
    maxUploadSize: {
      type: Number, // in MB
      default: 10
    }
  },
  // Package visibility
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  // Optional: Discount for annual payments
  annualDiscountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, { timestamps: true })

// Index for efficient queries
packageSchema.index({ isActive: 1, sortOrder: 1 })
packageSchema.index({ price: 1 })

const Package = mongoose.model('Package', packageSchema)
export default Package