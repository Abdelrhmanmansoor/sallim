import mongoose from 'mongoose'

const cardCampaignSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  cards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card'
  }],
  totalCards: {
    type: Number,
    default: 0,
    min: 0
  },
  sentVia: {
    type: String,
    enum: ['whatsapp', 'email', 'manual', 'api'],
    default: 'manual'
  },
  stats: {
    totalViews: {
      type: Number,
      default: 0
    },
    uniqueViews: {
      type: Number,
      default: 0
    },
    viewsByHour: [{
      hour: {
        type: Number,
        min: 0,
        max: 23
      },
      count: {
        type: Number,
        default: 0
      }
    }],
    viewsByDay: [{
      date: Date,
      count: {
        type: Number,
        default: 0
      }
    }],
    clickRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    shares: {
      whatsapp: { type: Number, default: 0 },
      email: { type: Number, default: 0 },
      link: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    }
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sending', 'sent', 'completed', 'failed'],
    default: 'draft'
  },
  scheduledFor: {
    type: Date
  },
  sentAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Indexes for efficient queries
cardCampaignSchema.index({ company: 1, createdAt: -1 })
cardCampaignSchema.index({ status: 1, createdAt: -1 })
cardCampaignSchema.index({ sentVia: 1, createdAt: -1 })
cardCampaignSchema.index({ scheduledFor: 1 })

// Method to calculate click rate
cardCampaignSchema.methods.calculateClickRate = function() {
  if (this.totalCards === 0) return 0
  this.stats.clickRate = Math.round((this.stats.uniqueViews / this.totalCards) * 100)
  return this.stats.clickRate
}

// Method to increment view count
cardCampaignSchema.methods.incrementView = function(viewTime = new Date()) {
  this.stats.totalViews++
  
  // Update hourly stats
  const hour = viewTime.getHours()
  const hourStats = this.stats.viewsByHour.find(h => h.hour === hour)
  if (hourStats) {
    hourStats.count++
  } else {
    this.stats.viewsByHour.push({ hour, count: 1 })
  }
  
  // Update daily stats
  const dateOnly = new Date(viewTime.setHours(0, 0, 0, 0))
  const dayStats = this.stats.viewsByDay.find(d => d.date.getTime() === dateOnly.getTime())
  if (dayStats) {
    dayStats.count++
  } else {
    this.stats.viewsByDay.push({ date: dateOnly, count: 1 })
  }
  
  return this.save()
}

const CardCampaign = mongoose.model('CardCampaign', cardCampaignSchema)
export default CardCampaign