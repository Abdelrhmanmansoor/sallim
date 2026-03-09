import 'dotenv/config'
import mongoose from 'mongoose'
import Stats from '../models/Stats.js'

async function getRecentStats() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)

        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        const todayStr = today.toISOString().split('T')[0]
        const yesterdayStr = yesterday.toISOString().split('T')[0]

        const stats = await Stats.find({
            date: { $in: [todayStr, yesterdayStr] }
        })

        let todayVisitors = 0
        let yesterdayVisitors = 0

        stats.forEach(s => {
            if (s.date === todayStr) todayVisitors += s.uniqueVisitors || 0
            if (s.date === yesterdayStr) yesterdayVisitors += s.uniqueVisitors || 0
        })

        console.log(`\n--- Visitor Stats ---`)
        console.log(`Today (${todayStr}): ${todayVisitors} unique visitors`)
        console.log(`Yesterday (${yesterdayStr}): ${yesterdayVisitors} unique visitors`)
        console.log(`Total last 2 days: ${todayVisitors + yesterdayVisitors}`)
        console.log('---------------------\n')

        process.exit(0)
    } catch (error) {
        console.error('Error fetching stats:', error)
        process.exit(1)
    }
}

getRecentStats()
