# Paymob Flash Integration - Complete Guide

## Overview

This guide explains how to integrate Paymob Flash payment gateway using the "Create Intention API" method. This is the simplest integration method requiring only one API call.

## Official Documentation

- Paymob Developers: https://developers.paymob.com/paymob-docs
- Integration Paths: https://developers.paymob.com/paymob-docs/integration-paths/apis
- Create Intention API: https://developers.paymob.com/paymob-docs/api-reference/create-intention

## Features

✅ **One-Step Integration**: Single API call to create payment intention  
✅ **Multiple Payment Methods**: Supports all Paymob payment methods  
✅ **Secure**: HMAC signature verification for callbacks  
✅ **Test Mode**: Easy switching between test and live modes  
✅ **Multi-Currency**: Supports EGP, SAR, USD, and more  
✅ **Webhook Support**: Automatic payment status updates  
✅ **Transaction Tracking**: Full transaction history and details  

---

## Setup Instructions

### 1. Environment Variables

Add these variables to your `.env` or `.env.local` file:

```bash
# Paymob Flash Integration
PAYMOB_API_KEY=your_api_key_here
PAYMOB_SECRET_KEY=your_secret_key_here
PAYMOB_PUBLIC_KEY=your_public_key_here
PAYMOB_INTEGRATION_ID=5577534
PAYMOB_MODE=test

# Optional (for legacy integration)
PAYMOB_HMAC_SECRET=your_hmac_secret
PAYMOB_IFRAME_ID=your_iframe_id

# Backend URL (for callbacks)
BACKEND_URL=https://your-backend.onrender.com
CLIENT_URL=https://your-frontend.vercel.app
```

#### Test Mode Configuration

For testing, use these values:
- **PAYMOB_INTEGRATION_ID**: `5577534` (Test Card Integration)
- **PAYMOB_MODE**: `test`

Test Card Details:
```
Card Number: 4987654321098769
CVV: 123
Expiry: Any future date (e.g., 12/25)
Cardholder Name: Test User
```

### 2. Get Paymob Credentials

1. Create account at: https://accept.paymob.com
2. Login to dashboard
3. Go to **Settings** → **Account Info**
4. Copy your API keys:
   - API Key
   - Secret Key
   - Public Key
5. Go to **Developers** → **Integrations**
6. Copy your Integration ID

---

## Backend Implementation

### Files Created

1. **`server/utils/paymob-flash.js`** - Core Paymob utilities
2. **`server/routes/paymob-flash.js`** - API routes
3. **`server/index.js`** - Route registration (updated)

### API Endpoints

#### 1. Create Payment Intention
```
POST /api/v1/paymob-flash/create-intention
```

**Request Body:**
```json
{
  "cardId": "card_123",
  "customerName": "Ahmed Ali",
  "customerPhone": "+201234567890",
  "customerEmail": "ahmed@example.com",
  "amount": 100.00,
  "currency": "EGP",
  "sessionId": "unique-session-id",
  "billing_data": {
    "country": "EG",
    "city": "Cairo",
    "street": "N/A"
  }
}
```

**Response:**
```json
{
  "success": true,
  "intentionId": "int_123456",
  "clientSecret": "secret_xyz",
  "paymentUrl": "https://accept.paymob.com/checkout/...",
  "merchantOrderId": "sallim-flash-card_123-1234567890"
}
```

#### 2. Check Payment Status
```
GET /api/v1/paymob-flash/status/:sessionId
```

**Response:**
```json
{
  "success": true,
  "status": "completed",
  "transactionId": "123456789",
  "amount": 100.00,
  "currency": "EGP",
  "completedAt": "2024-03-17T12:00:00Z"
}
```

#### 3. Payment Callback (Webhook)
```
POST /api/v1/paymob-flash/callback
```

This endpoint receives automatic notifications from Paymob when payment status changes.

#### 4. Health Check
```
GET /api/v1/paymob-flash/health
```

**Response:**
```json
{
  "success": true,
  "mode": "test",
  "message": "Paymob Flash Integration is operational"
}
```

---

## Frontend Implementation

