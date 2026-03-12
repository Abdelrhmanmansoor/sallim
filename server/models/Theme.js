import mongoose from 'mongoose'

const themeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  previewUrl: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['public', 'exclusive', 'hidden'],
    default: 'public'
  },
  // For exclusive themes, which companies can access
  exclusiveCompanies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  }],
  // Required features to access this theme
  requiredFeature: {
    type: String
  },
  // Sort order in lists
  sortOrder: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    enum: ['eid_al_fitr', 'eid_al_adha', 'ramadan', 'general', 'corporate', 'premium'],
    default: 'general'
  },
  description: {
    type: String,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true })

// Index for efficient queries
themeSchema.index({ status: 1, isActive: 1, sortOrder: 1 })
themeSchema.index({ category: 1 })

const Theme = mongoose.model('Theme', themeSchema)
export default Theme