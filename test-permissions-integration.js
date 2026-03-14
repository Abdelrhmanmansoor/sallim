/**
 * Integration Test for Team Permissions
 * Run with: node test-permissions-integration.js
 * 
 * Prerequisites:
 * 1. Server must be running on http://localhost:3001
 * 2. You need valid tokens for testing
 */

const BASE_URL = 'http://localhost:3001/api/v1'

// Test configuration
const TEST_CONFIG = {
  // Replace these with actual tokens from your database
  COMPANY_ADMIN_TOKEN: 'YOUR_COMPANY_ADMIN_TOKEN_HERE',
  TEAM_MEMBER_WITH_MANAGE_TOKEN: 'YOUR_TEAM_MEMBER_WITH_MANAGE_TOKEN_HERE',
  TEAM_MEMBER_WITHOUT_MANAGE_TOKEN: 'YOUR_TEAM_MEMBER_WITHOUT_MANAGE_TOKEN_HERE',
  TEAM_MEMBER_COMPANY_A_TOKEN: 'YOUR_COMPANY_A_MEMBER_TOKEN_HERE',
  TEAM_MEMBER_ID_COMPANY_B: 'MEMBER_ID_FROM_COMPANY_B',
  COMPANY_ID_A: 'COMPANY_A_ID',
  COMPANY_ID_B: 'COMPANY_B_ID'
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(emoji, message, color = colors.reset) {
  console.log(`${color}${emoji} ${message}${colors.reset}`)
}

function logResult(testName, passed, expected, actual) {
  if (passed) {
    log('✅', `PASS: ${testName}`, colors.green)
  } else {
    log('❌', `FAIL: ${testName}`, colors.red)
    console.log(`   Expected: ${expected}`)
    console.log(`   Actual: ${actual}`)
  }
}

async function makeRequest(endpoint, method, token, body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const data = await response.json()

    return {
      status: response.status,
      data,
      ok: response.ok
    }
  } catch (error) {
    return {
      status: 0,
      data: { error: error.message },
      ok: false
    }
  }
}

async function runTests() {
  console.log('\n' + '═'.repeat(70))
  log('🧪', 'Integration Tests: Team Permissions Middleware', colors.cyan)
  console.log('═'.repeat(70) + '\n')

  let passCount = 0
  let failCount = 0

  // Test 1: موظف بدون manageTeam يحاول دعوة عضو
  log('📋', 'Test 1: Team member without manageTeam tries to invite', colors.blue)
  try {
    const result = await makeRequest(
      '/company/team/invite',
      'POST',
      TEST_CONFIG.TEAM_MEMBER_WITHOUT_MANAGE_TOKEN,
      {
        name: 'Test Member',
        email: 'test@example.com',
        role: 'editor'
      }
    )

    const passed = result.status === 403 && 
                   result.data.error.includes('صلاحية') || 
                   result.data.error === 'غير مصرح'
    logResult(
      'Permission denied for member without manageTeam',
      passed,
      '403 with permission error',
      `${result.status} - ${result.data.error}`
    )
    passed ? passCount++ : failCount++
  } catch (error) {
    logResult('Test 1', false, '403', `Error: ${error.message}`)
    failCount++
  }
  console.log()

  // Test 2: موظف يحاول تعديل عضو من شركة أخرى
  log('📋', 'Test 2: Team member tries to edit member from another company', colors.blue)
  try {
    const result = await makeRequest(
      `/company/team/${TEST_CONFIG.TEAM_MEMBER_ID_COMPANY_B}`,
      'PUT',
      TEST_CONFIG.TEAM_MEMBER_COMPANY_A_TOKEN,
      {
        name: 'Hacked Name',
        role: 'admin'
      }
    )

    const passed = result.status === 403 && result.data.error === 'غير مصرح'
    logResult(
      'Cross-company access blocked',
      passed,
      '403 with generic error',
      `${result.status} - ${result.data.error}`
    )
    passed ? passCount++ : failCount++
  } catch (error) {
    logResult('Test 2', false, '403', `Error: ${error.message}`)
    failCount++
  }
  console.log()

  // Test 3: Company admin ينشئ عضو جديد
  log('📋', 'Test 3: Company admin invites new member', colors.blue)
  try {
    const result = await makeRequest(
      '/company/team/invite',
      'POST',
      TEST_CONFIG.COMPANY_ADMIN_TOKEN,
      {
        name: 'New Team Member',
        email: `test-${Date.now()}@company.com`,
        role: 'editor'
      }
    )

    const passed = result.status === 201 && result.data.success === true
    logResult(
      'Company admin can invite members',
      passed,
      '201 with success',
      `${result.status} - ${result.data.success ? 'success' : 'failed'}`
    )
    passed ? passCount++ : failCount++
  } catch (error) {
    logResult('Test 3', false, '201', `Error: ${error.message}`)
    failCount++
  }
  console.log()

  // Test 4: موظف بصلاحية manageTeam ينشئ عضو
  log('📋', 'Test 4: Team member with manageTeam invites new member', colors.blue)
  try {
    const result = await makeRequest(
      '/company/team/invite',
      'POST',
      TEST_CONFIG.TEAM_MEMBER_WITH_MANAGE_TOKEN,
      {
        name: 'Another Member',
        email: `test2-${Date.now()}@company.com`,
        role: 'viewer'
      }
    )

    const passed = result.status === 201 && result.data.success === true
    logResult(
      'Team member with permission can invite',
      passed,
      '201 with success',
      `${result.status} - ${result.data.success ? 'success' : 'failed'}`
    )
    passed ? passCount++ : failCount++
  } catch (error) {
    logResult('Test 4', false, '201', `Error: ${error.message}`)
    failCount++
  }
  console.log()

  // Summary
  console.log('═'.repeat(70))
  log('📊', 'Test Summary', colors.cyan)
  console.log('═'.repeat(70))
  log('✅', `Passed: ${passCount}`, colors.green)
  log('❌', `Failed: ${failCount}`, colors.red)
  console.log('═'.repeat(70) + '\n')

  if (failCount === 0) {
    log('🎉', 'All tests passed! Middleware is working correctly.', colors.green)
  } else {
    log('⚠️', 'Some tests failed. Please review the middleware implementation.', colors.yellow)
  }

  console.log()
}

// Check if tokens are configured
function checkConfiguration() {
  const unconfigured = Object.entries(TEST_CONFIG).filter(
    ([key, value]) => value.startsWith('YOUR_') || value.includes('_HERE')
  )

  if (unconfigured.length > 0) {
    console.log('\n' + '═'.repeat(70))
    log('⚠️', 'Configuration Required', colors.yellow)
    console.log('═'.repeat(70))
    console.log('\nPlease configure the following tokens in the test file:\n')
    unconfigured.forEach(([key]) => {
      console.log(`  - ${key}`)
    })
    console.log('\nSteps to get tokens:')
    console.log('1. Create a company account via the API')
    console.log('2. Create team members with different permissions')
    console.log('3. Login and copy the JWT tokens')
    console.log('4. Update TEST_CONFIG in this file')
    console.log('5. Run the tests again\n')
    console.log('═'.repeat(70) + '\n')
    return false
  }

  return true
}

// Main execution
console.log()
if (checkConfiguration()) {
  runTests().catch(error => {
    log('❌', `Fatal error: ${error.message}`, colors.red)
    console.error(error)
  })
} else {
  log('ℹ️', 'Tests skipped - configuration needed', colors.blue)
}
