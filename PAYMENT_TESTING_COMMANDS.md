# أوامر اختبار الدفع - منصة سلّم

## 📅 تاريخ التحديث: 18 مارس 2026

---

## 🚀 أوامر التشغيل الأساسية

### تشغيل Backend محلياً
```bash
cd server
npm install
npm start
```

### تشغيل Frontend محلياً
```bash
npm install
npm run dev
```

---

## 🔍 أوامر فحص الـ Backend

### 1. فحص Health Check
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

### 2. فحص CORS
```bash
curl -I https://sallim-be.vercel.app/api/v1/cards
```

**النتيجة المتوقعة:**
```
Access-Control-Allow-Origin: https://www.sallim.co
```

### 3. فحص Payment Methods
```bash
curl https://sallim-be.vercel.app/api/v1/paymob-flash/payment-methods
```

---

## 📧 أوامر اختبار الإيميلات

### اختبار إرسال إيميل (لوحده)
```bash
# في server/test-email.js
node server/test-email.js
```

### إنشاء ملف اختبار إيميل
```javascript
// server/test-email.js
import { sendEmail } from './utils/sendMail.js'

async function testEmail() {
  const result = await sendEmail({
    to: 'your-email@example.com',
    subject: 'اختبار الإيميل - منصة سلّم',
    html: '<h1>مرحباً!</h1><p>هذا اختبار للإيميل</p>',
  })
  
  console.log('Email result:', result)
}

testEmail()
```

### تشغيل الاختبار
```bash
cd server
node test-email.js
```

---

## 💳 أوامر اختبار Paymob

### 1. إنشاء Payment Intention Test
```bash
curl -X POST https://sallim-be.vercel.app/api/v1/paymob-flash/create-intention \
  -H "Content-Type: application/json" \
  -d '{
    "cardId": "test_card_001",
    "productName": "بطاقة اختبار",
    "customerName": "أحمد محمد",
    "customerPhone": "+201234567890",
    "customerEmail": "test@example.com",
    "amount": 10,
    "currency": "EGP",
    "sessionId": "test-session-001"
  }'
```

### 2. فحص Status Session
```bash
curl https://sallim-be.vercel.app/api/v1/paymob-flash/status/test-session-001
```

### 3. فحص Transaction Details
```bash
curl https://sallim-be.vercel.app/api/v1/paymob-flash/transaction/123456789
```

---

## 🔄 أوامر Redeploy (Vercel)

### 1. Redeploy يدوي عبر Vercel CLI
```bash
# تثبيت Vercel CLI
npm install -g vercel

# Redeploy Backend
cd server
vercel --prod
```

