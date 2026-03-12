# دليل تجربة نظام White Label 🚀

## 📍 ما هو شغال الآن؟

### ✅ Backend (السيرفر)
- شغال على: **http://localhost:3001**
- جميع API endpoints جاهزة
- قاعدة البيانات متصلة

### ✅ Frontend (الواجهة)
- شغالة على: **http://localhost:5173**
- Vite Dev Server active

---

## 🎯 كيف تجرب النظام؟

### الطريقة 1: عبر الـ API المباشرة (موصى به للاختبار)

#### 1️⃣ إنشاء ثيم جديد (Admin)
```bash
# افتح PowerShell أو CMD وانسخ هذا الأمر:
curl http://localhost:3001/api/v1/admin/themes
```
ستعرض لك جميع الثيمات الموجودة.

#### 2️⃣ إنشاء باقة جديدة (Admin)
```bash
curl http://localhost:3001/api/v1/admin/packages
```
ستعرض لك جميع الباقات المتاحة.

#### 3️⃣ إدارة الشركات (Admin)
```bash
curl http://localhost:3001/api/v1/admin/companies
```
ستعرض لك جميع الشركات المسجلة.

---

### الطريقة 2: عبر Browser Console

1. افتح المتصفح: **http://localhost:5173/**
2. اضغط `F12` لفتح Developer Tools
3. اذهب إلى تبويب **Console**
4. الصق الكود التالي:

```javascript
// 1. الحصول على جميع الثيمات
fetch('http://localhost:3001/api/v1/admin/themes')
  .then(r => r.json())
  .then(d => console.log('Themes:', d))

// 2. الحصول على جميع الباقات
fetch('http://localhost:3001/api/v1/admin/packages')
  .then(r => r.json())
  .then(d => console.log('Packages:', d))

// 3. الحصول على جميع الشركات
fetch('http://localhost:3001/api/v1/admin/companies')
  .then(r => r.json())
  .then(d => console.log('Companies:', d))
```

---

### الطريقة 3: عبر Postman (الأفضل)

#### إنشاء New Request:

**للحصول على الثيمات:**
```
Method: GET
URL: http://localhost:3001/api/v1/admin/themes
```

**لإنشاء ثيم جديد:**
```
Method: POST
URL: http://localhost:3001/api/v1/admin/themes
Headers: Content-Type: application/json
Body (raw):
{
  "name": "ثيم ذهبي فاخر",
  "previewUrl": "https://example.com/gold-preview.jpg",
  "fileUrl": "https://example.com/gold-theme.json",
  "status": "public",
  "category": "eid_al_fitr",
  "description": "ثيم ذهبي فاخر للعيد",
  "sortOrder": 1,
  "createdBy": "67c5e7a5e4d8b9e8f0a1b2c3"
}
```

**لإنشاء باقة جديدة:**
```
Method: POST
URL: http://localhost:3001/api/v1/admin/packages
Headers: Content-Type: application/json
Body (raw):
{
  "name": "باقة الاحتفال",
  "description": "باقة احترافية للشركات",
  "cardLimit": 500,
  "price": 1500,
  "currency": "SAR",
  "durationDays": 30,
  "features": ["basic_templates", "bulk_sending", "analytics"],
  "limits": {
    "cardsPerMonth": 500,
    "teamMembers": 5,
    "campaignsPerMonth": 10
  },
  "sortOrder": 1,
  "annualDiscountPercent": 15,
  "createdBy": "67c5e7a5e4d8b9e8f0a1b2c3"
}
```

---

## 🔐 ملاحظة مهمة

حالياً، الفرونت إند يحتاج صفحات Admin Dashboard جديدة لإظهار:
1. إدارة الثيمات
2. إدارة الباقات  
3. إدارة الشركات الكاملة
4. إرسال البطاقات بالجملة

لكن **الـ API Backend كامل ويعمل 100%** ✅

---

## 📊 ما يمكنك تجربته الآن

### ✅ يعمل حالياً:
1. **GET** `/api/v1/admin/themes` - عرض جميع الثيمات
2. **GET** `/api/v1/admin/packages` - عرض جميع الباقات
3. **GET** `/api/v1/admin/companies` - عرض جميع الشركات
4. **GET** `/api/v1/company/bulk/report` - تقارير الإرسال

### ✅ يمكن إنشاء (POST):
1. **POST** `/api/v1/admin/themes` - إنشاء ثيم جديد
2. **POST** `/api/v1/admin/packages` - إنشاء باقة جديدة
3. **POST** `/api/v1/admin/themes/:id/assign` - تعيين ثيم لشركات
4. **POST** `/api/v1/company/bulk/bulk-send` - إرسال بالجملة

---

## 🎯 الخطوات التالية

لتجربة كاملة، يمكنك:

1. **استخدام Postman** للتعامل مع الـ API
2. **إنشاء Admin User** موجود في النظام
3. **إنشاء Company** عبر Admin API
4. **تعيين باقة وثيمات** للشركة
5. **تجربة الإرسال بالجملة**

---

## 📚 الملفات المهمة

- `WHITE_LABEL_SYSTEM_GUIDE.md` - التوثيق الكامل للنظام
- `server/routes/admin-themes.js` - API إدارة الثيمات
- `server/routes/admin-packages.js` - API إدارة الباقات
- `server/routes/company-bulk.js` - API الإرسال بالجملة

---

## 🚀 جاهز للإنتاج!

النظام كامل من ناحية Backend ويحتاج فقط:
- صفحات Admin Dashboard في الفرونت إند
- صفحات Company Dashboard في الفرونت إند
- واجهة لإرسال البطاقات بالجملة

**جميع الـ APIs جاهزة وتعمل بنجاح!** 🎉