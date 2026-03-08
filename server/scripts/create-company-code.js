import fs from 'fs'
import path from 'path'

const createCompanyWithCode = async () => {
  try {
    // Generate a random 6-character code
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      let code = ''
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return code
    }

    const activationCode = generateCode()
    
    // Create company data
    const companyData = {
      _id: 'mock-company-id-' + Date.now(),
      name: 'شركة تجريبية للاختبار',
      email: 'company@example.com',
      password: 'hashed_password_placeholder',
      activationCode: activationCode,
      activationExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      role: 'company',
      companyType: 'enterprise',
      features: ['all'],
      createdAt: new Date().toISOString()
    }

    // Save to mock database file
    const dbPath = path.join(process.cwd(), 'server', 'mock-companies.json')
    let companies = []
    
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8')
      companies = JSON.parse(data)
    }
    
    companies.push(companyData)
    fs.writeFileSync(dbPath, JSON.stringify(companies, null, 2))

    console.log('✅ Company created successfully!')
    console.log('═══════════════════════════════════════')
    console.log('🏢 Company Name:', companyData.name)
    console.log('📧 Email:', companyData.email)
    console.log('🔑 Activation Code:', activationCode)
    console.log('📊 Status:', companyData.status)
    console.log('⏰ Expires:', new Date(companyData.activationExpires).toLocaleDateString('ar-EG'))
    console.log('═══════════════════════════════════════')
    console.log('📝 Next steps:')
    console.log('   1. Go to: http://localhost:5173/company-activation')
    console.log('   2. Email:', companyData.email)
    console.log('   3. Activation Code:', activationCode)
    console.log('   4. Create a new password (min 6 characters)')
    console.log('   5. Submit to activate your company account')
    console.log('═══════════════════════════════════════')
    console.log('✅ Company saved to mock database!')
    console.log('💾 File: server/mock-companies.json')
    console.log('⚠️  Note: This uses a mock database for testing.')
    console.log('   For production, make sure MongoDB is configured.')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating company:', error)
    process.exit(1)
  }
}

createCompanyWithCode()