### Files Created

1. **`src/utils/api.js`** - API functions (updated)
2. **`src/components/PaymobFlash.jsx`** - React components

### API Functions

```javascript
import { 
  createPaymobFlashIntention,
  getPaymobFlashStatus,
  getPaymobFlashTransaction,
  checkPaymobFlashHealth
} from '../utils/api'
```

### React Components

#### 1. Payment Button Component

```jsx
import { PaymobFlashButton } from '../components/PaymobFlash'

function CheckoutPage() {
  return (
    <PaymobFlashButton
      cardId="card_123"
      amount={100.00}
      currency="EGP"
      customerName="Ahmed Ali"
      customerEmail="ahmed@example.com"
      customerPhone="+201234567890"
      onSuccess={(response) => {
        console.log('Payment initiated:', response)
      }}
      onError={(error) => {
        console.error('Payment error:', error)
      }}
    />
  )
}
```

#### 2. Payment Result Component

```jsx
import { PaymentResultChecker } from '../components/PaymobFlash'

function PaymentResultPage() {
  return <PaymentResultChecker />
}
```

---

## Payment Flow

### User Journey

1. **Customer clicks "Pay" button**
   - Frontend collects customer details
   - Generates unique session ID
   - Calls `createPaymobFlashIntention()`

2. **Server creates payment intention**
   - Validates customer data
   - Calls Paymob Create Intention API
   - Stores session in database
   - Returns payment URL

3. **Customer redirected to Paymob**
   - User fills payment details
   - Completes 3D Secure if required
   - Paymob processes payment

4. **Payment completion**
   - Paymob sends callback to server
   - Server verifies HMAC signature
   - Updates payment status
   - Records analytics

5. **Customer redirected back**
   - Frontend checks payment status
   - Displays success/failure message
   - Downloads content (if successful)

### Sequence Diagram

```
Customer → Frontend → Backend → Paymob → Backend → Frontend → Customer
    |          |         |         |         |         |         |
    |--Click-->|         |         |         |         |         |
    |          |--POST-->|         |         |         |         |
    |          |         |--API--->|         |         |         |
    |          |         |<--URL---|         |         |         |
    |          |<-URL----|         |         |         |         |
    |<-Redirect|         |         |         |         |         |
    |--Pay---->|         |         |         |         |         |
    |          |         |         |<-Process|         |         |
    |          |         |<-Webhook|         |         |         |
    |          |         |--Update-|         |         |         |
    |<-Redirect|         |         |         |         |         |
    |--Check-->|         |         |         |         |         |
    |          |--GET--->|         |         |         |         |
    |<-Status--|         |         |         |         |         |
```

---

## Security Features

### 1. HMAC Verification

All callbacks from Paymob are verified using HMAC SHA-512 signature:

```javascript
import { verifyPaymobHMAC } from '../utils/paymob-flash.js'

const isValid = verifyPaymobHMAC(callbackData, receivedHmac)
if (!isValid) {
  throw new Error('Invalid signature')
}
```

### 2. Session Validation

- Unique session IDs for each payment
- Session stored in database
- Status tracking (pending → completed/failed)

### 3. Rate Limiting

Checkout endpoints are rate-limited to prevent abuse:

```javascript
import { checkoutLimiter } from '../middleware/rateLimiter.js'
router.post('/create-intention', checkoutLimiter, async (req, res) => {
  // ...
})
```

---

## Testing

### 1. Test Mode

Ensure these environment variables are set:
```bash
PAYMOB_MODE=test
PAYMOB_INTEGRATION_ID=5577534
```

### 2. Test Cards

Use these test card details:

**Successful Payment:**
```
Card: 4987654321098769
CVV: 123
Expiry: 12/25
```

**Failed Payment:**
```
Card: 4000000000000002
CVV: 123
Expiry: 12/25
```

### 3. Test Endpoint

Check integration health:
```bash
curl https://your-backend.onrender.com/api/v1/paymob-flash/health
```

### 4. Test Payment Flow

1. Go to your frontend checkout page
2. Enter customer details
3. Click "Pay with Paymob"
4. Use test card details
5. Complete payment
6. Verify callback received
7. Check payment status on result page

