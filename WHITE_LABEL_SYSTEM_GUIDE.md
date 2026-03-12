# دليل نظام White Label لمنصة سَلِّم
## Sallim White Label System Guide

---

## 📋 نظرة عامة

تم تطبيق نظام White Label كامل لمنصة سَلِّم، مما يسمح بإدارة شركات متعددة مع صلاحيات منفصلة لـ Admin والشركات.

---

## 🎯 المستويات والصلاحيات

### 🔴 Admin (سَلِّم)
صلاحيات كاملة على النظام:
- إدارة الشركات (إنشاء، تعديل، حذف، تفعيل/تعطيل)
- إدارة الثيمات (رفع، تعديل، حذف، تعيين للشركات)
- إدارة الباقات والأسعار
- مراقبة جميع البيانات والتقارير
- الوصول إلى سجلات التدقيق (Audit Logs)

### 🔵 Company
صلاحيات محدودة حسب الباقة الممنوحة:
- عرض رصيد البطاقات وتاريخ الاشتراك
- رفع وتعديل لوجو الشركة
- اختيار الثيمات المسموح بها فقط
- إرسال بطاقات بالجملة
- عرض تقارير البطاقات المرسلة من قبلها فقط
- لا ترى بيانات شركات أخرى أو الأسعار

---

## 🗂️ هيكل قاعدة البيانات

### 1. Theme Model (الثيمات)
```javascript
{
  name: String,              // اسم الثيم
  previewUrl: String,        // رابط صورة المعاينة
  fileUrl: String,           // رابط ملف الثيم
  status: String,            // public | exclusive | hidden
  exclusiveCompanies: [],     // الشركات التي تملك هذا الثيم الحصري
  requiredFeature: String,    // الميزة المطلوبة للوصول
  sortOrder: Number,          // ترتيب العرض
  category: String,          // التصنيف
  description: String,        // وصف الثيم
  isActive: Boolean          // نشط/غير نشط
}
```

### 2. Package Model (الباقات)
```javascript
{
  name: String,              // اسم الباقة
  description: String,        // وصف الباقة
  cardLimit: Number,         // عدد البطاقات
  price: Number,             // السعر
  currency: String,          // العملة (SAR)
  durationDays: Number,      // مدة الباقة بالأيام
  features: [],              // الميزات المضمنة
  limits: {},               // حدود الباقة
  isActive: Boolean,        // نشط/غير نشط
  sortOrder: Number,        // ترتيب العرض
  annualDiscountPercent: Number  // خصوص الخصم السنوي
}
```

### 3. Company Model (الشركات) - محدث
```javascript
{
  // الحقول الموجودة مسبقاً...
  
  // White Label: Package reference
  package: ObjectId,         // الباقة المخصصة
  
  // White Label: Allowed themes
  allowedThemeIds: [],       // الثيمات المسموحة
  
  // White Label: Card limits
  cardsLimit: Number,        // حد البطاقات (0 = غير محدود)
  cardsUsed: Number,        // البطاقات المستخدمة
  
  // Subscription expires at
  subscription: {
    expiresAt: Date         // تاريخ انتهاء الاشتراك
  }
}
```

### 4. Card Model (البطاقات) - محدث
```javascript
{
  // الحقول الموجودة مسبقاً...
  
  // White Label: Tracking
  sentAt: Date,              // وقت الإرسال
  openedAt: Date,            // وقت الفتح
  uniqueToken: String,        // رمز فريد للبطاقة
  deliveryStatus: String,     // pending | sent | delivered | opened | failed
  recipientData: {
    phone: String,            // رقم الهاتف
    email: String,            // البريد الإلكتروني
    name: String             // اسم المستلم
  }
}
```

---

## 🛣️ API Endpoints

### إدارة الثيمات (Admin Only)

#### الحصول على جميع الثيمات
```http
GET /api/v1/admin/themes
Query Parameters:
  - status: public | exclusive | hidden (اختياري)
  - category: التصنيف (اختياري)
  - isActive: true | false (اختياري)
  - page: رقم الصفحة (افتراضي 1)
  - limit: عدد النتائج (افتراضي 50)
```

