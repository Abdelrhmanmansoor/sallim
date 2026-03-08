import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env.local') });

import User from './models/User.js';
import Diwaniya from './models/Diwan.js';

async function fixOrphans() {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log('Connected to DB for orphan fix...');

        // Find all users
        const users = await User.find();
        let linkedCount = 0;

        for (const user of users) {
            // Find diwaniyas with the exact same ownerName that are NOT linked to this user
            const orphans = await Diwaniya.find({
                ownerName: user.name,
                _id: { $nin: user.diwaniyas }
            });

            if (orphans.length > 0) {
                console.log(`Found ${orphans.length} orphan diwaniyas for user ${user.name}`);
                for (const orphan of orphans) {
                    user.diwaniyas.push(orphan._id);
                    linkedCount++;
                }
                await user.save();
                console.log(`Saved user ${user.name} with new links.`);
            }
        }

        console.log(`Fixed ${linkedCount} orphaned diwaniyas.`);

    } catch (e) {
        console.error('Error fixing orphans:', e);
    } finally {
        process.exit();
    }
}

fixOrphans();
