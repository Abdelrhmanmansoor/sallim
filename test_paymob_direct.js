// Direct Paymob Flash API Test
// This script tests the Paymob Create Intention API directly

const SECRET_KEY = 'egy_sk_test_94919e83d36c7a9e3187498c93bbd0beecad888ca08e11bdf5062ce91aaf3ec7'
const PUBLIC_KEY = 'egy_pk_test_LkdK1nAsjLL1VwAXzy5Kd7qE0pLXXEZq'
const INTEGRATION_ID = 5577534 // Test Integration ID

async function testPaymobFlashAPI() {
  console.log('🚀 Starting Paymob Flash API Test...\n')
  
  // Test data
  const testAmount = 100 // 100 EGP
  const amountInCents = testAmount * 100 // 10000 cents
  
  const payload = {
    amount: amountInCents,
    currency: 'EGP',
    payment_methods: [INTEGRATION_ID],
    items: [
      {
        name: 'Test Product',
        amount: amountInCents,
        description: 'Eid Greeting Card Test',
        quantity: 1
      }
    ],
    billing_data: {
      first_name: 'Ahmed',
      last_name: 'Test',
      email: 'test@example.com',
      phone_number: '+201234567890',
      country: 'EG',
      state: 'Cairo',
      city: 'Cairo',
      street: 'Test Street',
      building: '123',
      floor: '1',
      apartment: '1',
      postal_code: '11511'
    },
    customer: {
      first_name: 'Ahmed',
      last_name: 'Test',
      email: 'test@example.com',
      phone: '+201234567890'
    },
    extras: {
      merchant_order_id: `test-order-${Date.now()}`,
      notification_url: 'https://lobster-app-heffh.ondigitalocean.app/api/v1/paymob-flash/callback',
      redirection_url: 'https://www.sallim.co/payment-result'
    }
  }
  
  console.log('📤 Request Details:')
  console.log('URL:', 'https://accept.paymob.com/v1/intention/')
  console.log('Authorization:', `Token ${SECRET_KEY.substring(0, 20)}...`)
  console.log('Amount:', testAmount, 'EGP (', amountInCents, 'cents )')
  console.log('Integration ID:', INTEGRATION_ID)
  console.log('\n📦 Payload:', JSON.stringify(payload, null, 2))
  
  try {
    console.log('\n⏳ Calling Paymob API...')
    
    const response = await fetch('https://accept.paymob.com/v1/intention/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${SECRET_KEY}`
      },
      body: JSON.stringify(payload)
    })
    
    const data = await response.json()
    
    console.log('\n📥 Response Status:', response.status)
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      console.error('\n❌ ERROR Response:', JSON.stringify(data, null, 2))
      console.error('\nPossible issues:')
      console.error('1. Secret Key is invalid or expired')
      console.error('2. Integration ID does not match Secret Key mode (test/live)')
      console.error('3. Paymob account has restrictions')
      console.error('4. API version or endpoint changed')
      return
    }
    
    console.log('\n✅ SUCCESS! Payment Intention Created')
    console.log('─'.repeat(60))
    console.log('Intention ID:', data.id)
    console.log('Order ID:', data.order?.id || 'N/A')
    console.log('Client Secret:', data.client_secret ? data.client_secret.substring(0, 30) + '...' : 'MISSING')
    console.log('Status:', data.status || 'N/A')
    
    if (data.client_secret && PUBLIC_KEY) {
      const checkoutUrl = `https://accept.paymob.com/unifiedcheckout/?publicKey=${PUBLIC_KEY}&clientSecret=${data.client_secret}`
      console.log('\n🔗 Checkout URL:')
      console.log(checkoutUrl)
      console.log('\n✅ Copy this URL and open it in browser to test the payment')
    } else {
      console.log('\n⚠️ Warning: No client_secret or public_key found!')
    }
    
    console.log('\n📊 Full Response:')
    console.log(JSON.stringify(data, null, 2))
    
  } catch (error) {
    console.error('\n❌ Exception occurred:', error.message)
    console.error('Stack:', error.stack)
  }
}

// Run the test
testPaymobFlashAPI()
