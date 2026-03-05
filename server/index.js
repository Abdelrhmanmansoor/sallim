import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// ═══ Health Check ═══
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sallim API is running 🌙' })
})

// ═══ Templates API ═══
app.get('/api/v1/templates', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'هلال ذهبي', category: 'هلال', pattern: 'crescent' },
      { id: 2, name: 'نجوم المساء', category: 'نجوم', pattern: 'stars' },
      { id: 3, name: 'زخرفة إسلامية', category: 'زخارف', pattern: 'geometric' },
    ]
  })
})

// ═══ Texts API ═══
app.get('/api/v1/texts', (req, res) => {
  const { category, search, limit = 20, page = 1 } = req.query
  // In production, this would query MongoDB
  res.json({
    success: true,
    data: [],
    pagination: { page: Number(page), limit: Number(limit), total: 105 }
  })
})

// ═══ Card Generation API ═══
app.post('/api/v1/cards/generate', (req, res) => {
  const { template_id, main_text, sub_text, recipient_name, sender_name, font, theme } = req.body
  
  // Validate API key
  const apiKey = req.headers.authorization?.replace('Bearer ', '')
  if (!apiKey || !apiKey.startsWith('eid_')) {
    return res.status(401).json({ success: false, error: 'Invalid API key' })
  }

  // In production: use Puppeteer to render and return image
  res.json({
    success: true,
    data: {
      card_id: `card_${Date.now()}`,
      image_url: '/generated/card.png',
      download_url: '/api/v1/cards/download/card.png',
    }
  })
})

// ═══ Bulk Generation API ═══
app.post('/api/v1/cards/bulk', (req, res) => {
  const { template_id, recipients, font, theme } = req.body
  
  const apiKey = req.headers.authorization?.replace('Bearer ', '')
  if (!apiKey || !apiKey.startsWith('eid_')) {
    return res.status(401).json({ success: false, error: 'Invalid API key' })
  }

  // In production: use Puppeteer to batch generate
  const results = (recipients || []).map((r, i) => ({
    recipient: r.name,
    card_id: `card_${Date.now()}_${i}`,
    status: 'generated',
  }))

  res.json({
    success: true,
    data: {
      batch_id: `batch_${Date.now()}`,
      total: results.length,
      zip_url: '/api/v1/cards/download/batch.zip',
      cards: results,
    }
  })
})

// ═══ White Label Config API ═══
app.get('/api/v1/whitelabel/config', (req, res) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '')
  if (!apiKey) {
    return res.status(401).json({ success: false, error: 'API key required' })
  }
  
  res.json({
    success: true,
    data: {
      companyName: '',
      primaryColor: '#d4a843',
      secondaryColor: '#0a0a1a',
      domain: '',
      hideBranding: false,
    }
  })
})

app.put('/api/v1/whitelabel/config', (req, res) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '')
  if (!apiKey) {
    return res.status(401).json({ success: false, error: 'API key required' })
  }

  // In production: save to MongoDB
  res.json({ success: true, message: 'Config updated successfully' })
})

// ═══ Payment Verification (Manual) ═══
app.post('/api/v1/payments/verify', (req, res) => {
  const { plan, transfer_id, whatsapp_number } = req.body
  
  // This would be handled manually
  res.json({
    success: true,
    message: 'طلب الاشتراك تم استلامه. سيتم التفعيل خلال 24 ساعة بعد تأكيد التحويل.',
    data: {
      request_id: `pay_${Date.now()}`,
      plan,
      status: 'pending_verification',
    }
  })
})

// ═══ Stats API ═══
app.get('/api/v1/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalCards: 1247,
      activeUsers: 89,
      messagesSent: 456,
      templates: 20,
      texts: 105,
    }
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🌙 Sallim API running on http://localhost:${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
})
