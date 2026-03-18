# خطوات اختبار بوابة الدفع Paymob Flash

## 1️⃣ تأكد من بيانات الاختبار في ملف البيئة

افتح الملف: `server/.env`

تأكد من وجود:
```env
PAYMOB_SECRET_KEY=YOUR_PAYMOB_SECRET_KEY
PAYMOB_PUBLIC_KEY=egy_pk_test_YOUR_PUBLIC_KEY
PAYMOB_INTEGRATION_ID=YOUR_INTEGRATION_ID
PAYMOB_MODE=test
PAYMOB_HMAC_SECRET=YOUR_HMAC_SECRET

CLIENT_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
```

---

## 2️⃣ شغّل الباك إند (السيرفر)

افتح Terminal جديد وشغّل:

```bash
cd server
npm run dev
```

**انتظر حتى تظهر الرسالة:**
```
MongoDB connected
Sallim API running on port 3001
```

---

## 3️⃣ شغّل الواجهة (Frontend)

افتح Terminal آخر (جديد) وشغّل:

```bash
npm run dev
```

**انتظر حتى تظهر:**
```
VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 4️⃣ افتح صفحة الدفع

في المتصفح، اذهب إلى:
```
http://localhost:5173/checkout?cardId=test_card_123&price=50
```

أو للتجربة السريعة:
```
http://localhost:5173/paymob-test
```

---

## 5️⃣ املأ بيانات الدفع

في صفحة الدفع، أدخل:

- **الاسم الكامل:** أحمد علي
- **رقم الهاتف:** +201234567890
- **البريد الإلكتروني:** test@example.com

اضغط زر: **متابعة للمراجعة**

---

## 6️⃣ اضغط "ادفع بالبطاقة"

بعد المراجعة، اضغط زر: **ادفع بالبطاقة**

سيتم:
1. إنشاء Payment Intention في Paymob
2. تحويلك تلقائيًا لصفحة الدفع (Unified Checkout)

---

## 7️⃣ أدخل بيانات البطاقة الاختبارية

في صفحة Paymob، استخدم بطاقة الاختبار:

### ✅ للنجاح:
```
رقم البطاقة: 4987654321098769
CVV: 123
تاريخ الانتهاء: 12/25
```

### ❌ لفشل (اختياري):
```
رقم البطاقة: 4000000000000002
CVV: 123
تاريخ الانتهاء: 12/25
```

---

## 8️⃣ أكمل الدفع

اضغط "Pay" أو "ادفع" في صفحة Paymob

---

## 9️⃣ تحقق من النتيجة

بعد الدفع، سيتم تحويلك إلى:
```
http://localhost:5173/payment-result
```

**ستظهر لك:**
- ✅ رسالة نجاح (إذا استخدمت بطاقة النجاح)
- ❌ رسالة فشل (إذا استخدمت بطاقة الفشل)
- ⏳ قيد المعالجة (في بعض الحالات)

---

## 🔟 تحقق من السيرفر (Backend)

في terminal السيرفر، ستجد رسائل مثل:

```
[Paymob Flash] Creating intention for: {...}
[Paymob Flash] Intention created: {...}
[Paymob Flash] Callback received: {...}
```

---

## ✅ الاختبار نجح إذا:

1. ✅ زر "ادفع بالبطاقة" يعمل
2. ✅ تم التحويل لصفحة Paymob
3. ✅ بعد الدفع، تم التحويل لصفحة النتيجة
4. ✅ ظهرت رسالة نجاح/فشل/معالجة

---

## ⚠️ إذا حدثت مشاكل:

### المشكلة: زر "ادفع بالبطاقة" لا يعمل
- افتح Console في المتصفح (F12)
- ابحث عن رسائل الخطأ باللون الأحمر
- تأكد من أن السيرفر يعمل على `localhost:3001`

### المشكلة: "Failed to fetch"
- تأكد أن Backend شغال
- تأكد من `BACKEND_URL=http://localhost:3001` في `.env`

### المشكلة: "Looks like the secret key is invalid"
- راجع `PAYMOB_SECRET_KEY` في `server/.env`
- تأكد أنه قيمة Secret Key الخاصة بوضع الاختبار (Test) من Paymob

---

## 🚀 للانتقال إلى الإنتاج (Production):

1. غيّر في `server/.env`:
```env
PAYMOB_MODE=live
PAYMOB_SECRET_KEY=YOUR_PAYMOB_LIVE_SECRET_KEY
PAYMOB_PUBLIC_KEY=egy_pk_live_XXXXXXX
PAYMOB_INTEGRATION_ID=XXXXXX
```

2. غيّر URLs:
```env
CLIENT_URL=https://yoursite.com
BACKEND_URL=https://api.yoursite.com
```

3. أعد تشغيل السيرفر

---

## 📞 للدعم:

إذا استمرت المشاكل، أرسل لي:
1. رسائل الخطأ من Console المتصفح (F12)
2. رسائل الخطأ من terminal السيرفر
3. لقطة شاشة للمشكلة