#### إنشاء ثيم جديد
```http
POST /api/v1/admin/themes
Body:
{
  "name": "اسم الثيم",
  "previewUrl": "رابط المعاينة",
  "fileUrl": "رابط الملف",
  "status": "public",        // public | exclusive | hidden
  "category": "general",
  "description": "وصف الثيم",
  "requiredFeature": "feature_name",
  "sortOrder": 0,
  "exclusiveCompanyIds": [],  // للثيمات الحصرية
  "createdBy": "admin_id"
}
```

#### تعديل ثيم
```http
PUT /api/v1/admin/themes/:id
Body:
{
  "name": "اسم جديد",
  "status": "exclusive",
  "isActive": true,
  "updatedBy": "admin_id"
  // أي حقول أخرى يمكن تعديلها
}
```

#### حذف ثيم (Soft Delete)
```http
DELETE /api/v1/admin/themes/:id
Body:
{
  "deletedBy": "admin_id"
}
```

#### تعيين ثيم لشركات (حصري)
```http
POST /api/v1/admin/themes/:id/assign
Body:
{
  "companyIds": ["id1", "id2"],
  "assignedBy": "admin_id"
}
```

#### إزالة ثيم من شركات
```http
POST /api/v1/admin/themes/:id/unassign
Body:
{
  "companyIds": ["id1", "id2"],
  "unassignedBy": "admin_id"
}
```

---

### إدارة الباقات (Admin Only)

#### الحصول على جميع الباقات
```http
GET /api/v1/admin/packages
Query Parameters:
  - isActive: true | false (اختياري)
  - page: رقم الصفحة
  - limit: عدد النتائج
```

#### إنشاء باقة جديدة
```http
POST /api/v1/admin/packages
Body:
{
  "name": "اسم الباقة",
  "description": "وصف الباقة",
  "cardLimit": 100,
  "price": 500,
  "currency": "SAR",
  "durationDays": 30,
  "features": ["basic_templates", "bulk_sending"],
  "limits": {
    "cardsPerMonth": 100,
    "teamMembers": 3,
    "campaignsPerMonth": 5
  },
  "sortOrder": 0,
  "annualDiscountPercent": 10,
  "createdBy": "admin_id"
}
```

#### تعديل باقة
```http
PUT /api/v1/admin/packages/:id
Body: نفس حقول الإنشاء
```

#### حذف باقة
```http
DELETE /api/v1/admin/packages/:id
Body:
{
  "deletedBy": "admin_id"
}
```

#### تطبيق باقة على شركة
```http
POST /api/v1/admin/packages/apply-to-company
Body:
{
  "companyId": "company_id",
  "packageId": "package_id",
  "expiresAt": "2026-12-31",  // اختياري
  "appliedBy": "admin_id"
}
```

---

### إدارة الشركات (Admin Only)

#### الحصول على جميع الشركات
```http
GET /api/v1/admin/companies
Query Parameters:
  - page, limit
  - status: pending | active | suspended
  - plan: basic | pro | enterprise
  - search: نص للبحث
```

#### تفاصيل شركة معينة
```http
GET /api/v1/admin/companies/:id
```

#### تحديث حالة الشركة
```http
PUT /api/v1/admin/companies/:id/status
Body:
{
  "status": "active",
  "updatedBy": "admin_id"
}
```

#### تحديث ميزات الشركة
```http
PUT /api/v1/admin/companies/:id/features
Body:
{
  "features": ["basic_templates", "bulk_sending"],
  "updatedBy": "admin_id"
}
```

#### إضافة رصيد للشركة
```http
POST /api/v1/admin/companies/:id/credits
Body:
{
  "amount": 100,
  "reason": "إضافة رصيد",
  "addedBy": "admin_id"
}
```

#### تحديث اشتراك الشركة
```http
PUT /api/v1/admin/companies/:id/subscription
Body:
{
  "plan": "pro",
  "startDate": "2026-01-01",
  "renewalDate": "2026-12-31",
  "limits": {
    "cardsPerMonth": 500
  },
  "updatedBy": "admin_id"
}
```

#### تحليلات الشركة
```http
GET /api/v1/admin/companies/:id/analytics
Query Parameters:
  - startDate: تاريخ البداية
  - endDate: تاريخ النهاية
```

---

### الإرسال بالجملة (Company)

