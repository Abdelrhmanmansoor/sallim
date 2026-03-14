import mongoose from 'mongoose'
import crypto from 'crypto'

const personalOrderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    index: true,
  },
  paymentReference: {
    type: String,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['paid', 'consumed', 'blocked'],
    default: 'paid',
  },
  price: {
    type: Number,
    default: 29,
  },
  currency: {
    type: String,
    default: 'SAR',
  },
  templateId: {
    type: String,
    required: true,
    trim: true,
  },
  recipientName: {
    type: String,
    required: true,
    trim: true,
  },
  senderName: {
    type: String,
    default: '',
    trim: true,
  },
  snapshot: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  snapshotHash: {
    type: String,
    required: true,
    index: true,
  },
  downloadedAt: Date,
  attemptCount: {
    type: Number,
    default: 0,
  },
  lastAttemptAt: Date,
  lockedReason: {
    type: String,
    default: '',
  },
  ipAddress: {
    type: String,
    default: '',
  },
  userAgent: {
    type: String,
    default: '',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
})

personalOrderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
  }

  if (!this.paymentReference) {
    this.paymentReference = crypto.randomBytes(12).toString('hex')
  }

  next()
})

const PersonalOrder = mongoose.model('PersonalOrder', personalOrderSchema)
export default PersonalOrder

