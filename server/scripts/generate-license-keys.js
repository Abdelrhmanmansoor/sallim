import mongoose from 'mongoose'
import crypto from 'crypto'
import dotenv from 'dotenv'
import LicenseKey from '../models/LicenseKey.js'

dotenv.config({ path: 'server/.env.local' })
dotenv.config({ path: 'server/.env' })
dotenv.config({ path: '.env.local' })
dotenv.config()

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    const token = argv[i]
    if (!token.startsWith('--')) continue
    const key = token.slice(2)
    const value = argv[i + 1]
    args[key] = value
    i++
  }
  return args
}

function hashLicenseCode(code) {
  return crypto.createHash('sha256').update(String(code || '').trim().toUpperCase()).digest('hex')
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  const count = Math.max(1, Math.min(Number(args.count || 10), 500))
  const maxRecipients = Math.max(1, Math.min(Number(args.maxRecipients || 5000), 100000))
  const note = String(args.note || '').trim().slice(0, 200)

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing. Add it to server/.env.local or server/.env')
    process.exit(1)
  }

  await mongoose.connect(process.env.MONGODB_URI)

  const codes = []
  while (codes.length < count) {
    const code = crypto.randomBytes(10).toString('hex').toUpperCase()
    const codeHash = hashLicenseCode(code)
    try {
      await LicenseKey.create({
        codeHash,
        status: 'new',
        maxRecipients,
        note,
      })
      codes.push(code)
    } catch (error) {
      const msg = String(error?.message || '')
      if (msg.includes('duplicate key')) continue
      throw error
    }
  }

  console.log(JSON.stringify({
    success: true,
    data: {
      count: codes.length,
      maxRecipients,
      note,
      codes,
    },
  }, null, 2))

  await mongoose.disconnect()
}

main().catch((error) => {
  console.error('Generate license keys error:', error?.message || error)
  process.exit(1)
})
