import mongoose from 'mongoose'

const companyTeamSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    maxlength: 100
  },
  password: {
    type: String,
    select: false,
    required: true
  },
  role: {
    type: String,
    enum: ['editor', 'viewer', 'admin'],
    default: 'editor'
  },
  permissions: {
    createCards: {
      type: Boolean,
      default: true
    },
    editCards: {
      type: Boolean,
      default: true
    },
    deleteCards: {
      type: Boolean,
      default: false
    },
    viewAnalytics: {
      type: Boolean,
      default: true
    },
    manageTemplates: {
      type: Boolean,
      default: false
    },
    manageTeam: {
      type: Boolean,
      default: false
    },
    viewWallet: {
      type: Boolean,
      default: false
    },
    createCampaigns: {
      type: Boolean,
      default: true
    }
  },
  avatar: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive'],
    default: 'pending'
  },
  inviteToken: {
    type: String,
    select: false
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  invitedAt: {
    type: Date
  },
  joinedAt: {
    type: Date
  },
  lastLoginAt: {
    type: Date
  },
  cardsCreated: {
    type: Number,
    default: 0
  },
  cardsEdited: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Indexes for efficient queries
companyTeamSchema.index({ company: 1, email: 1 }, { unique: true })
companyTeamSchema.index({ company: 1, status: 1 })
companyTeamSchema.index({ email: 1 })

// Hash password before saving
companyTeamSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next()

  try {
    const bcrypt = await import('bcrypt')
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare password
companyTeamSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = await import('bcrypt')
  return await bcrypt.compare(candidatePassword, this.password)
}

// Method to check if team member has specific permission
companyTeamSchema.methods.hasPermission = function(permission) {
  return this.permissions[permission] === true
}

// Generate invite token
companyTeamSchema.methods.generateInviteToken = function() {
  const crypto = require('crypto')
  this.inviteToken = crypto.randomBytes(32).toString('hex')
  this.invitedAt = new Date()
  return this.inviteToken
}

const CompanyTeam = mongoose.model('CompanyTeam', companyTeamSchema)
export default CompanyTeam