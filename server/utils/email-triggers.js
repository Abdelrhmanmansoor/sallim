import {
  sendActivationEmail,
  sendInvoiceEmail,
  sendPackagePurchaseEmail,
  sendCompanyWelcomeEmail,
  sendLimitWarningEmail,
  sendLimitReachedEmail,
  sendNewOrderNotification
} from './email.js'

// ══════════════════════════════════════════
// 1. onCompanyOrderReceived — طلب باقة جديد
// ══════════════════════════════════════════

export async function onCompanyOrderReceived(orderData) {
  try {
    await sendNewOrderNotification({
      companyName: orderData.companyName,
      packageName: orderData.packageName,
      contactNumber: orderData.contactNumber,
      requestDate: orderData.requestDate || new Date().toLocaleDateString('ar-SA'),
    })
    console.log(`[email-trigger] ✅ Admin notified about order from ${orderData.companyName}`)
  } catch (err) {
    console.error('[email-trigger] ❌ Failed to notify admin:', err.message)
  }

  try {
    if (orderData.email) {
      await sendPackagePurchaseEmail({
        to: orderData.email,
        customerName: orderData.companyName,
        packageName: orderData.packageName,
        quantity: orderData.quantity || 0,
        amount: orderData.amount || 0,
        currency: orderData.currency || 'SAR',
        downloadUrl: orderData.downloadUrl || '#',
      })
      console.log(`[email-trigger] ✅ Purchase confirmation sent to ${orderData.email}`)
    }
  } catch (err) {
    console.error('[email-trigger] ❌ Failed to send purchase confirmation:', err.message)
  }
}

// ══════════════════════════════════════════
// 2. onActivationCodeCreated — كود تفعيل جديد
// ══════════════════════════════════════════

export async function onActivationCodeCreated(data) {
  try {
    await sendActivationEmail({
      to: data.email,
      companyName: data.companyName,
      code: data.code,
      packageName: data.packageName,
      limit: data.limit,
    })
    console.log(`[email-trigger] ✅ Activation email sent to ${data.email}`)
  } catch (err) {
    console.error('[email-trigger] ❌ Failed to send activation email:', err.message)
  }
}

// ══════════════════════════════════════════
// 3. onCompanyActivated — تفعيل حساب شركة
// ══════════════════════════════════════════

export async function onCompanyActivated(data) {
  try {
    await sendCompanyWelcomeEmail({
      to: data.email,
      companyName: data.companyName,
      packageName: data.packageName,
      limit: data.limit,
      dashboardUrl: data.dashboardUrl,
    })
    console.log(`[email-trigger] ✅ Welcome email sent to ${data.email}`)
  } catch (err) {
    console.error('[email-trigger] ❌ Failed to send welcome email:', err.message)
  }

  try {
    if (data.invoiceNumber) {
      await sendInvoiceEmail({
        to: data.email,
        customerName: data.companyName,
        invoiceNumber: data.invoiceNumber,
        date: data.date || new Date().toLocaleDateString('ar-SA'),
        items: data.items || [{ name: data.packageName, qty: 1, price: data.amount || 0 }],
        total: data.total || data.amount || 0,
        currency: data.currency || 'SAR',
      })
      console.log(`[email-trigger] ✅ Invoice sent to ${data.email}`)
    }
  } catch (err) {
    console.error('[email-trigger] ❌ Failed to send invoice:', err.message)
  }
}

// ══════════════════════════════════════════
// 4. onIndividualPurchase — شراء فردي
// ══════════════════════════════════════════

export async function onIndividualPurchase(data) {
  try {
    await sendPackagePurchaseEmail({
      to: data.email,
      customerName: data.customerName,
      packageName: data.packageName,
      quantity: data.quantity,
      amount: data.amount,
      currency: data.currency || 'SAR',
      downloadUrl: data.downloadUrl,
    })
    console.log(`[email-trigger] ✅ Purchase email sent to ${data.email}`)
  } catch (err) {
    console.error('[email-trigger] ❌ Failed to send purchase email:', err.message)
  }

  try {
    if (data.invoiceNumber) {
      await sendInvoiceEmail({
        to: data.email,
        customerName: data.customerName,
        invoiceNumber: data.invoiceNumber,
        date: data.date || new Date().toLocaleDateString('ar-SA'),
        items: data.items || [{ name: data.packageName, qty: data.quantity, price: data.amount }],
        total: data.total || data.amount,
        currency: data.currency || 'SAR',
      })
      console.log(`[email-trigger] ✅ Invoice sent to ${data.email}`)
    }
  } catch (err) {
    console.error('[email-trigger] ❌ Failed to send invoice:', err.message)
  }
}

// ══════════════════════════════════════════
// 5. onUsageWarning — تحذير 80%
// ══════════════════════════════════════════

export async function onUsageWarning(data) {
  try {
    await sendLimitWarningEmail({
      to: data.email,
      companyName: data.companyName,
      used: data.used,
      limit: data.limit,
      remaining: data.remaining,
    })
    console.log(`[email-trigger] ✅ Usage warning sent to ${data.email} (${data.used}/${data.limit})`)
  } catch (err) {
    console.error('[email-trigger] ❌ Failed to send usage warning:', err.message)
  }
}

// ══════════════════════════════════════════
// 6. onUsageExhausted — نفاد كامل
// ══════════════════════════════════════════

export async function onUsageExhausted(data) {
  try {
    await sendLimitReachedEmail({
      to: data.email,
      companyName: data.companyName,
      limit: data.limit,
    })
    console.log(`[email-trigger] ✅ Usage exhausted email sent to ${data.email}`)
  } catch (err) {
    console.error('[email-trigger] ❌ Failed to send exhausted email:', err.message)
  }
}
