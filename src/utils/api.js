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
    ...options,
    headers: {
      'Content-Type': 'application/json',
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
 * Public: Get active templates
 */
export async function getTemplates(season = '') {
  const query = season ? `?season=${season}` : ''
  return apiRequest(`/templates${query}`)
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
  return apiRequest(`/diwaniya/${username}/family`)
}

/**
 * Submit an Eidiya request
 */
export async function createEidiyaRequest(username, data) {
  return apiRequest(`/diwaniya/${username}/family/eidiya-request`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Add a family story/update
 */
export async function createFamilyStory(username, data) {
  return apiRequest(`/diwaniya/${username}/family/story`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Join family as a member
 */
export async function joinFamily(username, data) {
  return apiRequest(`/diwaniya/${username}/family/member`, {
    method: 'POST',
    body: JSON.stringify(data)
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

export default API_BASE
