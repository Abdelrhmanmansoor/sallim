import mongoose from 'mongoose'
import crypto from 'crypto'

const batchOrderSchema = new mongoose.Schema({
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
    enum: ['pending', 'paid', 'consumed', 'blocked'],
    default: 'paid',
  },
  price: {
    type: Number,
    default: 79,
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
  recipientCount: {
    type: Number,
    required: true,
    min: 1,
  },
  maxRecipients: {
    type: Number,
    required: true,
    min: 1,
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
  namesHash: {
    type: String,
    required: true,
    index: true,
  },
  paymentProvider: {
    type: String,
    enum: ['paypal', 'manual', 'card'],
    default: 'manual',
    index: true,
  },
  paypalOrderId: {
    type: String,
    default: undefined,
    index: true,
  },
  paypalCaptureId: {
    type: String,
    default: undefined,
    unique: true,
    sparse: true,
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

batchOrderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `BATCH-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
  }

  if (!this.paymentReference) {
    this.paymentReference = crypto.randomBytes(12).toString('hex')
  }

  next()
})

const BatchOrder = mongoose.model('BatchOrder', batchOrderSchema)
export default BatchOrder
