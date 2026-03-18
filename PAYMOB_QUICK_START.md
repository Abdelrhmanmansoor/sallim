# Paymob Flash Integration - Quick Start

## 🚀 Quick Setup (5 Minutes)

### 1. Add Environment Variables

Add to `server/.env` or `server/.env.local`:

```bash
# Paymob Flash Integration
PAYMOB_API_KEY=your_api_key_here
PAYMOB_SECRET_KEY=your_secret_key_here
PAYMOB_PUBLIC_KEY=your_public_key_here
PAYMOB_INTEGRATION_ID=5577534
PAYMOB_MODE=test
```

### 2. Get Your Credentials

1. Login to [Paymob Dashboard](https://accept.paymob.com)
2. Go to Settings → Account Info
3. Copy your API keys
4. For testing, use Integration ID: **5577534**

### 3. Test the Integration

```bash
cd server
node test_paymob_flash.js
```

### 4. Use in Your App

#### Backend (Already Done ✅)
- Routes: `server/routes/paymob-flash.js`
- Utils: `server/utils/paymob-flash.js`
- Registered in: `server/index.js`

#### Frontend

```jsx
import { PaymobFlashButton } from './components/PaymobFlash'

function CheckoutPage() {
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
```

## 📚 Full Documentation

See [PAYMOB_FLASH_INTEGRATION.md](./PAYMOB_FLASH_INTEGRATION.md) for complete guide.

## 🧪 Test Cards

**Success:**
```
Card: 4987654321098769
CVV: 123
Expiry: 12/25
```

**Failure:**
```
Card: 4000000000000002
CVV: 123
Expiry: 12/25
```

## 🔄 API Endpoints

- `POST /api/v1/paymob-flash/create-intention` - Create payment
- `GET /api/v1/paymob-flash/status/:sessionId` - Check status
- `POST /api/v1/paymob-flash/callback` - Webhook (auto)
- `GET /api/v1/paymob-flash/health` - Health check

## 🎯 Features

- ✅ One-click integration
- ✅ Test mode ready
- ✅ Secure HMAC verification
- ✅ Multi-currency support
- ✅ Automatic callbacks
- ✅ React components included

## 📞 Support

- Paymob: support@paymob.com
- Docs: https://developers.paymob.com

---

Built for **سَلِّم Sallim** 🎉
