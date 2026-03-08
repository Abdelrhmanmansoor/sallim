import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import dotenv from 'dotenv'

// Load from .env.local if it exists
dotenv.config({ path: '.env.local' })
if (!process.env.MONGODB_URI) {
  dotenv.config() // Fallback to .env
}

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@sallim.co' })
    if (existingAdmin) {
      console.log('⚠️  Admin already exists!')
      console.log('Email:', existingAdmin.email)
      console.log('Name:', existingAdmin.name)
      process.exit(0)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123456', 12)

    // Create admin user
    const admin = await User.create({
      name: 'مدير النظام',
      email: 'admin@sallim.co',
      password: hashedPassword,
      role: 'admin',
      avatar: '',
    })

    console.log('✅ Admin created successfully!')
    console.log('═══════════════════════════════════════')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Password: admin123456')
    console.log('👤 Name:', admin.name)
    console.log('🎭 Role:', admin.role)
    console.log('═══════════════════════════════════════')
    console.log('📝 Next steps:')
    console.log('   1. Go to: http://localhost:5173/login')
    console.log('   2. Login with: admin@sallim.co / admin123456')
    console.log('   3. Go to: http://localhost:5173/companies')
    console.log('   4. Click: "الدخول للوحة التحكم"')
    console.log('═══════════════════════════════════════')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin:', error)
    process.exit(1)
  }
}

createAdmin()