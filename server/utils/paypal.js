const PAYPAL_ENV = process.env.PAYPAL_ENV || 'sandbox'
const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL || (PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com')

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || ''
const PAYPAL_SECRET = process.env.PAYPAL_SECRET || ''

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
    const err = new Error(data?.message || 'PayPal token error')
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
    const err = new Error(data?.message || 'PayPal request failed')
    err.details = data
    err.status = res.status
    throw err
  }
  return data
}

export async function createPayPalOrder({ amount, currency = 'SAR', returnUrl, cancelUrl }) {
  const body = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: String(amount),
        },
      },
    ],
    application_context: {
      return_url: returnUrl,
      cancel_url: cancelUrl,
      user_action: 'PAY_NOW',
    },
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
