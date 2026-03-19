// ═══════════════════════════════════════════
// Paymob Flash Integration - Create Intention API
// ═══════════════════════════════════════════
// Documentation: https://developers.paymob.com/paymob-docs/api-reference/create-intention

import crypto from 'crypto'

/**
 * Paymob Flash Configuration
 */
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY
const PAYMOB_SECRET_KEY = process.env.PAYMOB_SECRET_KEY || process.env.SECRET_KEY
const PAYMOB_PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY || process.env.PUBLIC_KEY
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID || process.env.INTEGRATIONID || '5577534' // Test ID by default

// Use Secret Key for authentication (Flash API uses secret key, not API key)
const PAYMOB_AUTH_KEY = PAYMOB_SECRET_KEY || PAYMOB_API_KEY

// Test or Live mode
const PAYMOB_MODE = process.env.PAYMOB_MODE || (process.env.NODE_ENV === 'production' ? 'live' : 'test')

// API Endpoints
const PAYMOB_BASE_URL = PAYMOB_MODE === 'live' 
  ? 'https://accept.paymob.com/v1' 
  : 'https://accept.paymob.com/v1'
const UNIFIED_CHECKOUT_BASE = 'https://accept.paymob.com/unifiedcheckout/'

function buildUnifiedCheckoutUrl(clientSecret) {
  if (!clientSecret || !PAYMOB_PUBLIC_KEY) return null
  const key = encodeURIComponent(PAYMOB_PUBLIC_KEY)
  const secret = encodeURIComponent(clientSecret)
  return `${UNIFIED_CHECKOUT_BASE}?publicKey=${key}&clientSecret=${secret}`
}

/**
 * Normalize redirect/query params to HMAC payload shape
 */
function buildHmacDataFromParams(params = {}) {
  if (!params || typeof params !== 'object') return null
  const orderValue = params.order ?? params['order.id'] ?? params.order_id
  return {
    amount_cents: params.amount_cents,
    created_at: params.created_at,
    currency: params.currency,
    error_occured: params.error_occured,
    has_parent_transaction: params.has_parent_transaction,
    id: params.id || params.transaction_id || params.txn_id,
    integration_id: params.integration_id,
    is_3d_secure: params.is_3d_secure,
    is_auth: params.is_auth,
    is_capture: params.is_capture,
    is_refunded: params.is_refunded,
    is_standalone_payment: params.is_standalone_payment,
    is_voided: params.is_voided,
    order: orderValue,
    owner: params.owner,
    pending: params.pending,
    source_data_pan: params['source_data.pan'] || params.source_data_pan,
    source_data_sub_type: params['source_data.sub_type'] || params.source_data_sub_type,
    source_data_type: params['source_data.type'] || params.source_data_type,
    success: params.success,
  }
}

/**
 * Create Payment Intention using Paymob Flash API
 * This is a one-step integration that returns a checkout URL
 * 
 * @param {Object} params - Payment parameters
 * @param {number} params.amount - Amount in cents (e.g., 10000 for 100 EGP)
 * @param {string} params.currency - Currency code (e.g., 'EGP', 'SAR')
 * @param {Object} params.customer - Customer information
 * @param {string} params.customer.first_name - Customer first name
 * @param {string} params.customer.last_name - Customer last name
 * @param {string} params.customer.email - Customer email
 * @param {string} params.customer.phone - Customer phone number
 * @param {Array<number>} params.payment_methods - Array of integration IDs
 * @param {Object} params.billing_data - Billing information
 * @param {Object} params.extras - Additional metadata
 * @returns {Promise<Object>} - Payment intention response with checkout URL
 */
