// ═══════════════════════════════════════════
// سَلِّم Sallim — API Configuration
// ═══════════════════════════════════════════

// In production, VITE_API_URL is set in Vercel environment variables
// pointing to the Render backend URL
const RAW_API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API_BASE = RAW_API_BASE.replace(/\/+$/, '')

/**
 * Make an API request to the Sallim backend
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}/api/v1${endpoint}`

  let licenseToken
  try {
    licenseToken = window?.localStorage?.getItem('eidgreet_license_token')
  } catch {
    licenseToken = null
  }

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(licenseToken ? { 'x-license-token': licenseToken } : {}),
      ...options.headers,
    },
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

/**
 * Admin: Get all cards
 */
export async function getAdminCards(adminKey) {
  return apiRequest('/cards/admin/all', {
    headers: {
      'x-admin-key': adminKey
    }
  })
}

/**
 * Admin: Get all companies
 */
export async function getAdminCompanies(adminKey) {
  return apiRequest('/admin/companies', {
    headers: {
      'x-admin-key': adminKey
    }
  })
}

/**
 * Admin: Invite new company
 */
export async function inviteCompany(adminKey, companyData) {
  return apiRequest('/admin/companies', {
    method: 'POST',
    headers: {
      'x-admin-key': adminKey
    },
    body: JSON.stringify(companyData)
  })
}

/**
 * Admin: Update specific company
 */
export async function updateCompanyAsAdmin(adminKey, companyId, updateData) {
  return apiRequest(`/admin/companies/${companyId}`, {
    method: 'PUT',
    headers: {
      'x-admin-key': adminKey
    },
    body: JSON.stringify(updateData)
  })
}

/**
 * Company: Update profile (including logo via FormData)
 */
export async function updateCompanyProfile(token, formData) {
  const url = `${API_BASE}/api/v1/company/profile`

  // We use direct fetch here because we CANNOT set Content-Type
  // The browser MUST set it to multipart/form-data with the correct boundary
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'حدث خطأ أثناء رفع الشعار')
  }

  return data
}

/**
 * Company: Purchase enterprise product and create account
 */
