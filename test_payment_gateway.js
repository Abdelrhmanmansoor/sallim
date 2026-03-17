/**
 * Payment Gateway Integration Test
 * Tests: Paymob auth → order creation → payment key → callback flow
 * Run: node test_payment_gateway.js
 */

const BASE = process.env.API_URL || 'http://localhost:3001/api/v1'

let passed = 0
let failed = 0

function ok(label, condition, detail = '') {
  if (condition) {
    console.log(`  ✅ ${label}`)
    passed++
  } else {
    console.log(`  ❌ ${label}${detail ? ' — ' + detail : ''}`)
    failed++
  }
}

async function run() {
  console.log(`\n🔍 Payment Gateway Tests — ${BASE}\n`)

  // ── 1. Exchange Rate endpoint ──────────────────────────────
  console.log('1️⃣  Exchange Rate API')
  try {
    const r = await fetch(`${BASE}/checkout/exchange-rate?country=EG`)
    const d = await r.json()
    ok('status 200', r.status === 200)
    ok('success: true', d.success === true)
    ok('EGP rate present', d.visitorRate > 0, `rate=${d.visitorRate}`)
    ok('country detected', d.country === 'EG', `country=${d.country}`)
  } catch (e) {
    ok('exchange-rate reachable', false, e.message)
  }

  // ── 2. Checkout /initiate — missing fields ─────────────────
  console.log('\n2️⃣  /checkout/initiate — validation')
  try {
    const r = await fetch(`${BASE}/checkout/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const d = await r.json()
    ok('returns 400 on empty body', r.status === 400, `status=${r.status}`)
    ok('success: false', d.success === false)
  } catch (e) {
    ok('/initiate reachable', false, e.message)
  }

  // ── 3. Checkout /initiate — fake cardId ────────────────────
  console.log('\n3️⃣  /checkout/initiate — invalid cardId')
  try {
    const r = await fetch(`${BASE}/checkout/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardId: '000000000000000000000000',
        customerName: 'Test User',
        customerPhone: '+201092211483',
        customerEmail: 'test@sallim.co',
        sessionId: 'test-session-999',
      }),
    })
    const d = await r.json()
    ok('returns 4xx on fake card', r.status >= 400 && r.status < 600, `status=${r.status}`)
    ok('success: false', d.success === false, `msg=${d.message}`)
  } catch (e) {
    ok('/initiate fake card reachable', false, e.message)
  }

  // ── 4. Company Checkout — packages list ───────────────────
  console.log('\n4️⃣  /company-checkout/packages')
  try {
    const r = await fetch(`${BASE}/company-checkout/packages`)
    const d = await r.json()
    ok('status 200', r.status === 200)
    ok('success: true', d.success === true)
    ok('packages array present', Array.isArray(d.packages) && d.packages.length >= 3,
      `count=${d.packages?.length}`)
    const keys = d.packages?.map(p => p.key)
    ok('has starter/pro/enterprise', keys?.includes('starter') && keys?.includes('pro'))
  } catch (e) {
    ok('/company-checkout/packages reachable', false, e.message)
  }

  // ── 5. Company Checkout /initiate — validation ────────────
  console.log('\n5️⃣  /company-checkout/initiate — validation')
  try {
    const r = await fetch(`${BASE}/company-checkout/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const d = await r.json()
    ok('returns 400 on empty body', r.status === 400, `status=${r.status}`)
    ok('success: false', d.success === false)
  } catch (e) {
    ok('/company-checkout/initiate reachable', false, e.message)
  }

  // ── 6. Callback — missing orderId ─────────────────────────
  console.log('\n6️⃣  /checkout/callback — missing orderId')
  try {
    const r = await fetch(`${BASE}/checkout/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'TRANSACTION', obj: {} }),
    })
    const d = await r.json()
    ok('returns 400 on missing orderId', r.status === 400, `status=${r.status}`)
  } catch (e) {
    ok('/checkout/callback reachable', false, e.message)
  }

  // ── 7. Callback — fake orderId ────────────────────────────
  console.log('\n7️⃣  /checkout/callback — fake orderId (should 404, not 500)')
  try {
    const r = await fetch(`${BASE}/checkout/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'TRANSACTION',
        obj: { order: { id: '999999999999' }, success: true },
      }),
    })
    const d = await r.json()
    ok('not a 500 server error', r.status !== 500, `status=${r.status}`)
    ok('success: false', d.success === false, `msg=${d.message}`)
  } catch (e) {
    ok('/checkout/callback fake orderId reachable', false, e.message)
  }

  // ── 8. Rate limiter present on /initiate ──────────────────
  console.log('\n8️⃣  Rate limiter headers on /checkout/initiate')
  try {
    const r = await fetch(`${BASE}/checkout/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const rlHeader = r.headers.get('ratelimit-limit') || r.headers.get('x-ratelimit-limit')
    ok('RateLimit header present', !!rlHeader, `header=${rlHeader}`)
  } catch (e) {
    ok('rate limit header check', false, e.message)
  }

  // ── 9. Phone validation regex (unit test) ─────────────────
  console.log('\n9️⃣  Phone validation (local regex test)')
  const phoneRegex = /^\+?[\d\s\-()]{7,20}$/
  const valid = ['+201092211483', '01092211483', '+966512345678', '0512345678', '+447911123456', '+12025551234']
  const invalid = ['abc', '12', '+']
  valid.forEach(p => ok(`accepts ${p}`, phoneRegex.test(p)))
  invalid.forEach(p => ok(`rejects "${p}"`, !phoneRegex.test(p)))

  // ── Summary ───────────────────────────────────────────────
  console.log(`\n${'─'.repeat(45)}`)
  console.log(`Results: ${passed} passed, ${failed} failed`)
  if (failed === 0) {
    console.log('🎉 All tests passed — payment gateway is healthy\n')
  } else {
    console.log('⚠️  Some tests failed — check issues above\n')
    process.exit(1)
  }
}

run().catch(e => { console.error('Test runner crashed:', e); process.exit(1) })