async function createPaymentIntention({
  amount,
  currency = 'EGP',
  customer,
  payment_methods,
  billing_data,
  extras = {}
}) {
  try {
    // Validate required fields
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount')
    }

    if (!customer || !customer.first_name || !customer.email || !customer.phone) {
      throw new Error('Customer information is incomplete')
    }

    if (!PAYMOB_AUTH_KEY) {
      throw new Error('Paymob authentication key is not configured')
    }

    // Prepare payment methods (use default test integration if not provided)
    const paymentMethodsArray = payment_methods && payment_methods.length > 0
      ? payment_methods
      : [parseInt(PAYMOB_INTEGRATION_ID, 10)]

    // Prepare billing data with defaults
    const billingInfo = {
      first_name: customer.first_name || billing_data?.first_name || 'N/A',
      last_name: customer.last_name || billing_data?.last_name || 'N/A',
      email: customer.email,
      phone_number: customer.phone,
      country: billing_data?.country || 'N/A',
      state: billing_data?.state || 'N/A',
      city: billing_data?.city || 'N/A',
      street: billing_data?.street || 'N/A',
      building: billing_data?.building || 'N/A',
      floor: billing_data?.floor || 'N/A',
      apartment: billing_data?.apartment || 'N/A',
      postal_code: billing_data?.postal_code || '00000',
    }

    // Create intention payload
    const payload = {
      amount,
      currency,
      payment_methods: paymentMethodsArray,
      items: extras.items || [],
      billing_data: billingInfo,
      customer: {
        first_name: customer.first_name,
        last_name: customer.last_name || 'N/A',
        email: customer.email,
        phone: customer.phone,
      },
      extras: {
        ...extras,
        merchant_order_id: extras.merchant_order_id || `order-${Date.now()}`,
      },
      ...(extras.special_reference && { special_reference: extras.special_reference }),
      ...(extras.notification_url && { notification_url: extras.notification_url }),
      ...(extras.redirection_url && { redirection_url: extras.redirection_url }),
    }

    console.log('[Paymob Flash] Creating intention:', {
      amount,
      currency,
      customer: customer.email,
      mode: PAYMOB_MODE
    })

    // Make API request
    console.log('[Paymob Flash] Making API request to:', `${PAYMOB_BASE_URL}/intention/`)
    console.log('[Paymob Flash] Auth key present:', !!PAYMOB_AUTH_KEY)
    console.log('[Paymob Flash] Auth key prefix:', PAYMOB_AUTH_KEY ? PAYMOB_AUTH_KEY.substring(0, 10) + '...' : 'MISSING')
    
    const response = await fetch(`${PAYMOB_BASE_URL}/intention/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${PAYMOB_AUTH_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    console.log('[Paymob Flash] API Response status:', response.status)
    
    if (!response.ok) {
      console.error('[Paymob Flash] Error response:', JSON.stringify(data, null, 2))
      throw new Error(data.detail || data.message || JSON.stringify(data) || 'Failed to create payment intention')
    }

    console.log('[Paymob Flash] Intention created successfully:', {
      id: data.id,
      client_secret: data.client_secret ? 'present' : 'missing'
    })

    const unifiedCheckoutUrl = buildUnifiedCheckoutUrl(data.client_secret)
    const fallbackUrl = data.payment_url || data.iframe_url || data.redirect_url || null
    const checkoutUrl = unifiedCheckoutUrl || fallbackUrl

    if (!checkoutUrl) {
      if (!PAYMOB_PUBLIC_KEY) {
        throw new Error('Paymob public key is not configured; cannot build checkout URL.')
      }
      throw new Error('Paymob response did not include a checkout URL.')
    }

    return {
      success: true,
      intention_id: data.intention_id || data.id,
      client_secret: data.client_secret,
      payment_url: checkoutUrl,
      unified_checkout_url: unifiedCheckoutUrl,
      fallback_url: fallbackUrl,
      data: data
    }

  } catch (error) {
    console.error('[Paymob Flash] Create intention error:', error.message)
    throw error
  }
}

/**
 * Verify HMAC signature for callback
 * @param {Object} data - Callback data
 * @param {string} receivedHmac - HMAC from callback
 * @returns {boolean} - True if HMAC is valid
 */
function verifyPaymobHMAC(data, receivedHmac) {
  try {
    const secret = process.env.HMAC_SECRET || process.env.PAYMOB_HMAC_SECRET || PAYMOB_SECRET_KEY
    if (!secret || !receivedHmac) {
      console.error('[Paymob Flash] HMAC verification failed: missing secret or signature')
      return false
    }

    // Paymob HMAC calculation: concatenate specific fields in order
    const orderValue = typeof data.order === 'object' ? (data.order?.id || '') : (data.order || '')
    const concatenated = [
      data.amount_cents,
      data.created_at,
      data.currency,
      data.error_occured,
      data.has_parent_transaction,
      data.id,
      data.integration_id,
      data.is_3d_secure,
      data.is_auth,
      data.is_capture,
      data.is_refunded,
      data.is_standalone_payment,
      data.is_voided,
      orderValue,
      data.owner,
      data.pending,
      // source_data is a nested object in webhook callbacks
      data.source_data?.pan ?? data.source_data_pan,
      data.source_data?.sub_type ?? data.source_data_sub_type,
      data.source_data?.type ?? data.source_data_type,
      data.success,
    ].join('')

    const calculatedHmac = crypto
      .createHmac('sha512', secret)
      .update(concatenated)
      .digest('hex')

    const received = String(receivedHmac)
    const isValid = calculatedHmac.length === received.length &&
      crypto.timingSafeEqual(
        Buffer.from(calculatedHmac, 'utf8'),
        Buffer.from(received, 'utf8')
      )

    if (!isValid) {
      console.error('[Paymob Flash] HMAC verification failed')
    }

    return isValid

  } catch (error) {
    console.error('[Paymob Flash] HMAC verification error:', error.message)
    return false
  }
}

/**
 * Get intention status
 * @param {string} intentionId - Intention ID
 * @returns {Promise<Object>} - Intention details
 */
async function getIntentionStatus(intentionId) {
  try {
    if (!PAYMOB_AUTH_KEY) {
      throw new Error('Paymob authentication key is not configured')
    }

    const urls = [
      `${PAYMOB_BASE_URL}/intention/${intentionId}`,
      `${PAYMOB_BASE_URL}/intention/${intentionId}/`,
    ]
    let lastError = null

    for (const url of urls) {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${PAYMOB_AUTH_KEY}`,
        },
      })

      let data = null
      try {
        data = await response.json()
      } catch {
        data = null
      }

      if (response.ok) {
        return {
          success: true,
          data,
        }
      }

      lastError = data?.detail || data?.message || `Failed to get intention status (${response.status})`
    }

    throw new Error(lastError || 'Failed to get intention status')

  } catch (error) {
    console.error('[Paymob Flash] Get intention status error:', error.message)
    throw error
  }
}