export async function purchaseCompanyPlan(data) {
  return apiRequest('/company/purchase', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Company: Resolve a direct access link
 */
export async function resolveCompanyAccessLink(code) {
  return apiRequest(`/company/access/${code}`)
}

/**
 * Company: Get dashboard data
 */
export async function getCompanyDashboard(token) {
  return apiRequest('/company/dashboard', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

/**
 * Company: Consume batch cards (deduct from balance)
 */
export async function consumeBatchCards(token, count) {
  return apiRequest('/company/consume-batch', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ count })
  })
}

/**
 * Company: Get team members
 */
export async function getCompanyTeam(token) {
  return apiRequest('/company/team', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

/**
 * Company: Invite team member
 */
export async function inviteCompanyTeamMember(token, data) {
  return apiRequest('/company/team/invite', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
}

/**
 * Personal: Create a paid single-card order
 */
export async function createPersonalOrder(data) {
  return apiRequest('/orders/personal/checkout', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Personal: Get a specific order
 */
export async function getPersonalOrder(orderId) {
  return apiRequest(`/orders/personal/${orderId}`)
}

/**
 * Personal: Consume the one-time download after payment
 */
export async function consumePersonalOrder(orderId, snapshot) {
  return apiRequest('/orders/personal/consume', {
    method: 'POST',
    body: JSON.stringify({ orderId, snapshot })
  })
}

export async function createBatchOrder(data) {
  return apiRequest('/orders/batch/checkout', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export async function consumeBatchOrder(orderId, snapshot, names) {
  return apiRequest('/orders/batch/consume', {
    method: 'POST',
    body: JSON.stringify({ orderId, snapshot, names })
  })
}

export async function createPayPalOrder() {
  return apiRequest('/orders/paypal/create', {
    method: 'POST',
    body: JSON.stringify({ product: 'batch' })
  })
}

export async function capturePayPalOrder(orderId) {
  return apiRequest('/orders/paypal/capture', {
    method: 'POST',
    body: JSON.stringify({ orderId })
  })
}

export async function activateLicense(code, deviceId) {
  return apiRequest('/orders/license/activate', {
    method: 'POST',
    body: JSON.stringify({ code, deviceId }),
  })
}

export async function verifyLicense() {
  return apiRequest('/orders/license/verify')
}

// ═══════════════════════════════════════════
// Paymob Flash Payment Integration
// ═══════════════════════════════════════════

/**
 * Create Paymob Flash Payment Intention
 * @param {Object} params - Payment parameters
 * @param {string} params.cardId - Card ID
 * @param {string} params.customerName - Customer name
 * @param {string} params.customerPhone - Customer phone
 * @param {string} params.customerEmail - Customer email
 * @param {number} params.amount - Amount (in main currency, e.g., 100.00 EGP)
 * @param {string} params.currency - Currency code (default: 'EGP')
 * @param {string} params.sessionId - Unique session ID
 * @param {Object} params.billing_data - Optional billing data
 * @returns {Promise<Object>} - Payment intention with checkout URL
 */
export async function createPaymobFlashIntention({
  cardId,
  productName,
  customerName,
  customerPhone,
  customerEmail,
  amount,
  currency = 'EGP',
  sessionId,
  billing_data = {}
}) {
  return apiRequest('/paymob-flash/create-intention', {
    method: 'POST',
    body: JSON.stringify({
      cardId,
      productName,
      customerName,
      customerPhone,
      customerEmail,
      amount,
      currency,
      sessionId,
      billing_data
    })
  })
}

/**
 * Check Paymob Flash Payment Status
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} - Payment status
 */
export async function getPaymobFlashStatus(sessionId) {
  return apiRequest(`/paymob-flash/status/${sessionId}`)
}

/**
 * Get Paymob Flash Transaction Details
 * @param {number} transactionId - Transaction ID
 * @returns {Promise<Object>} - Transaction details
 */
export async function getPaymobFlashTransaction(transactionId) {
  return apiRequest(`/paymob-flash/transaction/${transactionId}`)
}

/**
 * Check Paymob Flash Health
 * @returns {Promise<Object>} - Health status
 */
export async function checkPaymobFlashHealth() {
  return apiRequest('/paymob-flash/health')
}

/**
 * Get Paymob payment methods (single source)
 */
export async function getPaymobPaymentMethods() {
  return apiRequest('/paymob-flash/payment-methods')
}

/**
 * Public: Log preview/security events
 */
export async function logProtectionEvent(eventType, payload = {}) {
  return apiRequest('/orders/events', {
    method: 'POST',
    body: JSON.stringify({ eventType, ...payload })
  })
}

/**
 * Public: Get active templates
 */
export async function getTemplates(season = '', options = {}) {
  const params = new URLSearchParams()
  if (season) params.set('season', season)
  if (options.companySlug) params.set('companySlug', options.companySlug)
  if (options.companyContextToken) params.set('companyContextToken', options.companyContextToken)
  if (options.companyAccessCode) params.set('companyAccessCode', options.companyAccessCode)

  let userToken = ''
  let companyToken = ''
  let companyContextToken = options.companyContextToken || ''
  try {
    userToken = localStorage.getItem('token') || ''
    companyToken = localStorage.getItem('sallim_company_token') || ''
    if (!companyContextToken) {
      companyContextToken = sessionStorage.getItem('sallim_company_context_token') || localStorage.getItem('sallim_company_context_token') || ''
    }
  } catch {
    // ignore storage read errors
  }

  const query = params.toString() ? `?${params.toString()}` : ''
  return apiRequest(`/templates${query}`, {
    headers: {
      ...(userToken ? { Authorization: `Bearer ${userToken}` } : {}),
      ...(companyToken ? { 'x-company-auth-token': companyToken } : {}),
      ...(companyContextToken ? { 'x-company-context-token': companyContextToken } : {}),
    }
  })
}

export async function getCompanyContextBySlug(slug) {
  return apiRequest(`/company/context/${encodeURIComponent(slug)}`)
}

export async function resolveCompanyAccessCode(accessCode) {
  return apiRequest('/company/access-code', {
    method: 'POST',
    body: JSON.stringify({ accessCode })
  })
}

/**
 * Admin: Get all templates
 */
export async function getAdminTemplates(adminKey) {
  return apiRequest('/admin/templates', {
    headers: {
      'x-admin-key': adminKey
    }
  })
}

/**
 * Admin: Add new template (FormData)
 */
export async function addAdminTemplate(adminKey, formData) {
  const url = `${API_BASE}/api/v1/admin/templates`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-admin-key': adminKey
    },
    body: formData
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'حدث خطأ أثناء رفع القالب')
  }

  return data
}

export async function updateAdminTemplate(adminKey, templateId, updateData) {
  return apiRequest(`/admin/templates/${templateId}`, {
    method: 'PUT',
    headers: {
      'x-admin-key': adminKey
    },
    body: JSON.stringify(updateData)
  })
}

/**
 * Admin: Delete template
 */
export async function deleteAdminTemplate(adminKey, templateId) {
  return apiRequest(`/admin/templates/${templateId}`, {
    method: 'DELETE',
    headers: {
      'x-admin-key': adminKey
    }
  })
}

/**
 * Blog: Get all published posts
 */
export async function getBlogPosts() {
  return apiRequest('/blog')
}

/**
 * Blog: Get specific post by slug
 */
export async function getBlogPostBySlug(slug) {
  return apiRequest(`/blog/${slug}`)
}

/**
 * Admin: Get all blog posts
 */
export async function getAdminBlogPosts(adminKey) {
  return apiRequest('/admin/blog', {
    headers: {
      'x-admin-key': adminKey
    }
  })
}

/**
 * Admin: Add new blog post
 */
export async function addAdminBlogPost(adminKey, formData) {
  const url = `${API_BASE}/api/v1/admin/blog`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-admin-key': adminKey
    },
    body: formData
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'حدث خطأ أثناء إضافة المقال')
  return data
}

/**
 * Admin: Update blog post
 */
export async function updateAdminBlogPost(adminKey, postId, formData) {
  const url = `${API_BASE}/api/v1/admin/blog/${postId}`
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'x-admin-key': adminKey
    },
    body: formData
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'حدث خطأ أثناء تحديث المقال')
  return data
}

/**
 * Admin: Delete blog post
 */
export async function deleteAdminBlogPost(adminKey, postId) {
  return apiRequest(`/admin/blog/${postId}`, {
    method: 'DELETE',
    headers: {
      'x-admin-key': adminKey
    }
  })
}

// ═════════════════════════════════════════════
// TICKETS (Support & Custom Design)
// ═════════════════════════════════════════════

/**
 * Company: Get my tickets
 */
export async function getMyTickets(token) {
  return apiRequest('/tickets/my-tickets', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
}

/**
 * Company: Create new ticket
 */
export async function createTicket(token, data) {
  return apiRequest('/tickets/my-tickets', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  })
}

/**
 * Company: Reply to ticket
 */
export async function replyToTicket(token, ticketId, message) {
  return apiRequest(`/tickets/my-tickets/${ticketId}/reply`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ message })
  })
}

