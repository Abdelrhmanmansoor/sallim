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

export default API_BASE
