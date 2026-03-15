import mongoose from 'mongoose'

const checkoutSessionSchema = new mongoose.Schema(
  {
    paymobOrderId: {
      type: String,
      index: true,
    },
    paymobTransactionId: {
      type: String,
      index: true,
    },
    cardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Card',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      default: '',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'SAR',
    },
    amountEGP: {
      type: Number,
      min: 0,
    },
    exchangeRate: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['initiated', 'completed', 'failed'],
      default: 'initiated',
      index: true,
    },
    analyticsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analytics',
    },
  },
  {
    timestamps: true,
  }
)

checkoutSessionSchema.index({ createdAt: -1 })

export default mongoose.model('CheckoutSession', checkoutSessionSchema)
