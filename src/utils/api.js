// ═══════════════════════════════════════════
// سَلِّم Sallim — API Configuration
// ═══════════════════════════════════════════

// In production, VITE_API_URL is set in Vercel environment variables
// pointing to the Render backend URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Make an API request to the Sallim backend
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}/api/v1${endpoint}`

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const res = await fetch(url, config)
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || 'حدث خطأ في الاتصال بالسيرفر')
    }

    return data
  } catch (error) {
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error('لا يمكن الاتصال بالسيرفر. تأكد من اتصال الإنترنت.')
    }
    throw error
  }
}

/**
 * Save a card to the database and get a share link
 */
export async function saveCard(cardData) {
  return apiRequest('/cards', {
    method: 'POST',
    body: JSON.stringify(cardData),
  })
}

/**
 * Get a shared card by its ID
 */
export async function getCard(shareId) {
  return apiRequest(`/cards/${shareId}`)
}

/**
 * Get public stats
 */
export async function getPublicStats() {
  return apiRequest('/cards/public/stats')
}

export default API_BASE
