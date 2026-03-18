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
      required: false,
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
      enum: ['initiated', 'pending', 'completed', 'failed'],
      default: 'initiated',
      index: true,
    },
    analyticsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Analytics',
    },
    // Paymob Flash Integration fields
    paymentMethod: {
      type: String,
      enum: ['paymob_legacy', 'paymob_flash', 'paypal'],
      default: 'paymob_legacy',
    },
    intentionId: {
      type: String,
      index: true,
    },
    clientSecret: {
      type: String,
    },
    paymentUrl: {
      type: String,
    },
    merchantOrderId: {
      type: String,
      index: true,
    },
    transactionId: {
      type: String,
      index: true,
    },
    paymobData: {
      type: mongoose.Schema.Types.Mixed,
    },
    completedAt: {
      type: Date,
    },
    postPaymentRedirect: {
      type: String,
      default: '',
    },
    paymentEmailSentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

checkoutSessionSchema.index({ createdAt: -1 })

export default mongoose.model('CheckoutSession', checkoutSessionSchema)