---

## Production Deployment

### 1. Switch to Live Mode

Update environment variables:
```bash
PAYMOB_MODE=live
PAYMOB_INTEGRATION_ID=your_live_integration_id
PAYMOB_API_KEY=your_live_api_key
```

### 2. Webhook Configuration

In Paymob dashboard:
1. Go to **Settings** → **Webhooks**
2. Add webhook URL: `https://your-backend.com/api/v1/paymob-flash/callback`
3. Enable transaction callbacks

### 3. Security Checklist

- ✅ HTTPS enabled on both frontend and backend
- ✅ HMAC verification active
- ✅ Rate limiting configured
- ✅ Environment variables secured
- ✅ Error logging enabled
- ✅ Transaction monitoring setup

---

## Supported Payment Methods

Paymob supports multiple payment methods (configure in dashboard):

- 💳 **Credit/Debit Cards** (Visa, Mastercard, Meeza)
- 📱 **Mobile Wallets** (Vodafone Cash, Orange Money, Etisalat Cash)
- 🏦 **Bank Transfers**
- 💰 **Installments**
- 🎫 **Valu** (Buy Now Pay Later)
- 🔄 **Fawry** (Cash Collection)

---

## Supported Currencies

- EGP (Egyptian Pound)
- SAR (Saudi Riyal)
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- And more...

Currency conversion handled automatically using live exchange rates.

---

## Error Handling

### Common Errors

**1. Invalid API Key**
```json
{
  "success": false,
  "error": "Paymob API key is not configured"
}
```
**Solution:** Check `PAYMOB_API_KEY` in environment variables

**2. Invalid Amount**
```json
{
  "success": false,
  "error": "Invalid amount"
}
```
**Solution:** Ensure amount is positive number

**3. Missing Customer Data**
```json
{
  "success": false,
  "error": "Customer information is incomplete"
}
```
**Solution:** Provide all required customer fields

**4. HMAC Verification Failed**
```
[Paymob Flash] HMAC verification failed
```
**Solution:** Check `PAYMOB_SECRET_KEY` matches dashboard

---

## Monitoring

### Logging

All operations are logged:
```
[Paymob Flash] Creating intention: {...}
[Paymob Flash] Intention created successfully: {...}
[Paymob Flash] Callback received: {...}
[Paymob Flash] Payment status: {...}
```

### Database Records

Payment sessions stored in `CheckoutSession` collection:
```javascript
{
  sessionId: String,
  cardId: String,
  customerName: String,
  customerEmail: String,
  amount: Number,
  currency: String,
  status: String, // pending, completed, failed
  intentionId: String,
  transactionId: String,
  merchantOrderId: String,
  createdAt: Date,
  completedAt: Date
}
```

### Analytics

Successful payments recorded in `Analytics` collection for reporting.

---

## Troubleshooting

### Issue: Payment URL not returned

**Check:**
1. PAYMOB_API_KEY is correct
2. Integration ID is valid
3. Server logs for error details

### Issue: Callback not received

**Check:**
1. Webhook URL configured in Paymob dashboard
2. Backend URL is public (not localhost)
3. Firewall allows Paymob IPs

### Issue: HMAC verification fails

**Check:**
1. PAYMOB_SECRET_KEY matches dashboard
2. Callback data format is correct
3. No data modification in transit

---

## Support

### Paymob Support
- Email: support@paymob.com
- Docs: https://developers.paymob.com
- Dashboard: https://accept.paymob.com

### Project Issues
Check server logs and database records for detailed error information.

---

## Changelog

### Version 1.0.0 (2024-03-17)
- ✅ Initial implementation
- ✅ Create Intention API integration
- ✅ Payment callback handler
- ✅ Status checking endpoints
- ✅ React components
- ✅ Test mode support
- ✅ Documentation

---

## License

MIT License - See project root for details

---

## Credits

Built for **سَلِّم Sallim** - Eid Greeting Platform  
Integration: Paymob Flash API  
Documentation: Paymob Developers Portal
