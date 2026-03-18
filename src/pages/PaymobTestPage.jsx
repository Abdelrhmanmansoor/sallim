// ═══════════════════════════════════════════
// Paymob Flash - Test Payment Page
// ═══════════════════════════════════════════

import React, { useState } from 'react'
import { PaymobFlashButton } from '../components/PaymobFlash'
import toast, { Toaster } from 'react-hot-toast'

export default function PaymobTestPage() {
  const [formData, setFormData] = useState({
    name: 'Ahmed Test',
    email: 'test@example.com',
    phone: '+201234567890',
    amount: '10.00',
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: "'Tajawal', sans-serif",
      direction: 'rtl'
    }}>
      <Toaster position="top-center" />
      
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
            🧪 اختبار Paymob Flash
          </h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            اختبر الدفع باستخدام بطاقات الاختبار
          </p>
        </div>

        {/* Test Card Info */}
        <div style={{
          background: '#f0f9ff',
          border: '2px solid #3b82f6',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#1e40af' }}>
            💳 بطاقات الاختبار
          </h3>
          
          <div style={{ marginBottom: '15px' }}>
            <strong style={{ color: '#059669' }}>✅ للدفع الناجح:</strong>
            <div style={{ 
              background: 'white', 
              padding: '12px', 
              borderRadius: '8px', 
              marginTop: '8px',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}>
              <div>البطاقة: <strong>4987654321098769</strong></div>
              <div>CVV: <strong>123</strong></div>
              <div>انتهاء: <strong>12/25</strong></div>
            </div>
          </div>

          <div>
            <strong style={{ color: '#dc2626' }}>❌ للدفع الفاشل:</strong>
            <div style={{ 
              background: 'white', 
              padding: '12px', 
              borderRadius: '8px', 
              marginTop: '8px',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}>
              <div>البطاقة: <strong>4000000000000002</strong></div>
              <div>CVV: <strong>123</strong></div>
              <div>انتهاء: <strong>12/25</strong></div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              الاسم
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e5e7eb',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e5e7eb',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              رقم الهاتف
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e5e7eb',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              المبلغ (جنيه)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #e5e7eb',
                fontSize: '16px'
              }}
            />
          </div>
        </div>

        {/* Payment Button */}
        <PaymobFlashButton
          cardId="test_card_for_demo"
          amount={parseFloat(formData.amount)}
          currency="EGP"
          customerName={formData.name}
          customerEmail={formData.email}
          customerPhone={formData.phone}
          onSuccess={(response) => {
            console.log('Payment Success:', response)
            toast.success('تم إنشاء الدفع بنجاح! جاري التوجيه...')
          }}
          onError={(error) => {
            console.error('Payment Error:', error)
            toast.error('حدث خطأ: ' + error.message)
          }}
          className=""
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.2s',
          }}
        />

        {/* Status Info */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#f9fafb',
          borderRadius: '12px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>الوضع:</strong> Test Mode ✅
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Integration ID:</strong> 5577534
          </div>
          <div>
            <strong>ملاحظة:</strong> هذه عملية اختبار - لن تُخصم أموال حقيقية
          </div>
        </div>

      </div>
    </div>
  )
}
