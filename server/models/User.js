import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    avatar: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        maxlength: 200,
        default: ''
    },
    diwaniyas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Diwaniya'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving (only if password is modified and not already hashed)
userSchema.pre('save', async function (next) {
    const user = this;

    // Only hash password if it's actually modified
    if (!user.isModified('password')) {
        return next();
    }

    // Skip hashing if password is already a bcrypt hash
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$'))) {
        return next();
    }

    try {
        if (!user.password) {
            return next();
        }
        // Hash password using async/await
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error) {
        console.error('Error hashing password:', error);
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

export default mongoose.model('User', userSchema);