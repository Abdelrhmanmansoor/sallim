import mongoose from 'mongoose'

const replySchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['company', 'admin'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const ticketSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['support', 'custom_design'],
        default: 'support'
    },
    status: {
        type: String,
        enum: ['open', 'answered', 'closed'],
        default: 'open'
    },
    replies: [replySchema]
}, { timestamps: true })

const Ticket = mongoose.model('Ticket', ticketSchema)

export default Ticket
