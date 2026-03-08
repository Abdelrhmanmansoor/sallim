import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit', 'purchase', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  referenceType: {
    type: String,
    enum: ['template', 'campaign', 'ai_text', 'admin_deposit'],
    required: false
  },
  category: {
    type: String,
    enum: ['theme_purchase', 'whatsapp_campaign', 'ai_text', 'admin_deposit', 'refund'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Compound index for efficient queries
transactionSchema.index({ company: 1, createdAt: -1 })
transactionSchema.index({ wallet: 1, createdAt: -1 })
transactionSchema.index({ type: 1, createdAt: -1 })

const Transaction = mongoose.model('Transaction', transactionSchema)
export default Transaction