// ═══════════════════════════════════════════
// Paymob Flash - Developer Quick Reference
// ═══════════════════════════════════════════

/*
  QUICK SETUP (30 SECONDS)
  ═════════════════════════

  1. Add to server/.env:
     PAYMOB_API_KEY=your_key
     PAYMOB_SECRET_KEY=your_secret
     PAYMOB_INTEGRATION_ID=5577534
     PAYMOB_MODE=test

  2. Server already configured ✅
     - Routes registered in server/index.js
     - Models updated
     - Utilities ready

  3. Use in React:
     import { PaymobFlashButton } from './components/PaymobFlash'

  TEST: node server/test_paymob_flash.js
*/

// ═══════════════════════════════════════════
// FRONTEND USAGE
// ═══════════════════════════════════════════

// 1. Import API functions
import { 
  createPaymobFlashIntention,
  getPaymobFlashStatus,
  checkPaymobFlashHealth
} from './utils/api'

// 2. Import React components
import { PaymobFlashButton, PaymentResultChecker } from './components/PaymobFlash'

// 3. Basic button usage
function Example1() {
  return (
    <PaymobFlashButton
      cardId="card_123"
      amount={100.00}
      currency="EGP"
      customerName="Ahmed Ali"
      customerEmail="ahmed@example.com"
      customerPhone="+201234567890"
    />
  )
}

// 4. With callbacks
function Example2() {
  return (
    <PaymobFlashButton
      cardId="card_123"
      amount={50.00}
      currency="EGP"
      customerName="Sara Hassan"
      customerEmail="sara@example.com"
      customerPhone="+201111111111"
      onSuccess={(res) => console.log('Success:', res)}
      onError={(err) => console.error('Error:', err)}
    />
  )
}

// 5. Payment result page
function Example3() {
  return <PaymentResultChecker />
}

// 6. Manual API call
async function Example4() {
  try {
    const result = await createPaymobFlashIntention({
      cardId: 'card_123',
      customerName: 'Ahmed Ali',
      customerEmail: 'ahmed@example.com',
      customerPhone: '+201234567890',
      amount: 100.00,
      currency: 'EGP',
      sessionId: `session-${Date.now()}`,
      billing_data: { country: 'EG', city: 'Cairo' }
    })
    
    // Redirect to payment
    window.location.href = result.paymentUrl
  } catch (error) {
    console.error('Payment error:', error)
  }
}

// 7. Check payment status
async function Example5() {
  const sessionId = 'session-123'
  const status = await getPaymobFlashStatus(sessionId)
  console.log('Payment status:', status.status) // completed, pending, failed
}

// ═══════════════════════════════════════════
// BACKEND USAGE
// ═══════════════════════════════════════════

// All backend routes are already set up in:
// - server/routes/paymob-flash.js
// - server/utils/paymob-flash.js

// Example: Using utilities directly
import { createPaymentIntention } from './utils/paymob-flash.js'

const intention = await createPaymentIntention({
  amount: 10000, // Amount in CENTS (100.00 EGP)
  currency: 'EGP',
  customer: {
    first_name: 'Ahmed',
    last_name: 'Ali',
    email: 'ahmed@example.com',
    phone: '+201234567890'
  },
  payment_methods: [5577534], // Test integration ID
  extras: {
    merchant_order_id: 'order-123',
    notification_url: 'https://your-backend.com/callback',
    redirection_url: 'https://your-frontend.com/result'
  }
})

console.log('Payment URL:', intention.payment_url)

// ═══════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════

/*
  POST /api/v1/paymob-flash/create-intention
  ────────────────────────────────────────────
  Body: {
    cardId, customerName, customerPhone, customerEmail,
    amount, currency, sessionId, billing_data
  }
  Response: { success, intentionId, paymentUrl, merchantOrderId }

  GET /api/v1/paymob-flash/status/:sessionId
  ─────────────────────────────────────────────
  Response: { success, status, transactionId, amount, currency }

  POST /api/v1/paymob-flash/callback
  ───────────────────────────────────
  Auto-called by Paymob (webhook)

  GET /api/v1/paymob-flash/health
  ────────────────────────────────
  Response: { success, mode, message }
*/

// ═══════════════════════════════════════════
// TEST CARDS
// ═══════════════════════════════════════════

