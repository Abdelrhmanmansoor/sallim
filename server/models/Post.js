import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: ''
    },
    author: {
        type: String,
        default: 'الإدارة'
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    category: {
        type: String,
        default: 'عام'
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

// Middleware to pre-validate or automatically generate slug from title if needed
// For simplicity, we can pass the slug directly from the admin panel

const Post = mongoose.model('Post', postSchema)

export default Post