### 2. Redeploy من Dashboard
1. افتح [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر Project: `sallim-be`
3. اضغط **Deployments**
4. اضغط **...** على آخر deployment
5. اختر **Redeploy**

---

## 📊 أوامر Monitoring

### مشاهدة Logs في Vercel (CLI)
```bash
vercel logs sallim-be --follow
```

### مشاهدة Logs محلياً
```bash
cd server
npm start 2>&1 | tee server.log
```

### فحص Logs محددة
```bash
# فحص عمليات التسليم الفوري
grep "Instant Delivery" server.log

# فحص إنشاء الشركات
grep "Company dashboard created" server.log

# فحص أخطاء Paymob
grep "Paymob Flash" server.log

# فحص أخطاء الموجهة
grep "Error" server.log
```

---

## 🧪 أوامر اختبار كامل

### اختبار Flow كامل للأفراد
```bash
# 1. فحص Health
curl https://sallim-be.vercel.app/api/v1/paymob-flash/health

# 2. إنشاء Intention
curl -X POST https://sallim-be.vercel.app/api/v1/paymob-flash/create-intention \
  -H "Content-Type: application/json" \
  -d '{
    "cardId": "test_card_001",
    "productName": "بطاقة اختبار",
    "customerName": "أحمد محمد",
    "customerPhone": "+201234567890",
    "customerEmail": "test@example.com",
    "amount": 10,
    "currency": "EGP",
    "sessionId": "test-session-001"
  }'

# 3. فحص Status
sleep 5
curl https://sallim-be.vercel.app/api/v1/paymob-flash/status/test-session-001
```

### اختبار Flow كامل للشركات
```bash
# 1. إنشاء Company Intention
curl -X POST https://sallim-be.vercel.app/api/v1/company-checkout/initiate \
  -H "Content-Type: application/json" \
  -d '{
    "packageKey": "starter",
    "companyName": "شركة الاختبار",
    "companyEmail": "test-company@example.com",
    "companyPhone": "+201234567890"
  }'

# 2. فحص Status
sleep 5
curl "https://sallim-be.vercel.app/api/v1/company-checkout/status?merchantOrderId=co-starter-123"
```

---

## 🐛 أوامر Debug

### 1. فحص Environment Variables
```bash
# في server
cd server
node -e "console.log('CLIENT_URL:', process.env.CLIENT_URL); console.log('BACKEND_URL:', process.env.BACKEND_URL)"
```

### 2. فحص Database Connection
```bash
# في server
cd server
node -e "import('./config/db.js').then(db => console.log('DB Connected:', !!db.connection.readyState))"
```

### 3. فحص Paymob Configuration
```bash
curl https://sallim-be.vercel.app/api/v1/paymob-flash/health
```

---

## 🔧 أوامر Fix

### 1. إصلاح Port إذا مشغول
```bash
# على Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# على Linux/Mac
lsof -ti:3001 | xargs kill -9
```

### 2. مسح Cache
```bash
# مسح node_modules
rm -rf node_modules package-lock.json
npm install

# مسح cache Vercel
vercel rm --yes
```

### 3. إعادة تعيين Environment Variables
```bash
# في Vercel Dashboard
Settings → Environment Variables
# حذف القديم
# إضافة الجديد
# Redeploy
```

---

## 📱 أوامر اختبار على Mobile

### اختبار على iOS (Safari)
1. افتح Safari
2. اذهب إلى `https://www.sallim.co`
3. اشرِ بطاقة
4. ادفع
5. تحقق من redirect

### اختبار على Android (Chrome)
1. افتح Chrome
2. اذهب إلى `https://www.sallim.co`
3. اشرِ بطاقة
4. ادفع
5. تحقق من redirect

---

## ✅ قائمة التحقق النهائية

قبل إطلاق الإنتاج، تأكد من:

- [ ] Backend Health check ينجح
- [ ] CORS مُعدل بشكل صحيح
- [ ] Payment Methods API يعمل
- [ ] Redirect URLs تستخدم CLIENT_URL
- [ ] Email links تستخدم CLIENT_URL
- [ ] Webhook URL يستخدم BACKEND_URL
- [ ] Logs تظهر بدون أخطاء
- [ ] اختبار على iOS ناجح
- [ ] اختبار على Android ناجح
- [ ] اختبار على Desktop ناجح

---

## 🚨 أوامر الطوارئ

### إذا كان الدفع لا يعمل
```bash
# 1. فحص Health
curl https://sallim-be.vercel.app/api/v1/paymob-flash/health

# 2. فحص Logs
vercel logs sallim-be --follow

# 3. Redeploy
vercel --prod
```

### إذا كان Redirect لا يعمل
```bash
# 1. فحص CLIENT_URL
curl https://sallim-be.vercel.app/api/v1/paymob-flash/health

# 2. فحص Paymob Redirect URL
# في Paymob Dashboard → Settings → Integration

# 3. Redeploy
vercel --prod
```

### إذا كان الإيميل لا يُرسل
```bash
# 1. فحص Email Configuration
# في server/.env

# 2. اختبار الإيميل
node server/test-email.js

# 3. فحص Logs
grep "Email" server.log
```

---

**جميع الأوامر جاهزة للاستخدام! 🚀**