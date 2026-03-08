import mongoose from 'mongoose'

const inviteCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  status: {
    type: String,
    enum: ['generated', 'sent', 'activated', 'expired', 'revoked'],
    default: 'generated'
  },
  companyName: {
    type: String,
    trim: true
  },
  companyEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  features: {
    type: [String],
    default: ['basic_templates']
  },
  initialCredits: {
    type: Number,
    default: 0,
    min: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Indexes for efficient queries
inviteCodeSchema.index({ code: 1 })
inviteCodeSchema.index({ status: 1, expirationDate: 1 })
inviteCodeSchema.index({ createdBy: 1, createdAt: -1 })

// Method to check if code is expired
inviteCodeSchema.methods.isExpired = function() {
  return new Date() > this.expirationDate
}

// Method to check if code is usable
inviteCodeSchema.methods.isUsable = function() {
  return this.status === 'sent' && !this.isExpired()
}

const InviteCode = mongoose.model('InviteCode', inviteCodeSchema)
export default InviteCode