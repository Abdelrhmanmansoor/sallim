import mongoose from 'mongoose'

const licenseKeySchema = new mongoose.Schema({
  codeHash: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['new', 'activated', 'revoked', 'expired'],
    default: 'new',
    index: true,
  },
  maxRecipients: {
    type: Number,
    default: 500,
  },
  activatedAt: Date,
  activatedDeviceId: {
    type: String,
    default: '',
  },
  activatedIp: {
    type: String,
    default: '',
  },
  activatedUserAgent: {
    type: String,
    default: '',
  },
  note: {
    type: String,
    default: '',
  },
}, { timestamps: true })

const LicenseKey = mongoose.model('LicenseKey', licenseKeySchema)
export default LicenseKey