#### رفع ملف المستلمين
```http
POST /api/v1/company/bulk/upload-recipients
Content-Type: multipart/form-data
Body:
  - file: ملف CSV/Excel

يجب أن يحتوي الملف على:
  - name: اسم المستلم
  - phone: رقم الهاتف (اختياري)
  - email: البريد الإلكتروني (اختياري)
```

#### إرسال بطاقات بالجملة
```http
POST /api/v1/company/bulk/bulk-send
Body:
{
  "companyId": "company_id",
  "recipients": [
    {
      "name": "اسم المستلم",
      "phone": "9665xxxxxxxx",
      "email": "email@example.com"
    }
  ],
  "themeId": "theme_id",
  "templateId": "template_id",
  "message": "نص التهنئة",
  "senderName": "اسم المرسل",
  "sendVia": "whatsapp"  // whatsapp | email
}
```

#### الحصول على تقرير حملة
```http
GET /api/v1/company/bulk/campaign/:id/report?companyId=company_id
```

#### تسجيل فتح البطاقة
```http
POST /api/v1/company/bulk/card/:token/opened
```

#### الحصول على تقارير البطاقات
```http
GET /api/v1/company/bulk/report?companyId=company_id
Query Parameters:
  - status: all | active | deleted | archived
  - deliveryStatus: all | pending | sent | delivered | opened | failed
  - startDate: تاريخ البداية
  - endDate: تاريخ النهاية
  - page, limit
```

#### تصدير التقرير CSV
```http
GET /api/v1/company/bulk/export/csv?companyId=company_id
Query Parameters:
  - campaignId: معرف الحملة (اختياري)
  - startDate, endDate
```

---

## ⚙️ قواعد النظام الصارمة

### 1. عزل البيانات
- الشركة لا تصل لأي بيانات إلا بياناتها هي
- كل طلب API يتم التحقق من companyId
- التقارير تعرض فقط بيانات الشركة نفسها

### 2. التحكم في الثيمات
- الشركة لا تختار ثيم لم يُسمح لها به Admin
- الثيمات العامة متاحة للجميع
- الثيمات الحصرية متاحة للشركات المحددة فقط
- الثيمات المخفية لا تظهر لأي شركة

### 3. حدود البطاقات
```javascript
// التحقق قبل الإرسال
if (cardsLimit > 0 && cardsUsed >= cardsLimit) {
  return error('رصيد غير كافٍ')
}
```

### 4. تاريخ الانتهاء
```javascript
// التحقق من صلاحية الاشتراك
if (subscription.expiresAt < new Date()) {
  return error('انتهت صلاحية الاشتراك')
}
```

### 5. العلامة التجارية
- كل بطاقة تحمل "Powered by سَلِّم"
- الشركة لا يمكنها إزالة هذه العلامة
- الشركة يمكنها إضافة لوجوها الخاص

---

## 📊 لوحة المراقبة (Admin Dashboard)

### الإحصائيات العامة
- عدد الشركات النشطة الكلي
- عدد الشركات المعلقة/الموقوفة
- عدد البطاقات المُرسَلة اليوم/هذا الشهر/الإجمالي
- الشركات التي استهلكت رصيدها وتحتاج تجديد

### تفاصيل كل شركة
- المعلومات الأساسية (الاسم، البريد، الحالة)
- الباقة الحالية
- رصيد البطاقات المتبقي
- تاريخ انتهاء الاشتراك
- الثيمات المسموحة
- إحصائيات الإرسال
- تقرير تفصيلي:
  - مين بعت ومين لأ
  - وقت الإرسال
  - عدد المفتوحة
  - نسبة الفتح

---

## 🔄 User Flow

### 1. إنشاء شركة جديدة (Admin)
```
1. Admin ينشئ شركة جديدة
2. يحدد الباقة المناسبة
3. يحدد الثيمات المسموحة
4. يحدد تاريخ انتهاء الاشتراك
5. يرسل بيانات الدخول للشركة
```

### 2. دخول الشركة
```
1. Company تسجل الدخول
2. ترى رصيدها وتاريخ الانتهاء
3. لا ترى أسعار ولا شركات أخرى
```

### 3. إعداد البطاقة
```
1. Company ترفع لوجو الشركة
2. تختار ثيم من القائمة المسموحة
3. تكتب نص التهنئة
4. ترى معاينة مباشرة
```

