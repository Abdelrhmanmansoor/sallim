// ═══════════════════════════════════════════
// Paymob Flash Integration - Test Script
// ═══════════════════════════════════════════
// Run this to verify the integration is working correctly

import fetch from 'node-fetch'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'
const API_BASE = `${BACKEND_URL}/api/v1/paymob-flash`

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Test 1: Health Check
async function testHealthCheck() {
  try {
    log('\n📋 Test 1: Health Check', 'blue')
    
    const response = await fetch(`${API_BASE}/health`)
    const data = await response.json()
    
    if (data.success) {
      log('✅ Health check passed', 'green')
      log(`   Mode: ${data.mode}`, 'yellow')
      log(`   Message: ${data.message}`, 'yellow')
      return true
    } else {
      log('❌ Health check failed', 'red')
      return false
    }
  } catch (error) {
    log(`❌ Health check error: ${error.message}`, 'red')
    return false
  }
}

// Test 2: Create Payment Intention
async function testCreateIntention() {
  try {
    log('\n📋 Test 2: Create Payment Intention', 'blue')
    
    const payload = {
      cardId: 'test_card_123',
      customerName: 'Ahmed Ali Test',
      customerPhone: '+201234567890',
      customerEmail: 'test@example.com',
      amount: 100.00,
      currency: 'EGP',
      sessionId: `test-session-${Date.now()}`,
      billing_data: {
        country: 'EG',
        city: 'Cairo',
        street: 'Test Street',
        building: '1',
        floor: '1',
        apartment: '1',
      }
    }
    
    log('   Sending request...', 'yellow')
    
    const response = await fetch(`${API_BASE}/create-intention`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    
    const data = await response.json()
    
    if (response.ok && data.success) {
      log('✅ Payment intention created successfully', 'green')
      log(`   Intention ID: ${data.intentionId}`, 'yellow')
      log(`   Merchant Order ID: ${data.merchantOrderId}`, 'yellow')
      log(`   Has Payment URL: ${!!data.paymentUrl}`, 'yellow')
      
      if (data.paymentUrl) {
        log(`   Payment URL: ${data.paymentUrl.substring(0, 50)}...`, 'yellow')
      }
      
      return { success: true, data }
    } else {
      log('❌ Failed to create payment intention', 'red')
      log(`   Error: ${data.error}`, 'red')
      return { success: false, error: data.error }
    }
  } catch (error) {
    log(`❌ Create intention error: ${error.message}`, 'red')
    return { success: false, error: error.message }
  }
}

// Test 3: Check Payment Status
async function testPaymentStatus(sessionId) {
  try {
    log('\n📋 Test 3: Check Payment Status', 'blue')
    
    const response = await fetch(`${API_BASE}/status/${sessionId}`)
    const data = await response.json()
    
    if (data.success) {
      log('✅ Payment status retrieved successfully', 'green')
      log(`   Status: ${data.status}`, 'yellow')
      log(`   Amount: ${data.amount} ${data.currency}`, 'yellow')
      if (data.transactionId) {
        log(`   Transaction ID: ${data.transactionId}`, 'yellow')
      }
      return true
    } else {
      log('❌ Failed to retrieve payment status', 'red')
      log(`   Error: ${data.error}`, 'red')
      return false
    }
  } catch (error) {
    log(`❌ Status check error: ${error.message}`, 'red')
    return false
  }
}

// Main test runner
async function runTests() {
  log('\n═══════════════════════════════════════════', 'blue')
  log('  Paymob Flash Integration - Test Suite', 'blue')
  log('═══════════════════════════════════════════\n', 'blue')
  
  log(`Backend URL: ${BACKEND_URL}`, 'yellow')
  log(`API Base: ${API_BASE}`, 'yellow')
  
  let passed = 0
  let failed = 0
  
  // Test 1
  const test1 = await testHealthCheck()
  test1 ? passed++ : failed++
  
  // Test 2
  const test2 = await testCreateIntention()
  if (test2.success) {
    passed++
    
    // Test 3 (if we have a session ID)
    if (test2.data?.sessionId) {
      const test3 = await testPaymentStatus(test2.data.sessionId)
      test3 ? passed++ : failed++
    }
  } else {
    failed++
  }
  
  // Summary
  log('\n═══════════════════════════════════════════', 'blue')
  log('  Test Results', 'blue')
  log('═══════════════════════════════════════════', 'blue')
  log(`✅ Passed: ${passed}`, 'green')
  log(`❌ Failed: ${failed}`, failed > 0 ? 'red' : 'green')
  log(`📊 Total: ${passed + failed}`, 'yellow')
  
  if (failed === 0) {
    log('\n🎉 All tests passed!', 'green')
  } else {
    log('\n⚠️  Some tests failed. Check the logs above.', 'yellow')
  }
  
  log('\n═══════════════════════════════════════════\n', 'blue')
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red')
  process.exit(1)
})