/**
 * Admin: Get all tickets
 */
export async function getAdminTickets(adminKey) {
  return apiRequest('/tickets/admin', {
    headers: { 'x-admin-key': adminKey }
  })
}

/**
 * Admin: Reply to ticket
 */
export async function adminReplyToTicket(adminKey, ticketId, message) {
  return apiRequest(`/tickets/admin/${ticketId}/reply`, {
    method: 'POST',
    headers: { 'x-admin-key': adminKey },
    body: JSON.stringify({ message })
  })
}

/**
 * Admin: Update ticket status
 */
export async function updateAdminTicketStatus(adminKey, ticketId, status) {
  return apiRequest(`/tickets/admin/${ticketId}/status`, {
    method: 'PUT',
    headers: { 'x-admin-key': adminKey },
    body: JSON.stringify({ status })
  })
}

// ═════════════════════════════════════════════
// DIWAN AL-EID (Interactive Greetings)
// ═════════════════════════════════════════════

/**
 * Public: Create a new Diwan page
 */
export async function createDiwan(data) {
  return apiRequest('/diwan', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Public: Get a Diwan page by username
 */
export async function getDiwan(username) {
  return apiRequest(`/diwan/${username}`)
}

/**
 * Public: Add a greeting to a specific Diwan
 */
export async function addDiwanGreeting(username, data) {
  return apiRequest(`/diwan/${username}/greet`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Public: Like a specific greeting inside a Diwan
 */
export async function likeDiwanGreeting(username, greetId) {
  return apiRequest(`/diwan/${username}/greet/${greetId}/like`, {
    method: 'POST'
  })
}

/**
 * Public: Record a real view for a Diwan
 */
export async function recordDiwanView(username) {
  return apiRequest(`/diwan/${username}/view`, {
    method: 'POST'
  })
}

// ═════════════════════════════════════════════
// DIWANIYAT AL-EID (Anonymous Greetings)
// ═════════════════════════════════════════════

/**
 * Public: Create a new Diwaniya page
 */
export async function createDiwaniya(data) {
  const token = localStorage.getItem('token')
  const headers = {}

  // If user is logged in, send the token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return apiRequest('/diwaniya', {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  })
}

/**
 * Public: Get a Diwaniya page by username (public view)
 */
export async function getDiwaniya(username) {
  return apiRequest(`/diwaniya/${username}`)
}

/**
 * Public: Get all greetings for owner (including private)
 */
export async function getDiwaniyaManage(username) {
  return apiRequest(`/diwaniya/${username}/manage`)
}

/**
 * Public: Add a greeting to a specific Diwaniya
 */
export async function addDiwaniyaGreeting(username, data) {
  return apiRequest(`/diwaniya/${username}/greet`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Public: Like a specific greeting inside a Diwaniya
 */
export async function likeDiwaniyaGreeting(username, greetId) {
  return apiRequest(`/diwaniya/${username}/greet/${greetId}/like`, {
    method: 'POST'
  })
}

/**
 * Owner: Update greeting visibility
 */
export async function updateDiwaniyaGreetingVisibility(username, greetId, visibility) {
  const token = localStorage.getItem('token')
  return apiRequest(`/diwaniya/${username}/greet/${greetId}/visibility`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ visibility })
  })
}

/**
 * Auth: Update Diwaniya settings (requires token)
 */
export async function updateDiwaniyaSettings(username, settings) {
  const token = localStorage.getItem('token')
  return apiRequest(`/diwaniya/${username}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(settings)
  })
}

/**
 * Owner: Delete a greeting
 */
export async function deleteDiwaniyaGreeting(username, greetId) {
  return apiRequest(`/diwaniya/${username}/greet/${greetId}`, {
    method: 'DELETE'
  })
}

/**
 * Public: Record a real view for a Diwaniya
 */
export async function recordDiwaniyaView(username) {
  return apiRequest(`/diwaniya/${username}/view`, {
    method: 'POST'
  })
}

// ═════════════════════════════════════════════
// FAMILY MODE (Stories, Members, Requests)
// ═════════════════════════════════════════════

/**
 * Get family data for a Diwaniya
 */
export async function getFamilyData(username) {
  return apiRequest(`/diwaniya/${username}/family-data`)
}

/**
 * Get all Eidiya requests (for owner)
 */
export async function getEidiyaRequests(username) {
  return apiRequest(`/diwaniya/${username}/eidiya-requests`)
}

/**
 * Update Eidiya request status
 */
export async function updateEidiyaRequestStatus(username, requestId, status) {
  return apiRequest(`/diwaniya/${username}/eidiya-request/${requestId}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
}

/**
 * Submit an Eidiya request (public)
 */
export async function createEidiyaRequest(username, data) {
  return apiRequest(`/diwaniya/${username}/eidiya-request`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Add a family story/update
 */
export async function createFamilyStory(username, data) {
  return apiRequest(`/diwaniya/${username}/family-story`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Delete a family story
 */
export async function deleteFamilyStory(username, storyId) {
  return apiRequest(`/diwaniya/${username}/family-story/${storyId}`, {
    method: 'DELETE'
  })
}

/**
 * Join family as a member
 */
export async function joinFamily(username, data) {
  return apiRequest(`/diwaniya/${username}/family-member`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Delete a family member
 */
export async function deleteFamilyMember(username, memberId) {
  return apiRequest(`/diwaniya/${username}/family-member/${memberId}`, {
    method: 'DELETE'
  })
}

// ═════════════════════════════════════════════
// EIDIYA GAME (Standalone Quiz Game)
// ═════════════════════════════════════════════

/**
 * Create a new standalone Eidiya Game
 */
export async function createStandaloneGame(data) {
  return apiRequest('/games', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Get Eidiya Game data to play 
 */
export async function getStandaloneGame(gameId) {
  return apiRequest(`/games/${gameId}`)
}

/**
 * Submit an answer to a question in a standalone game
 */
export async function submitStandaloneGameAnswer(gameId, data) {
  return apiRequest(`/games/${gameId}/submit`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Finish game and save score to leaderboard
 */
export async function finishStandaloneGame(gameId, data) {
  return apiRequest(`/games/${gameId}/finish`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

// ═════════════════════════════════════════════
// DIWANIYA GAME (Quiz inside Diwaniya)
// ═════════════════════════════════════════════

/**
 * Get Eidiya Game data for a diwaniya
 */
export async function getDiwaniyaGame(username) {
  return apiRequest(`/diwaniya/${username}/game`)
}

/**
 * Submit an answer to a diwaniya game question
 */
export async function submitDiwaniyaGameAnswer(username, data) {
  return apiRequest(`/diwaniya/${username}/game/answer`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Get game leaderboard
 */
export async function getStandaloneGameLeaderboard(gameId) {
  return apiRequest(`/games/${gameId}/leaderboard`)
}

// ═════════════════════════════════════════════
// AUTHENTICATION (Login, Register, Profile)
// ═════════════════════════════════════════════

/**
 * Public: Register a new user
 */
export async function registerUser(data) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Public: Login existing user
 */
export async function loginUser(data) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Auth: Get user profile (requires token)
 */
export async function getUserProfile() {
  const token = localStorage.getItem('token')
  return apiRequest('/auth/profile', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
}

/**
 * Auth: Claim an existing diwaniya (requires token)
 */
export async function claimDiwaniya(diwaniyaId) {
  const token = localStorage.getItem('token')
  return apiRequest('/auth/claim-diwaniya', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ diwaniyaId })
  })
}

/**
 * Auth: Update user profile (requires token)
 */
export async function updateUserProfile(data) {
  const token = localStorage.getItem('token')
  return apiRequest('/auth/profile', {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  })
}

/**
 * Auth: Link current user account to a company
 */
export async function linkUserCompany(data) {
  const token = localStorage.getItem('token')
  return apiRequest('/auth/link-company', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(data)
  })
}

/**
 * Auth: Upload avatar image (requires token)
 * Uses FormData for multipart upload
 */
export async function uploadAvatar(file) {
  const token = localStorage.getItem('token')
  const url = `${API_BASE}/api/v1/upload/avatar`

  const formData = new FormData()
  formData.append('avatar', file)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || 'حدث خطأ أثناء رفع الصورة')
  }

  return data
}

/**
 * Track platform statistics (visits, downloads, etc)
 */
export async function trackStat(field) {
  try {
    return await apiRequest('/stats/increment', {
      method: 'POST',
      body: JSON.stringify({ field }),
    })
  } catch (error) {
    // Silent fail for analytics
    console.warn('Analytics tracking failed:', error)
    return { success: false }
  }
}

export default API_BASE
