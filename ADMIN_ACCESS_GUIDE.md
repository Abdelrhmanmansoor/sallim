# 📋 دليل الوصول إلى لوحة تحكم الأدمن
## سَلِّم Enterprise System

---

## 🎯 كيفية الدخول للوحة تحكم الأدمن

### الطريقة الأولى: عبر صفحة الشركات

1. **من القائمة العلوية (Navbar)**
   - اضغط على زر **"الشركات"** في القائمة الرئيسية
   - سيتم توجيهك إلى صفحة `/companies`

2. **في صفحة الشركات**
   - إذا كنت مسجلاً دخولك كـ `admin` (مسؤول النظام)
   - ستجد زر **"الدخول للوحة التحكم"** بارز بألوان ذهبية
   - اضغط عليه للانتقال مباشرة إلى `/admin/dashboard`

---

### الطريقة الثانية: عبر الرابط المباشر

1. **الرابط المباشر**
   - افتح المتصفح واذهب إلى:
   ```
   http://localhost:5173/admin/dashboard
   ```
   أو في الإنتاج:
   ```
   https://your-domain.com/admin/dashboard
   ```

2. **التحقق من الصلاحيات**
   - النظام سيتحقق تلقائياً من:
     - وجود توكن (token) في localStorage
     - دور المستخدم (role) يجب أن يكون `admin`
   - إذا لم تكن مسجلاً أو لم تكن admin:
     - سيتم توجيهك إلى صفحة تسجيل الدخول `/login`

---

## 🔐 كيفية إنشاء حساب Admin

### الطريقة 1: عبر MongoDB Compass أو Shell

```javascript
// 1. افتح MongoDB Shell أو Compass
// 2. اختر قاعدة البيانات (sallim-db)
// 3. اذهب إلى مجموعة (collection) users
// 4. أنشئ مستخدم جديد:

{
  "name": "Admin User",
  "email": "admin@sallim.co",
  "password": "$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // يجب أن يكون مشفر
  "role": "admin",
  "avatar": "",
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

### الطريقة 2: عبر API (مباشرة)

```bash
# 1. إنشاء Admin عبر POST request
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@sallim.co",
    "password": "YourStrongPassword123!"
  }'

# 2. تحديث دور المستخدم إلى admin عبر MongoDB
# (لأن التسجيل العادي يعطي role = 'user' افتراضياً)
```

### الطريقة 3: سكريبت إنشاء Admin (أنشئ ملف جديد في server/scripts/)

```javascript
// server/scripts/create-admin.js
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import dotenv from 'dotenv'

dotenv.config()

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@sallim.co' })
    if (existingAdmin) {
      console.log('⚠️  Admin already exists!')
      process.exit(0)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('YourStrongPassword123!', 12)

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@sallim.co',
      password: hashedPassword,
      role: 'admin',
      avatar: '',
    })

    console.log('✅ Admin created successfully!')
    console.log('Email:', admin.email)
    console.log('Role:', admin.role)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error creating admin:', error)
    process.exit(1)
  }
}

