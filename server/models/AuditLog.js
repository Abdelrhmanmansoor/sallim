import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  userType: {
    type: String,
    enum: ['super_admin', 'company_admin', 'company_editor', 'system', 'guest'],
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'read', 'update', 'delete', 'login', 'logout', 'purchase', 'activate', 'deactivate', 'send', 'upload', 'download', 'assign', 'unassign', 'bulk_send', 'attempt']
  },
  entity: {
    type: String,
    required: true,
    enum: ['company', 'user', 'wallet', 'transaction', 'template', 'card', 'campaign', 'ticket', 'invite_code', 'feature_flag', 'theme', 'package', 'card_campaign', 'order']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  changes: {
    before: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    after: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  description: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: false
  },
  userAgent: {
    type: String,
    required: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  success: {
    type: Boolean,
    default: true
  },
  errorMessage: {
    type: String
  }
}, {
  timestamps: true
})

// Indexes for efficient queries
auditLogSchema.index({ user: 1, createdAt: -1 })
auditLogSchema.index({ userType: 1, createdAt: -1 })
auditLogSchema.index({ action: 1, createdAt: -1 })
auditLogSchema.index({ entity: 1, createdAt: -1 })
auditLogSchema.index({ createdAt: -1 })

// Compound index for advanced filtering
auditLogSchema.index({ userType: 1, action: 1, createdAt: -1 })

const AuditLog = mongoose.model('AuditLog', auditLogSchema)
export default AuditLog