const TEST_CARDS = {
  success: {
    number: '4987654321098769',
    cvv: '123',
    expiry: '12/25',
    name: 'Test User'
  },
  failure: {
    number: '4000000000000002',
    cvv: '123',
    expiry: '12/25',
    name: 'Test User'
  }
}

// ═══════════════════════════════════════════
// ENVIRONMENT VARIABLES
// ═══════════════════════════════════════════

/*
  Required in server/.env:
  ─────────────────────────
  PAYMOB_API_KEY=your_key
  PAYMOB_SECRET_KEY=your_secret
  PAYMOB_INTEGRATION_ID=5577534
  
  Optional:
  ─────────
  PAYMOB_PUBLIC_KEY=your_public_key
  PAYMOB_MODE=test
  PAYMOB_HMAC_SECRET=your_hmac_secret
*/

// ═══════════════════════════════════════════
// COMMON PATTERNS
// ═══════════════════════════════════════════

// Pattern 1: Checkout page with form
function CheckoutPagePattern() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  return (
    <div>
      <input 
        placeholder="Name"
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <input 
        placeholder="Email"
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      <input 
        placeholder="Phone"
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
      />
      
      <PaymobFlashButton
        cardId="card_123"
        amount={100.00}
        currency="EGP"
        customerName={formData.name}
        customerEmail={formData.email}
        customerPhone={formData.phone}
      />
    </div>
  )
}

// Pattern 2: Handle payment in existing flow
async function handleExistingPaymentFlow() {
  const sessionId = `session-${Date.now()}`
  
  try {
    // Create intention
    const result = await createPaymobFlashIntention({
      cardId: getCurrentCardId(),
      customerName: getUserName(),
      customerEmail: getUserEmail(),
      customerPhone: getUserPhone(),
      amount: getCartTotal(),
      currency: 'EGP',
      sessionId
    })
    
    // Store session ID
    localStorage.setItem('payment_session', sessionId)
    
    // Redirect to payment
    window.location.href = result.paymentUrl
    
  } catch (error) {
    toast.error('Payment failed: ' + error.message)
  }
}

// Pattern 3: Check status on return
useEffect(() => {
  const sessionId = localStorage.getItem('payment_session')
  if (sessionId) {
    getPaymobFlashStatus(sessionId).then(status => {
      if (status.status === 'completed') {
        showSuccessMessage()
        downloadContent()
      } else if (status.status === 'failed') {
        showErrorMessage()
      }
    })
  }
}, [])

// ═══════════════════════════════════════════
// TROUBLESHOOTING
// ═══════════════════════════════════════════

/*
  Problem: "API key not configured"
  Solution: Add PAYMOB_API_KEY to .env

  Problem: No payment URL returned
  Solution: Check API key is correct and valid

  Problem: Callback not received
  Solution: Configure webhook URL in Paymob dashboard

  Problem: HMAC verification failed
  Solution: Check PAYMOB_SECRET_KEY matches dashboard

  Problem: Test cards not working
  Solution: Ensure PAYMOB_MODE=test and PAYMOB_INTEGRATION_ID=5577534
*/

// ═══════════════════════════════════════════
// TESTING
// ═══════════════════════════════════════════

// Run automated tests
// $ node server/test_paymob_flash.js

// Manual testing steps:
// 1. Set PAYMOB_MODE=test
// 2. Use integration ID: 5577534
// 3. Use test card: 4987654321098769
// 4. Complete payment flow
// 5. Verify callback received
// 6. Check payment status

// ═══════════════════════════════════════════
// GOING LIVE
// ═══════════════════════════════════════════

/*
  Checklist:
  ─────────
  ✅ Get production credentials from Paymob
  ✅ Update PAYMOB_MODE=live
  ✅ Update PAYMOB_INTEGRATION_ID to production ID
  ✅ Configure webhook URL in dashboard
  ✅ Test with real cards
  ✅ Enable HTTPS
  ✅ Monitor transactions
*/

// ═══════════════════════════════════════════
// SUPPORT & DOCS
// ═══════════════════════════════════════════

/*
  Full Documentation: ./PAYMOB_FLASH_INTEGRATION.md
  Quick Start: ./PAYMOB_QUICK_START.md
  Arabic Guide: ./PAYMOB_FINAL_SUMMARY_AR.md
  
  Paymob Support: support@paymob.com
  Paymob Docs: https://developers.paymob.com
  Paymob Dashboard: https://accept.paymob.com
*/

export default {
  TEST_CARDS,
  // Add any constants or helpers here
}
