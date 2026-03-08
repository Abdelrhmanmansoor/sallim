import mongoose from 'mongoose'

const walletSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'SAR',
    enum: ['SAR', 'USD', 'AED']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Index for quick lookup
walletSchema.index({ company: 1 })

const Wallet = mongoose.model('Wallet', walletSchema)
export default Wallet