import 'dotenv/config'
import mongoose from 'mongoose'

async function readStats() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        const stats = await mongoose.connection.db.collection('stats').find({}).toArray()
        console.log('All Stats Documents:')
        console.log(JSON.stringify(stats, null, 2))
        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

readStats()
