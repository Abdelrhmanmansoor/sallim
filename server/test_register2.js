import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env.local') });

import User from './models/User.js';

async function test() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("No MONGODB_URI in .env.local");

        await mongoose.connect(uri);
        console.log('Connected to DB');

        const email = 'test' + Date.now() + '@example.com';
        console.log('Testing create for:', email);

        const user = await User.create({
            name: 'Test',
            email: email,
            password: 'password123'
        });
        console.log('Success:', user.toJSON());
    } catch (e) {
        console.error('Test Error:', e);
    } finally {
        process.exit();
    }
}

test();
