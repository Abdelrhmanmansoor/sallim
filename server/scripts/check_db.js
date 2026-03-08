import 'dotenv/config'
import mongoose from 'mongoose'

async function checkCollections() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        const collections = await mongoose.connection.db.listCollections().toArray()
        console.log('Collections:', collections.map(c => c.name))

        // Count all in each
        for (const coll of collections) {
            const count = await mongoose.connection.db.collection(coll.name).countDocuments()
            console.log(`${coll.name}: ${count}`)
        }

        process.exit(0)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

checkCollections()
