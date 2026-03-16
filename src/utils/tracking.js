// ═══════════════════════════════════════════════════════
// Tracking Utilities - Snapchat Pixel & Other Analytics
// ═══════════════════════════════════════════════════════

/**
 * Track Snapchat event
 * @param {string} eventName - Event name (e.g., 'CUSTOM_EVENT_1', 'PURCHASE', 'ADD_CART')
 * @param {object} params - Optional event parameters
 */
export function trackSnapchat(eventName = 'CUSTOM_EVENT_1', params = {}) {
  try {
    if (typeof window !== 'undefined' && window.snaptr) {
      window.snaptr('track', eventName, params)
      console.log(`[Snapchat] Tracked: ${eventName}`, params)
    } else {
      console.warn('[Snapchat] snaptr not loaded')
    }
  } catch (error) {
    console.error('[Snapchat] Tracking error:', error)
  }
}

/**
 * Track WhatsApp button click
 * @param {string} source - Where the button was clicked (e.g., 'BulkPage', 'PricingPage')
 */
export function trackWhatsAppClick(source = 'Unknown') {
  trackSnapchat('CUSTOM_EVENT_1', {
    source,
    action: 'whatsapp_click',
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track download event
 * @param {string} type - Download type (e.g., 'card', 'bulk')
 */
export function trackDownload(type = 'card') {
  trackSnapchat('CUSTOM_EVENT_1', {
    action: 'download',
    type,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track purchase intent
 * @param {object} packageInfo - Package details
 */
export function trackPurchaseIntent(packageInfo = {}) {
  trackSnapchat('ADD_CART', {
    ...packageInfo,
    timestamp: new Date().toISOString(),
  })
}
