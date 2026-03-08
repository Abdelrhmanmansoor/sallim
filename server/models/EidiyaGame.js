import mongoose from 'mongoose';

const eidiyaGameSchema = new mongoose.Schema({
    gameId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    ownerName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    title: {
        type: String,
        required: true,
        trim: true,
        default: 'تحدي العيدية',
        maxLength: 100
    },
    description: {
        type: String,
        trim: true,
        maxLength: 300,
        default: ''
    },
    questions: [{
        questionText: {
            type: String,
            required: true,
            trim: true,
            maxLength: 500
        },
        answers: [{
            type: String,
            required: true,
            trim: true
        }],
        correctAnswerIndex: {
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
    settings: {
        currency: {
            type: String,
            default: 'ريال'
        },
        dialect: {
            type: String,
            default: 'sa'
        },
        isPublicLeaderboard: {
            type: Boolean,
            default: true
        }
    },
    players: [{
        playerName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 50
        },
        score: {
            type: Number,
            default: 0
        },
        totalEarned: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['playing', 'completed'],
            default: 'completed'
        },
        completedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

const EidiyaGame = mongoose.model('EidiyaGame', eidiyaGameSchema);

export default EidiyaGame;
