import mongoose from 'mongoose'

const companyOrderSchema = new mongoose.Schema(
  {
    paymobOrderId: { type: String, index: true },
    merchantOrderId: { type: String, index: true },
    packageKey: { type: String, required: true }, // 'starter' | 'pro' | 'enterprise'
    packageSnapshot: {
      name: String,
      price: Number,
      cardLimit: Number,
      durationDays: Number,
    },
    companyName: { type: String, required: true, trim: true },
    companyEmail: { type: String, required: true, trim: true, lowercase: true },
    companyPhone: { type: String, required: true, trim: true },
    amount: { type: Number, required: true }, // SAR
    amountEGP: { type: Number },
    exchangeRate: { type: Number },
    status: {
      type: String,
      enum: ['initiated', 'completed', 'failed'],
      default: 'initiated',
      index: true,
    },
    licenseCode: { type: String, default: '' }, // plain activation code, set after payment
    licenseKeyId: { type: mongoose.Schema.Types.ObjectId, ref: 'LicenseKey' },
    paymobTransactionId: { type: String, default: '' },
  },
  { timestamps: true }
)

companyOrderSchema.index({ createdAt: -1 })

export default mongoose.model('CompanyOrder', companyOrderSchema)
