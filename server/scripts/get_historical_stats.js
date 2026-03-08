import 'dotenv/config'
import mongoose from 'mongoose'
import Card from '../models/Card.js'
import User from '../models/User.js'
import Diwaniya from '../models/Diwan.js'
import Stats from '../models/Stats.js'

async function getStats() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to MongoDB')

        const totalCards = await Card.countDocuments()
        const uniqueCreators = await Card.distinct('createdByIp').then(ips => ips.length)
        const totalUsers = await User.countDocuments()
        const totalDiwaniyas = await Diwaniya.countDocuments()

        // Count total greetings across all diwaniyas
        const diwaniyas = await Diwaniya.find({}, 'greetings views')
        let totalGreetings = 0
        let totalDiwaniyaViews = 0
        diwaniyas.forEach(d => {
            totalGreetings += (d.greetings ? d.greetings.length : 0)
            totalDiwaniyaViews += (d.views || 0)
        })

        // Aggregated stats from Stats model
        const statsSummary = await Stats.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: '$cardViews' },
                    totalCardsFromStats: { $sum: '$cardsCreated' },
                    totalVisitorsFromStats: { $sum: '$uniqueVisitors' }
                }
            }
        ])

        const summary = {
            Overview: {
                totalRegisteredUsers: totalUsers,
                totalVisitorsTrackedInDailyStats: statsSummary[0]?.totalVisitorsFromStats || 0
            },
            GreetingCards: {
                totalCardsCreated: totalCards,
                uniqueIPsCreatingCards: uniqueCreators,
                totalCardViewsTracked: statsSummary[0]?.totalViews || 0
            },
            Diwaniyas: {
                totalDiwaniyasCreated: totalDiwaniyas,
                totalGreetingsSent: totalGreetings,
                totalDiwaniyaViews: totalDiwaniyaViews
            }
        }

        console.log('\n--- Final Historical Platform Stats ---')
        console.log(JSON.stringify(summary, null, 2))
        console.log('----------------------------------------\n')

        process.exit(0)
    } catch (error) {
        console.error('Error calculating stats:', error)
        process.exit(1)
    }
}

getStats()
