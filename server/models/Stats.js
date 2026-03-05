import mongoose from 'mongoose'

const statsSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD format
    required: true,
    unique: true,
    index: true,
  },
  cardsCreated: {
    type: Number,
    default: 0,
  },
  cardViews: {
    type: Number,
    default: 0,
  },
  uniqueVisitors: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
})

// Static method to increment today's stats
statsSchema.statics.incrementToday = async function (field, amount = 1) {
  const today = new Date().toISOString().split('T')[0]
  return this.findOneAndUpdate(
    { date: today },
    { $inc: { [field]: amount } },
    { upsert: true, new: true }
  )
}

const Stats = mongoose.model('Stats', statsSchema)

export default Stats
