import mongoose from 'mongoose'

const cardSchema = new mongoose.Schema({
  // Catalog / checkout metadata
  name: {
    type: String,
    trim: true,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
    min: 0,
  },
  enabled: {
    type: Boolean,
    default: true,
  },

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

  // Enterprise: Company & Creator
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyTeam',
    required: false
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CardCampaign'
  },

  // Enterprise: Advanced design with layers
  layers: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'image', 'shape'],
      required: true
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    position: {
      x: {
        type: Number,
        default: 0
      },
      y: {
        type: Number,
        default: 0
      }
    },
    size: {
      width: {
        type: Number,
        default: 100
      },
      height: {
        type: Number,
        default: 100
      }
    },
    rotation: {
      type: Number,
      default: 0
    },
    opacity: {
      type: Number,
      default: 1,
      min: 0,
      max: 1
    },
    zIndex: {
      type: Number,
      default: 0
    },
    filters: {
      blur: {
        type: Number,
        default: 0
      },
      brightness: {
        type: Number,
        default: 100
      },
      contrast: {
        type: Number,
        default: 100
      },
      saturation: {
        type: Number,
        default: 100
      }
    }
  }],

  // Enterprise: Sharing tracking
  shareId: {
    type: String,
    unique: true,
    index: true,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  shares: [{
    platform: {
      type: String,
      enum: ['whatsapp', 'telegram', 'email', 'link', 'other']
    },
    count: {
      type: Number,
      default: 0
    },
    lastSharedAt: {
      type: Date
    }
  }],

  // Enterprise: Detailed view analytics
  detailedViews: [{
    ip: String,
    userAgent: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    duration: {
      type: Number, // Time spent viewing in seconds
      default: 0
    },
    device: {
      type: String // mobile, desktop, tablet
    },
    browser: String,
    location: {
      country: String,
      city: String
    }
  }],
  uniqueViewers: [{
    type: String // IP address or unique identifier
  }],

  // Enterprise: Status & Publishing
  isDraft: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'deleted', 'archived'],
    default: 'active',
  },
  publishedAt: {
    type: Date
  },

  // Enterprise: Campaign data
  recipientData: {
    phone: String,
    email: String,
    name: String,
    customFields: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },

  // White Label: Sending and tracking
  sentAt: {
    type: Date
  },
  openedAt: {
    type: Date
  },
  uniqueToken: {
    type: String,
    unique: true,
    index: true
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'opened', 'failed'],
    default: 'pending'
  },

  // Tracking
  createdByIp: {
    type: String,
    select: false, // Hidden by default for privacy
  },

  // Enterprise: Tags & categorization
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['personal', 'business', 'campaign', 'test'],
    default: 'personal'
  }
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
