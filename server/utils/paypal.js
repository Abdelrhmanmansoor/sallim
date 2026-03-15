const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || ''
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || ''

// Auto-detect environment from client ID prefix if PAYPAL_ENV not explicitly set
// Live keys start with 'A', sandbox keys start with 'A' too but sandbox ones typically
// come from sandbox.paypal.com. Best to rely on explicit env var.
const PAYPAL_ENV = process.env.PAYPAL_ENV || 'live'
const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL || (PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com')

console.log(`[PayPal] ENV=${PAYPAL_ENV}, BASE_URL=${PAYPAL_BASE_URL}, CLIENT_ID=${PAYPAL_CLIENT_ID ? PAYPAL_CLIENT_ID.slice(0, 8) + '...' : 'MISSING'}, SECRET=${PAYPAL_SECRET ? '***set***' : 'MISSING'}`)

let cachedToken = null
let cachedTokenExpiresAt = 0

function getAuthHeader() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64')
  return `Basic ${auth}`
}

async function getAccessToken() {
  const now = Date.now()
  if (cachedToken && cachedTokenExpiresAt - now > 60_000) return cachedToken

  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    const error = new Error('PAYPAL credentials missing')
    error.code = 'PAYPAL_CONFIG_MISSING'
    throw error
  }

  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: getAuthHeader(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    console.error(`[PayPal] Token error ${res.status}:`, JSON.stringify(data))
    const err = new Error(data?.error_description || data?.message || `PayPal token error (${res.status})`)
    err.details = data
    throw err
  }

  cachedToken = data.access_token
  cachedTokenExpiresAt = now + (Number(data.expires_in || 0) * 1000)
  return cachedToken
}

async function paypalRequest(path, options = {}) {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const errMsg = data?.message || data?.error_description || `PayPal request failed (${res.status})`
    console.error(`[PayPal] API error ${res.status}:`, JSON.stringify(data))
    const err = new Error(errMsg)
    err.details = data
    err.status = res.status
    throw err
  }
  return data
}

export async function createPayPalOrder({ amount, currency = 'SAR', description, returnUrl, cancelUrl }) {
  const purchaseUnit = {
    amount: {
      currency_code: currency,
      value: Number(amount).toFixed(2),
    },
  }
  if (description) purchaseUnit.description = description

  const body = {
    intent: 'CAPTURE',
    purchase_units: [purchaseUnit],
  }

  // Only add application_context for redirect flow (not needed for Smart Buttons popup)
  if (returnUrl || cancelUrl) {
    body.application_context = {
      return_url: returnUrl,
      cancel_url: cancelUrl,
      user_action: 'PAY_NOW',
    }
  }

  const data = await paypalRequest('/v2/checkout/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  })

  const approveUrl = Array.isArray(data.links)
    ? (data.links.find(l => l.rel === 'approve')?.href || '')
    : ''

  return {
    id: data.id,
    status: data.status,
    approveUrl,
    raw: data,
  }
}

export async function capturePayPalOrder(orderId) {
  const data = await paypalRequest(`/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    body: JSON.stringify({}),
  })

  const captureId = data?.purchase_units?.[0]?.payments?.captures?.[0]?.id || ''
  const captureStatus = data?.purchase_units?.[0]?.payments?.captures?.[0]?.status || ''
  const amountValue = data?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || ''
  const currencyCode = data?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code || ''

  return {
    id: data.id,
    status: data.status,
    captureId,
    captureStatus,
    amountValue,
    currencyCode,
    raw: data,
  }
}

export async function getPayPalCapture(captureId) {
  const data = await paypalRequest(`/v2/payments/captures/${captureId}`, {
    method: 'GET',
  })

  return {
    id: data.id,
    status: data.status,
    amountValue: data?.amount?.value || '',
    currencyCode: data?.amount?.currency_code || '',
    raw: data,
  }
}
