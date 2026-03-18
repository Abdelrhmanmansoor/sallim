# دليل استخدام URLs - منصة سلّم

## 📅 تاريخ التحديث: 18 مارس 2026

---

## 🎯 المبدأ الأساسي

**العميل لا يجب أن يرى رابط Backend أبداً!**

---

## 🌐 الروابط المختلفة

### 1. CLIENT_URL - يراه العميل ✅
```
https://www.sallim.co
```
**الاستخدام:**
- صفحات الموقع
- Redirects بعد الدفع
- روابط في الإيميلات
- صفحة المحرر
- صفحة نتائج الدفع

**مثال:**
```javascript
// ✓ صحيح - العميل يرى هذا الرابط
const redirectUrl = `${CLIENT_URL}/editor?cardId=123&autodownload=1`
// النتيجة: https://www.sallim.co/editor?cardId=123&autodownload=1
```

### 2. BACKEND_URL - لا يراه العميل ❌
```
https://sallim-be.vercel.app
```
**الاستخدام:**
- Webhooks فقط (من Paymob)
- Self-ping للـ keep-alive
- API requests من Frontend إلى Backend

**مثال:**
```javascript
// ✓ صحيح - هذا للـ webhook فقط (العميل لا يراه)
notification_url: `${BACKEND_URL}/api/v1/paymob-flash/callback`
// النتيجة: https://sallim-be.vercel.app/api/v1/paymob-flash/callback
```

---

## ✅ التطبيق الصحيح

### في server/routes/paymob-flash.js:

```javascript
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'

// ✓ صحيح - Redirect يراه العميل
redirection_url: `${CLIENT_URL}/payment-result`
// النتيجة: https://www.sallim.co/payment-result

// ✓ صحيح - Webhook لا يراه العميل
notification_url: `${BACKEND_URL}/api/v1/paymob-flash/callback`
// النتيجة: https://sallim-be.vercel.app/api/v1/paymob-flash/callback
```

### في server/routes/checkout.js:

```javascript
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

// ✓ صحيح - Redirect يراه العميل
redirectUrl: `/editor?cardId=${cardId}&autodownload=1`
// يُستخدم مع CLIENT_URL في الـ full URL
```

---

## 📧 الإيميلات - يجب أن تستخدم CLIENT_URL فقط

### إيميل تأكيد الدفع (للأفراد):
```javascript
const fullRedirect = redirectPath.startsWith('http')
  ? redirectPath
  : `${CLIENT_URL}${redirectPath.startsWith('/') ? '' : '/'}${redirectPath}`
// النتيجة: https://www.sallim.co/editor?cardId=123...
```

### إيميل ترحيبي (للشركات):
```javascript
const dashboardUrl = `${CLIENT_URL}/c/${company.slug}?utm=company&auto_login=1`
// النتيجة: https://www.sallim.co/c/abc123def4?utm=company&auto_login=1
```

---

## 🔍 التحقق من الاستخدام الصحيح

### أماكن يجب أن تستخدم CLIENT_URL:
- ✅ Redirect URLs بعد الدفع
- ✅ روابط في الإيميلات
- ✅ Dashboard URLs للشركات
- ✅ Editor URLs للأفراد
- ✅ صفحة النتائج

### أماكن يجب أن تستخدم BACKEND_URL:
- ✅ Webhook URLs (من Paymob فقط)
- ✅ Self-ping URLs (للـ keep-alive)
- ❌ لا تستخدم في Redirect URLs
- ❌ لا تستخدم في الإيميلات
- ❌ لا تستخدم في أي user-facing links

---

## 📋 قائمة التحقق

قبل النشر في الإنتاج، تأكد من:

- [ ] `CLIENT_URL` = `https://www.sallim.co`
- [ ] `BACKEND_URL` = `https://sallim-be.vercel.app`
- [ ] جميع redirect URLs تستخدم `CLIENT_URL`
- [ ] جميع روابط الإيميلات تستخدم `CLIENT_URL`
- [ ] Webhook URL فقط يستخدم `BACKEND_URL`
- [ ] لا يوجد `BACKEND_URL` في أي user-facing links

---

## 🧪 الاختبار

### اختبار 1: شراء بطاقة
1. ادفع بنجاح
2. تحقق من redirect:
   - ✓ يجب أن يكون: `https://www.sallim.co/editor?...`
   - ✗ يجب ألا يكون: `https://sallim-be.vercel.app/...`

3. تحقق من الإيميل:
   - ✓ يجب أن تكون الروابط: `https://www.sallim.co/...`
   - ✗ يجب ألا تكون: `https://sallim-be.vercel.app/...`

### اختبار 2: شراء باقة شركة
1. ادفع بنجاح
2. تحقق من الإيميل:
   - ✓ يجب أن يكون رابط Dashboard: `https://www.sallim.co/c/...`
   - ✗ يجب ألا يكون: `https://sallim-be.vercel.app/c/...`

---

## 🔧 حل المشاكل

### إذا وجدت BACKEND_URL في user-facing link:

**المشكلة:**
```javascript
// ✗ خطأ - العميل يرى backend URL
redirectUrl: `${BACKEND_URL}/editor?cardId=...`
```

**الحل:**
```javascript
// ✓ صحيح - العميل يرى frontend URL فقط
redirectUrl: `${CLIENT_URL}/editor?cardId=...`
```

---

## 📝 مثال شامل

### Payment Intention:
```javascript
const intention = await createPaymentIntention({
  // ... other params
  extras: {
    // ✓ صحيح - webhook فقط (العميل لا يراه)
    notification_url: `${BACKEND_URL}/api/v1/paymob-flash/callback`,
    
    // ✓ صحيح - redirect يراه العميل
    redirection_url: `${CLIENT_URL}/payment-result`,
  }
})
```

### Email Links:
```javascript
const html = `
  <p>
    <!-- ✓ صحيح - العميل يرى هذا الرابط -->
    <a href="${CLIENT_URL}/editor?cardId=${cardId}">
      فتح التصميم
    </a>
  </p>
`
```

---

## ✅ الخلاصة

### قاعدة بسيطة:
- **CLIENT_URL** = يراه العميل (Frontend)
- **BACKEND_URL** = لا يراه العميل (Webhooks فقط)

### تذكر دائماً:
```
عميل = CLIENT_URL (www.sallim.co)
webhook = BACKEND_URL (sallim-be.vercel.app)
```

**تم التأكد من أن الكود يستخدم URLs بشكل صحيح! ✅**