/**
 * Retrieve transaction details
 * @param {number} transactionId - Transaction ID from callback
 * @returns {Promise<Object>} - Transaction details
 */
async function getTransactionDetails(transactionId) {
  try {
    if (!PAYMOB_AUTH_KEY) {
      throw new Error('Paymob authentication key is not configured')
    }

    const response = await fetch(`https://accept.paymob.com/api/acceptance/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${PAYMOB_AUTH_KEY}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error('Failed to retrieve transaction details')
    }

    return {
      success: true,
      data: data
    }

  } catch (error) {
    console.error('[Paymob Flash] Get transaction error:', error.message)
    throw error
  }
}

// Cache payment methods for reuse
let cachedMethods = null
let cachedAt = 0
const METHODS_TTL = 10 * 60 * 1000 // 10 minutes

async function getPaymentMethods() {
  if (cachedMethods && Date.now() - cachedAt < METHODS_TTL) {
    return cachedMethods
  }

  if (!PAYMOB_PUBLIC_KEY) {
    throw new Error('Paymob public key is not configured')
  }

  const url = `https://accept.paymob.com/v1/intention/payment-methods?public_key=${PAYMOB_PUBLIC_KEY}`
  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch payment methods')
  }

  cachedMethods = data
  cachedAt = Date.now()
  return data
}

// Export individual functions and constants
export {
  createPaymentIntention,
  verifyPaymobHMAC,
  buildHmacDataFromParams,
  getIntentionStatus,
  getTransactionDetails,
  getPaymentMethods,
  PAYMOB_MODE,
  buildUnifiedCheckoutUrl,
}
