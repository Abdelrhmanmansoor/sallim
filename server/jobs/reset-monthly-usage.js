import cron from 'node-cron'
import Company from '../models/Company.js'

/**
 * Schedule monthly usage reset cron job
 * Runs at 00:00 on the 1st day of each month
 * Resets usage.cardsThisMonth to 0 for all companies
 */
export function scheduleMonthlyReset() {
  // Cron expression: "0 0 1 * *"
  // ┬ ┬ ┬ ┬ ┬
  // │ │ │ │ │
  // │ │ │ │ └──── day of week (0 - 7) (not used here)
  // │ │ │ └────── month (1 - 12)
  // │ │ └──────── day of month (1 - 31)
  // │ └────────── hour (0 - 23)
  // └──────────── minute (0 - 59)

  cron.schedule('0 0 1 * *', async () => {
    try {
      console.log('⏰ [CRON] Starting monthly usage reset...')

      const result = await Company.updateMany(
        {},
        { $set: { 'usage.cardsThisMonth': 0 } }
      )

      console.log('✅ [CRON] Monthly usage reset completed')
      console.log(`   📊 Companies updated: ${result.modifiedCount}`)
      console.log(`   📅 Reset date: ${new Date().toISOString()}`)
    } catch (error) {
      console.error('❌ [CRON] Monthly reset failed:', error)
    }
  })

  console.log('⏰ Monthly reset cron scheduled (1st day of month at 00:00)')
}

