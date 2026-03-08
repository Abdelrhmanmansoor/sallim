// Simple invite code generator (no database needed for testing)
const generateInviteCode = async () => {
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

    const code = generateCode()

    console.log('✅ Invite code generated successfully!')
    console.log('═══════════════════════════════════════')
    console.log('🔑 Invite Code:', code)
    console.log('📧 Status: active')
    console.log('⏰ Expires: 30 days from now')
    console.log('🔄 Max Uses: 1')
    console.log('🏢 Company Type: enterprise')
    console.log('═══════════════════════════════════════')
    console.log('📝 Next steps:')
    console.log('   1. Go to: http://localhost:5173/company-activation')
    console.log('   2. Enter this code:', code)
    console.log('   3. Enter your email: company@example.com')
    console.log('   4. Create a password (min 6 characters)')
    console.log('   5. Submit to activate your company account')
    console.log('═══════════════════════════════════════')
    console.log('⚠️  Note: This is a mock code for testing.')
    console.log('   To save it to database, make sure MongoDB is running.')
    console.log('═══════════════════════════════════════')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error generating invite code:', error)
    process.exit(1)
  }
}

generateInviteCode()