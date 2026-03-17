import mongoose from 'mongoose'

const greetLinkSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  companySlug: { type: String, required: true },
  occasionName: { type: String, default: '' },
  greetingText: { type: String, default: '' },
  templateId: { type: String, default: '' },
  templateImage: { type: String, required: true }, // full URL (static path or Cloudinary)
  templateTextColor: { type: String, default: '#ffffff' },
  font: { type: String, default: 'amiri' },
  fontSize: { type: Number, default: 60 },
  nameY: { type: Number, default: 0.65 },
  nameColor: { type: String, default: '' },
  expiresAt: { type: Date, default: null },
  views: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true })

greetLinkSchema.index({ companyId: 1, createdAt: -1 })

const GreetLink = mongoose.model('GreetLink', greetLinkSchema)
export default GreetLink
