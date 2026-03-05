import mongoose from 'mongoose'

const cardSchema = new mongoose.Schema({
  // Card content
  mainText: {
    type: String,
    required: true,
    maxlength: 500,
  },
  subText: {
    type: String,
    maxlength: 500,
    default: '',
  },
  senderName: {
    type: String,
    maxlength: 100,
    default: '',
  },
  recipientName: {
    type: String,
    maxlength: 100,
    default: '',
  },

  // Design
  templateId: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    default: 'golden',
  },
  font: {
    type: String,
    default: 'cairo',
  },
  fontSize: {
    type: Number,
    default: 42,
  },
  textColor: {
    type: String,
    default: '#ffffff',
  },

  // Sharing
  shareId: {
    type: String,
    unique: true,
    index: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  
  // Tracking
  createdByIp: {
    type: String,
    select: false, // Hidden by default for privacy
  },
  
  // Metadata
  status: {
    type: String,
    enum: ['active', 'deleted'],
    default: 'active',
  },
}, {
  timestamps: true,
})

// Auto-generate shareId before saving
cardSchema.pre('save', function (next) {
  if (!this.shareId) {
    this.shareId = generateShareId()
  }
  next()
})

// Generate a short unique ID for sharing
function generateShareId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Index for cleanup of old cards
cardSchema.index({ createdAt: 1 })
cardSchema.index({ status: 1 })

const Card = mongoose.model('Card', cardSchema)

export default Card