createAdmin()
```

**لتشغيل السكريبت:**
```bash
cd server
node scripts/create-admin.js
```

---

## 🔑 خطوات الدخول الكاملة

### 1. فتح صفحة تسجيل الدخول
```
http://localhost:5173/login
```

### 2. إدخال بيانات الأدمن
- **البريد الإلكتروني**: `admin@sallim.co`
- **كلمة المرور**: `YourStrongPassword123!`

### 3. بعد تسجيل الدخول
- سيتم حفظ الـ token في `localStorage`
- سيتم حفظ بيانات المستخدم في `localStorage`
- ستتلقى رسالة نجاح

### 4. الذهاب للوحة التحكم
- **الطريقة السريعة**: اضغط "الشركات" ثم "الدخول للوحة التحكم"
- **الطريقة المباشرة**: اذهب إلى `/admin/dashboard`

---

## 🛡️ الأمان والصلاحيات

### ما يمكن للأدمن فعله:
1. ✅ توليد أكواد الاشتراك للشركات
2. ✅ إدارة الشركات المسجلة
3. ✅ تفعيل/إلغاء الميزات (Feature Flags)
4. ✅ إضافة رصيد لمحفظات الشركات
5. ✅ مراقبة سجل النشاطات (Audit Logs)
6. ✅ إدارة تذاكر الدعم الفني
7. ✅ عرض التحليلات والإحصائيات

### الصلاحيات في الكود:

**في AdminDashboardPage.jsx:**
```javascript
useEffect(() => {
  const userData = localStorage.getItem('user')
  if (!userData || JSON.parse(userData).role !== 'admin') {
    navigate('/login')  // إعادة توجيه لصفحة الدخول
    return
  }
  setUser(JSON.parse(userData))
  loadStats()
}, [])
```

**في الـ APIs (Backend):**
```javascript
// في server/routes/admin-companies.js مثلاً
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  // authenticateToken: يتحقق من صحة token
  // isAdmin: يتحقق من role === 'admin'
})
```

---

## 🚨 مشاكل شائعة وحلولها

### مشكلة: "تم إعادة التوجيه إلى صفحة تسجيل الدخول"

**الأسباب المحتملة:**
1. ❌ لم تقم بتسجيل الدخول
2. ❌ token منتهي الصلاحية
3. ❌ دور المستخدم ليس `admin`

**الحل:**
1. تأكد من تسجيل الدخول
2. تأكد من أن role في MongoDB = 'admin'
3. امسح localStorage وادخل مجدداً:
   ```javascript
   // في Console المتصفح
   localStorage.clear()
   location.reload()
   ```

### مشكلة: "لا أجد زر الدخول للوحة التحكم"

**الأسباب:**
1. ❌ لست مسجلاً كـ admin
2. ❌ بيانات المستخدم في localStorage غير صحيحة

**الحل:**
1. تحقق من localStorage:
   ```javascript
   // في Console المتصفح
   console.log(JSON.parse(localStorage.getItem('user')))
   // يجب أن يحتوي على: { role: 'admin', ... }
   ```

### مشكلة: "خطأ 403 Forbidden"

**الأسباب:**
1. ❌ الصلاحيات غير كافية في Backend
2. ❌ Middleware `isAdmin` يمنع الوصول

**الحل:**
1. تأكد من أن `role = 'admin'` في MongoDB
2. تأكد من وجود Middleware الصحيح في الـ routes

---

## 📱 اختبار الوصول

### اختبار سريع (في Console المتصفح):

```javascript
// 1. تحقق من وجود token
const token = localStorage.getItem('token')
console.log('Token:', token ? '✅ موجود' : '❌ غير موجود')

// 2. تحقق من بيانات المستخدم
const user = JSON.parse(localStorage.getItem('user'))
console.log('User:', user)
console.log('Role:', user?.role) // يجب أن يكون 'admin'

// 3. الذهاب للوحة التحكم
if (user?.role === 'admin') {
  window.location.href = '/admin/dashboard'
} else {
  alert('❌ أنت لست admin!')
}
```

---

## 🎨 واجهة لوحة التحكم

### المكونات الرئيسية:

1. **Sidebar (القائمة الجانبية)**
   - الرئيسية `/admin/dashboard`
   - إدارة الشركات `/admin/companies`
   - أكواد الاشتراك `/admin/invite-codes`
   - المحفظات `/admin/wallets`
   - الدعم الفني `/admin/support`
   - سجل المراقبة `/admin/audit-logs`

2. **Top Bar (الشريط العلوي)**
   - عنوان الصفحة
   - اسم المستخدم
   - زر القائمة (موبايل)

3. **Dashboard Cards**
   - إجمالي الشركات
   - الشركات النشطة
   - أكواد الاشتراك
   - الكودات المفعلة

4. **Quick Actions (إجراءات سريعة)**
   - توليد كود اشتراك
   - إضافة شركة
   - سجل المراقبة

---

## 🔄 التطوير المستقبلي

### صفحات إضافية يمكن إضافتها:

1. `/admin/companies` - إدارة الشركات الكاملة
2. `/admin/invite-codes` - توليد وإدارة الأكواد
3. `/admin/wallets` - إدارة المحفظات
4. `/admin/support` - الدعم الفني
5. `/admin/audit-logs` - سجل المراقبة

### كل صفحة تحتاج:
- ✅ Authentication (JWT)
- ✅ Authorization (Admin only)
- ✅ Loading states
- ✅ Error handling
- ✅ Pagination
- ✅ Search & Filters

---

## 📞 الدعم

إذا واجهت أي مشكلة:
1. تحقق من Console المتصفح للأخطاء
2. تحقق من Network tab للـ API calls
3. راجع `server/index.js` للتأكد من تسجيل routes
4. راجع MongoDB للتحقق من البيانات

---

## ✅ ملخص سريع

| الخطوة | الإجراء |
|--------|---------|
| 1 | إنشاء حساب admin في MongoDB |
| 2 | تسجيل الدخول في `/login` |
| 3 | الذهاب إلى `/companies` |
| 4 | الضغط على "الدخول للوحة التحكم" |
| 5 | أو الذهاب مباشرة إلى `/admin/dashboard` |

---

🎉 **مبارك! أنت الآن جاهز لاستخدام لوحة تحكم الأدمن!**