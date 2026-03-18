// ═══════════════════════════════════════════
// Paymob Flash Payment Component Example
// ═══════════════════════════════════════════
// This is a React component example showing how to integrate Paymob Flash

import React, { useState } from 'react'
import { 
  createPaymobFlashIntention, 
  getPaymobFlashStatus 
} from '../utils/api'
import toast from 'react-hot-toast'

/**
 * Example: Paymob Flash Checkout Button
 * 
 * Usage:
 * <PaymobFlashButton 
 *   cardId="card123" 
 *   amount={100.00} 
 *   currency="EGP"
 *   customerName="Ahmed Ali"
 *   customerEmail="ahmed@example.com"
 *   customerPhone="+201234567890"
 * />
 */
export function PaymobFlashButton({
  cardId,
  amount,
  currency = 'EGP',
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onError,
  className = '',
}) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    try {
      setLoading(true)

      // Validate inputs
      if (!customerName || !customerEmail || !customerPhone) {
        toast.error('يرجى إدخال جميع البيانات المطلوبة')
        setLoading(false)
        return
      }

      if (!amount || amount <= 0) {
        toast.error('المبلغ غير صحيح')
        setLoading(false)
        return
      }

      // Generate unique session ID
      const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Create payment intention
      const response = await createPaymobFlashIntention({
        cardId,
        customerName,
        customerPhone,
        customerEmail,
        amount,
        currency,
        sessionId,
        billing_data: {
          // Optional: Add billing details if available
          country: 'EG',
          city: 'Cairo',
          street: 'N/A',
          building: 'N/A',
          floor: 'N/A',
          apartment: 'N/A',
        }
      })

      const checkoutUrl = response?.checkoutUrl || response?.paymentUrl
      if (response.success && checkoutUrl) {
        // Store session ID for status checking
        localStorage.setItem('paymob_session_id', sessionId)
        
        // Redirect to Paymob payment page
        window.location.href = checkoutUrl
        
        // Optional: Call success callback
        if (onSuccess) {
          onSuccess(response)
        }
      } else {
        throw new Error(response.error || 'فشل إنشاء طلب الدفع')
      }

    } catch (error) {
      console.error('Paymob Flash payment error:', error)
      toast.error(error.message || 'حدث خطأ أثناء معالجة الدفع')
      
      if (onError) {
        onError(error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={className || 'paymob-flash-button'}
      style={{
        padding: '12px 24px',
        backgroundColor: loading ? '#ccc' : '#00d9ff',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        ...(!loading && {
          ':hover': {
            backgroundColor: '#00b8d4',
          }
        })
      }}
    >
      {loading ? 'جاري التحميل...' : 'الدفع عبر Paymob'}
    </button>
  )
}

/**
 * Example: Payment Result Page Component
 * Place this on your /payment-result page to check payment status
 */
export function PaymentResultChecker() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    checkPaymentStatus()
  }, [])

  const checkPaymentStatus = async () => {
    try {
      // Get session ID from localStorage or URL params
      const sessionId = localStorage.getItem('paymob_session_id') || 
                       new URLSearchParams(window.location.search).get('session_id')

      if (!sessionId) {
        setStatus({ success: false, message: 'لم يتم العثور على معرف الجلسة' })
        setLoading(false)
        return
      }

      // Check payment status
      const response = await getPaymobFlashStatus(sessionId)

      if (response.success) {
        setStatus({
          success: response.status === 'completed',
          status: response.status,
          amount: response.amount,
          currency: response.currency,
          transactionId: response.transactionId,
          message: response.status === 'completed' 
            ? 'تم الدفع بنجاح!' 
            : response.status === 'pending'
            ? 'الدفع قيد المعالجة'
            : 'فشل الدفع'
        })
      } else {
        setStatus({ success: false, message: response.error || 'فشل التحقق من حالة الدفع' })
      }

    } catch (error) {
      console.error('Payment status check error:', error)
      setStatus({ success: false, message: 'حدث خطأ أثناء التحقق من حالة الدفع' })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div className="spinner">جاري التحقق من حالة الدفع...</div>
      </div>
    )
  }

  if (!status) {
    return null
  }

  return (
    <div style={{
      textAlign: 'center',
      padding: '40px',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: "'Tajawal', sans-serif",
      direction: 'rtl'
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: '20px'
      }}>
        {status.success ? '✅' : '❌'}
      </div>
      
      <h2 style={{
        fontSize: '28px',
        marginBottom: '16px',
        color: status.success ? '#00d9ff' : '#f44336'
      }}>
        {status.message}
      </h2>

      {status.success && status.transactionId && (
        <p style={{ color: '#666', marginBottom: '20px' }}>
          رقم المعاملة: {status.transactionId}
        </p>
      )}

      {status.amount && (
        <p style={{ color: '#666', marginBottom: '20px' }}>
          المبلغ: {status.amount} {status.currency}
        </p>
      )}

      <button
        onClick={() => window.location.href = '/'}
        style={{
          padding: '12px 32px',
          backgroundColor: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        العودة للرئيسية
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════
// Usage Examples
// ═══════════════════════════════════════════

/*

// Example 1: Basic usage in a component
import { PaymobFlashButton } from './components/PaymobFlash'

function CheckoutPage() {
  return (
    <div>
      <h1>الدفع</h1>
      <PaymobFlashButton
        cardId="card_123"
        amount={100.00}
        currency="EGP"
        customerName="Ahmed Ali"
        customerEmail="ahmed@example.com"
        customerPhone="+201234567890"
      />
    </div>
  )
}

// Example 2: With callbacks
<PaymobFlashButton
  cardId="card_123"
  amount={50.00}
  currency="EGP"
  customerName="Sara Hassan"
  customerEmail="sara@example.com"
  customerPhone="+201111111111"
  onSuccess={(response) => {
    console.log('Payment initiated:', response)
    // Track analytics, etc.
  }}
  onError={(error) => {
    console.error('Payment failed:', error)
    // Log error to monitoring service
  }}
/>

// Example 3: Payment result page
import { PaymentResultChecker } from './components/PaymobFlash'

function PaymentResultPage() {
  return (
    <div>
      <PaymentResultChecker />
    </div>
  )
}

*/

export default {
  PaymobFlashButton,
  PaymentResultChecker,
}
