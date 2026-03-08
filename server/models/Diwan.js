import mongoose from 'mongoose';

const eidGreetingSchema = new mongoose.Schema({
    senderName: {
        type: String,
        required: false,
        trim: true,
        maxlength: 100
    },
    senderEmail: {
        type: String,
        required: false,
        trim: true,
        lowercase: true
    },
    senderAvatar: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    isAnonymous: {
        type: Boolean,
        default: true
    },
    isRevealed: {
        type: Boolean,
        default: false
    },
    likes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const diwaniyaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9_\-]+$/, 'Username can only contain alphanumeric characters, dashes, and underscores']
    },
    ownerName: {
        type: String,
        required: true,
        trim: true
    },
    greetings: [eidGreetingSchema],
    views: {
        type: Number,
        default: 0
    },
    isFamilyMode: {
        type: Boolean,
        default: false,
        description: 'Enable family-specific features like eidiya requests and family stories'
    },
    eidiyaRequests: [{
        requesterName: {
            type: String,
            required: true,
            trim: true
        },
        requesterEmail: {
            type: String,
            trim: true,
            lowercase: true
        },
        amount: {
            type: Number,
            default: 0
        },
        message: {
            type: String,
            trim: true,
            maxlength: 200
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    familyMembers: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        relation: {
            type: String,
            enum: ['father', 'mother', 'brother', 'sister', 'grandfather', 'grandmother', 'uncle', 'aunt', 'cousin', 'other']
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    familyStories: [{
        title: {
            type: String,
            required: true,
            trim: true
        },
        story: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },
        author: {
            type: String,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Eidiya Game Questions
    eidiyaGame: {
        enabled: {
            type: Boolean,
            default: false
        },
        questions: [{
            question: {
                type: String,
                required: true,
                trim: true,
                maxlength: 500
            },
            answers: [{
                type: String,
                required: true,
                trim: true
            }],
            correctAnswer: {
                type: Number,
                required: true,
                min: 0
            },
            rewardAmount: {
                type: Number,
                required: true,
                min: 1,
                default: 5
            }
        }],
        // Track player attempts to prevent spam
        playerAttempts: [{
            sessionId: {
                type: String,
                required: true
            },
            score: {
                type: Number,
                default: 0
            },
            answeredQuestions: [{
                questionIndex: Number,
                isCorrect: Boolean,
                timestamp: Date
            }],
            completedAt: {
                type: Date,
                default: Date.now
            }
        }]
    }
}, { timestamps: true });

// Database indexes for performance
diwaniyaSchema.index({ username: 1 });
diwaniyaSchema.index({ ownerName: 1 });
diwaniyaSchema.index({ visibility: 1, createdAt: -1 });
diwaniyaSchema.index({ isFamilyMode: 1 });

const Diwaniya = mongoose.model('Diwaniya', diwaniyaSchema);

export default Diwaniya;