### 4. الإرسال بالجملة
```
1. Company ترفع ملف CSV/Excel
2. النظام يولّد روابط مخصصة
3. ترسل الروابط عبر واتساب/إيميل
4. شريط تقدم يوضح الإرسال
```

### 5. المتابعة والريبورت
```
1. Admin + Company يتابعون الريبورت
2. جدول: اسم الموظف / تم الإرسال / فتح البطاقة / وقت الفتح
3. تصفية: الكل / تم الفتح / لم يُفتح بعد
4. تصدير PDF أو Excel
```

---

## 🔐 الأمان والتحقق

### التحقق من الصلاحيات
```javascript
// في كل endpoint خاص بالشركة
if (req.companyId !== companyId) {
  return error('غير مصرح بالوصول')
}
```

### التحقق من الثيمات
```javascript
// قبل السماح باستخدام ثيم
if (theme.status === 'exclusive') {
  if (!theme.exclusiveCompanies.includes(companyId)) {
    return error('ليس لديك صلاحية لهذا الثيم')
  }
}
```

### التحقق من الرصيد
```javascript
// قبل الإرسال بالجملة
const cardsAvailable = company.cardsLimit === 0 
  ? Infinity 
  : company.cardsLimit - company.cardsUsed

if (cardsAvailable < recipients.length) {
  return error(`متبقي ${cardsAvailable} بطاقة فقط`)
}
```

---

## 📝 سجلات التدقيق (Audit Logs)

كل عملية مهمة يتم تسجيلها:
- إنشاء/تعديل/حذف شركات
- إنشاء/تعديل/حذف ثيمات
- تعيين ثيمات للشركات
- تطبيق باقات على الشركات
- إضافة رصيد للشركات
- إرسال بطاقات بالجملة

---

## 🚀 التشغيل

### تثبيت الاعتمادات
```bash
cd server
npm install csv-parser
```

### تشغيل السيرفر
```bash
cd server
npm start
# أو للتطوير
npm run dev
```

---

## 📚 ملفات النظام

### النماذج (Models)
- `server/models/Theme.js` - نموذج الثيمات
- `server/models/Package.js` - نموذج الباقات
- `server/models/Company.js` - نموذج الشركات (محدث)
- `server/models/Card.js` - نموذج البطاقات (محدث)

### المسارات (Routes)
- `server/routes/admin-themes.js` - API إدارة الثيمات
- `server/routes/admin-packages.js` - API إدارة الباقات
- `server/routes/admin-companies.js` - API إدارة الشركات
- `server/routes/company-bulk.js` - API الإرسال بالجملة

### السيرفر
- `server/index.js` - تم تسجيل جميع المسارات الجديدة

---

## ✅ الاختبار

### اختبار إنشاء ثيم
```bash
curl -X POST http://localhost:3001/api/v1/admin/themes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ثيم ذهبي",
    "previewUrl": "https://example.com/preview.jpg",
    "fileUrl": "https://example.com/theme.json",
    "status": "public",
    "category": "eid_al_fitr",
    "createdBy": "admin_id"
  }'
```

### اختبار الإرسال بالجملة
```bash
curl -X POST http://localhost:3001/api/v1/company/bulk/bulk-send \
  -H "Content-Type: application/json" \
  -d '{
    "companyId": "company_id",
    "recipients": [
      {"name": "أحمد", "phone": "966500000000"}
    ],
    "themeId": "theme_id",
    "templateId": "template_id",
    "message": "عيدكم مبارك",
    "senderName": "شركة سَلِّم"
  }'
```

---

## 📞 الدعم

للمساعدة والدعم الفني، يرجى الرجوع إلى:
- التوثيق الفني الكامل
- سجلات التدقيق
- فريق التطوير

---

## 🎉 الخلاصة

تم تطبيق نظام White Label كامل مع:
✅ صلاحيات منفصلة لـ Admin والشركات
✅ إدارة كاملة للثيمات (عامة، حصرية، مخفية)
✅ نظام باقات واشتراكات مرن
✅ إرسال بالجملة مع تتبع دقيق
✅ تقارير شاملة قابلة للتصدير
✅ أمان صارم وعزل كامل للبيانات
✅ سجلات تدقيق شاملة

النظام جاهز للاستخدام والإنتاج!