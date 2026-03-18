# 🚀 دليل الربط والاختبار السريع

## ✅ الخطوة 1: أضف بياناتك (2 دقيقة)

افتح ملف `server/.env` وضع بياناتك:

```bash
# مفاتيح Paymob من لوحة التحكم
PAYMOB_API_KEY=ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5...  # ضع API Key الخاص بك
PAYMOB_SECRET_KEY=...  # ضع Secret Key الخاص بك
PAYMOB_PUBLIC_KEY=...  # ضع Public Key الخاص بك
PAYMOB_HMAC_SECRET=... # ضع HMAC الخاص بك

# للاختبار - اترك هذه كما هي
PAYMOB_INTEGRATION_ID=5577534
PAYMOB_MODE=test

# URLs - اتركهم كما هم للاختبار المحلي
BACKEND_URL=http://localhost:3001
CLIENT_URL=http://localhost:5173  # موجود بالفعل
```

### ⚠️ مهم جداً:
- **للاختبار الأول**: استخدم `PAYMOB_MODE=test` و `PAYMOB_INTEGRATION_ID=5577534`
- **بعد نجاح الاختبار**: غيّر إلى `PAYMOB_MODE=live` واستخدم Integration ID الحقيقي

---

## ✅ الخطوة 2: شغّل السيرفر (1 دقيقة)

```bash
# في terminal
cd server
npm install  # لو أول مرة
npm run dev
```

يجب أن ترى:
```
✅ MongoDB connected
🚀 Server running on port 3001
```

---

## ✅ الخطوة 3: اختبر التكامل (1 دقيقة)

### في terminal جديد:
```bash
cd server
node test_paymob_flash.js
```

### النتيجة المتوقعة:

```
═══════════════════════════════════════════
  Paymob Flash Integration - Test Suite
═══════════════════════════════════════════

📋 Test 1: Health Check
✅ Health check passed
   Mode: test

📋 Test 2: Create Payment Intention
✅ Payment intention created successfully
   Intention ID: int_xxxxxxxxx
   Payment URL: https://accept.paymob.com/checkout/...

📋 Test 3: Check Payment Status
✅ Payment status retrieved successfully

═══════════════════════════════════════════
✅ Passed: 3
❌ Failed: 0
🎉 All tests passed!
```

---

## ✅ الخطوة 4: اختبر الدفع الكامل (5 دقائق)

### 1. شغّل الواجهة:
```bash
# في terminal جديد
cd ..
npm run dev
```

### 2. افتح المتصفح:
```
http://localhost:5173
```

### 3. اختبر الدفع:

**طريقة 1: في الكود مباشرة**

افتح أي صفحة واضف هذا الزر للاختبار:

```jsx
import { PaymobFlashButton } from './components/PaymobFlash'

function TestPayment() {
  return (
    <div style={{ padding: 20 }}>
      <h2>اختبار الدفع</h2>
      <PaymobFlashButton
        cardId="test_card_123"
        amount={10.00}
        currency="EGP"
        customerName="أحمد علي"
        customerEmail="test@example.com"
        customerPhone="+201234567890"
        onSuccess={(res) => console.log('نجح!', res)}
        onError={(err) => console.log('فشل!', err)}
      />
    </div>
  )
}
```

### 4. بطاقات الاختبار:

**للدفع الناجح:**
```
رقم البطاقة: 4987654321098769
CVV: 123
تاريخ الانتهاء: 12/25
الاسم: Test User
```

**للدفع الفاشل:**
```
رقم البطاقة: 4000000000000002
CVV: 123
تاريخ الانتهاء: 12/25
```

---

## 🔍 استكشاف الأخطاء

### المشكلة: "API key not configured"
**الحل**: تأكد من نسخ API Key كامل في ملف `.env`

### المشكلة: "Invalid signature" أو HMAC error
**الحل**: تأكد من نسخ HMAC Secret بشكل صحيح

### المشكلة: لا يظهر رابط الدفع
**الحل**: 
1. تأكد من `PAYMOB_MODE=test`
2. تأكد من `PAYMOB_INTEGRATION_ID=5577534`
3. شوف logs في السيرفر

### المشكلة: الـ callback لا يعمل
**الحل**: هذا طبيعي في localhost - سيعمل عند النشر على سيرفر حقيقي

---

## 📊 التحقق من كل شيء يعمل

### ✅ Checklist:

- [ ] السيرفر شغال على port 3001
- [ ] الواجهة شغالة على port 5173
- [ ] test_paymob_flash.js نجح (3/3 tests)
- [ ] زر الدفع يظهر
- [ ] عند الضغط يتم التوجيه لصفحة Paymob
- [ ] بطاقة الاختبار تعمل
- [ ] يتم التوجيه للنتيجة

---

## 🎯 بعد نجاح الاختبار

### للانتقال للوضع الحقيقي (Live):

1. **احصل على Integration ID الحقيقي**:
   - Dashboard → Developers → Integrations
   - انسخ Integration ID

2. **عدّل `.env`**:
   ```bash
   PAYMOB_INTEGRATION_ID=your_real_integration_id
   PAYMOB_MODE=live
   ```

3. **أعد تشغيل السيرفر**

4. **اختبر ببطاقة حقيقية** (ستخصم فعلياً!)

---

## 🆘 تحتاج مساعدة؟

### إذا ظهرت مشاكل:

1. **شوف logs السيرفر**: اضغط Ctrl+C وشغله مرة ثانية بـ `npm run dev`
2. **شوف console المتصفح**: اضغط F12 → Console
3. **شوف ملف الاختبار**: `node test_paymob_flash.js`

### معلومات إضافية:
- **التوثيق الشامل**: `PAYMOB_FLASH_INTEGRATION.md`
- **بالعربي**: `PAYMOB_FINAL_SUMMARY_AR.md`
- **أمثلة**: `PAYMOB_DEVELOPER_REFERENCE.js`

---

## 📞 دعم Paymob

إذا كانت المشكلة من Paymob نفسه:
- **Email**: support@paymob.com
- **Dashboard**: https://accept.paymob.com
- **Docs**: https://developers.paymob.com

---

**✅ الآن أنت جاهز! ابدأ من الخطوة 1 واتبع الترتيب** 🚀

---

Created: 17 Mar 2024
Status: Ready for Testing
