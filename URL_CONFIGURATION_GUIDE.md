# دليل إعداد URLs - منصة سلّم

## 📅 تاريخ التحديث: 18 مارس 2026

---

## 🌐 الروابط الأساسية

### Frontend (الموقع الرئيسي)
```
https://www.sallim.co
```

### Backend (API Server)
```
https://sallim-be.vercel.app
```

---

## 🔧 Environment Variables

### 1. `.env` في Vercel (Backend)
```env
# URLs الأساسية
CLIENT_URL=https://www.sallim.co
BACKEND_URL=https://sallim-be.vercel.app

# Paymob URLs
PAYMOB_API_KEY=your_live_key
PAYMOB_SECRET_KEY=your_secret_key
PAYMOB_PUBLIC_KEY=your_public_key
PAYMOB_MODE=live
```

### 2. `.env` في Frontend (Vite/Vercel)
```env
VITE_API_URL=https://sallim-be.vercel.app
```

---

## 📧 Email Links

### بعد الدفع الناجح للأفراد
```
https://www.sallim.co/editor?cardId={cardId}&purchase={purchaseId}&autodownload=1
```

### بعد الدفع الناجح للشركات
```
https://www.sallim.co/c/{slug}?utm=company&auto_login=1
```

---

## 🔄 Redirect URLs في Paymob

### Payment Result Page
```
https://www.sallim.co/payment-result
```

### Callback URL (Webhook)
```
https://sallim-be.vercel.app/api/v1/paymob-flash/callback
```

---

## 📋 التحقق من الإعدادات

### 1. فحص Backend Health
```bash
curl https://sallim-be.vercel.app/api/v1/paymob-flash/health
```

**النتيجة المتوقعة:**
```json
{
  "success": true,
  "mode": "live",
  "clientUrl": "https://www.sallim.co",
  "backendUrl": "https://sallim-be.vercel.app"
}
```

### 2. فحص CORS Headers
```bash
curl -I https://sallim-be.vercel.app/api/v1/cards
```

**النتيجة المتوقعة:**
```
Access-Control-Allow-Origin: https://www.sallim.co
```

---

## ✅ قائمة التحقق

قبل النشر في الإنتاج، تأكد من:

- [ ] `CLIENT_URL` = `https://www.sallim.co` في Backend
- [ ] `BACKEND_URL` = `https://sallim-be.vercel.app` في Backend
- [ ] `VITE_API_URL` = `https://sallim-be.vercel.app` في Frontend
- [ ] Paymob callback URL = `https://sallim-be.vercel.app/api/v1/paymob-flash/callback`
- [ ] Paymob redirect URL = `https://www.sallim.co/payment-result`
- [ ] جميع الروابط في الإيميلات تبدأ بـ `https://www.sallim.co`
- [ ] webhook يعمل على `https://sallim-be.vercel.app`

---

## 🔧 حل المشاكل الشائعة

### مشكلة: CORS Error

**الأعراض:**
```
Access to fetch at 'https://sallim-be.vercel.app' from origin 'https://www.sallim.co' 
has been blocked by CORS policy
```

**الحل:**
تأكد من إضافة `https://www.sallim.co` في `server/index.js`:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://www.sallim.co',
    'https://sallim-be.vercel.app'
  ]
}))
```

---

### مشكلة: Redirects to localhost بعد الدفع

**الأعراض:**
بعد الدفع الناجح، يتم توجيه المستخدم إلى `http://localhost:5173`

**الحل:**
1. تأكد من `CLIENT_URL=https://www.sallim.co` في `.env` في Vercel
2. أعد نشر (redeploy) Backend
3. أعد اختبار الدفع

---

### مشكلة: Email links تشير إلى localhost

**الأعراض:**
الإيميلات تحتوي على روابط مثل `http://localhost:5173/editor?cardId=...`

**الحل:**
تأكد من تحديث `CLIENT_URL` في Vercel Environment Variables، ثم Redeploy Backend

---

### مشكلة: Paymob Callback لا يعمل

**الأعراض:**
لا يتم تأكيد الدفع، status يظل `pending`

**الحل:**
1. تأكد من Paymob callback URL: `https://sallim-be.vercel.app/api/v1/paymob-flash/callback`
2. تحقق من logs في Vercel: `paymob-flash/callback`
3. تأكد من `PAYMOB_SECRET_KEY` صحيح

---

## 📊 اختبار الشامل

### سيناريو 1: شراء بطاقة (فرد)
1. افتح `https://www.sallim.co`
2. اختر بطاقة
3. املأ البيانات
4. ادفع
5. بعد الدفع:
   - [ ] يُ redirected إلى `https://www.sallim.co/editor?cardId=...&autodownload=1`
   - [ ] البطاقة تُحمّل تلقائياً
   - [ ] الإيميل يحتوي على رابط `https://www.sallim.co/editor?...`

### سيناريو 2: شراء باقة (شركة)
1. افتح `https://www.sallim.co/companies`
2. اختر باقة
3. املأ بيانات الشركة
4. ادفع
5. بعد الدفع:
   - [ ] يُ redirected إلى `https://www.sallim.co/payment-result`
   - [ ] الحساب يُنشأ فوراً
   - [ ] الإيميل يحتوي على رابط `https://www.sallim.co/c/{slug}`

---

## 🔗 روابط مفيدة

- [Dashboard Vercel Backend](https://vercel.com/dashboard)
- [Dashboard Vercel Frontend](https://vercel.com/dashboard)
- [Paymob Dashboard](https://accept.paymob.com)
- [MongoDB Atlas](https://cloud.mongodb.com)

---

## 📝 ملاحظات مهمة

1. **HTTPS Required:**
   - جميع الروابط في الإنتاج يجب أن تستخدم HTTPS
   - Paymob لا يقبل HTTP في الإنتاج

2. **CORS Configuration:**
   - تأكد من إضافة جميع domains المسموح بها
   - بما في ذلك `https://www.sallim.co`

3. **Webhook Security:**
   - Paymob callback يجب أن يكون على HTTPS
   - تأكد من HMAC verification يعمل بشكل صحيح

4. **Redirect URLs:**
   - تأكد من جميع redirect URLs تشير إلى `https://www.sallim.co`
   - لا تستخدم localhost في الإنتاج

---

**تم إعداد جميع الـ URLs بنجاح! ✅**