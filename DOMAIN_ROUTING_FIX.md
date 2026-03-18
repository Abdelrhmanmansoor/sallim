# إصلاح مشكلة Domain Routing - منصة سلّم

## 📅 تاريخ التحديث: 18 مارس 2026

---

## 🚨 المشكلة

عند تشغيل:
```bash
curl https://sallim-be.vercel.app/api/v1/paymob-flash/health
```

النتيجة هي HTML من Frontend بدلاً من JSON من Backend!

---

## 🔍 التشخيص

المشكلة: `sallim-be.vercel.app` يتم توجيهه إلى Frontend (`www.sallim.co`)

هذا يعني:
- Backend و Frontend على نفس Vercel Project
- أو Domain routing غير مُعدل بشكل صحيح

---

## ✅ الحلول الممكنة

### الحل 1: فصل Backend و Frontend في Projects مختلفة (موصى به)

#### 1. إنشاء Project جديد للـ Backend في Vercel
```
1. اذهب إلى https://vercel.com/dashboard
2. اضغط "Add New Project"
3. اربط GitHub repo
4. اختر مجلد `server/` فقط
5. اسم الـ Project: `sallim-backend`
6. Deploy
```

#### 2. الحصول على Backend URL الجديد
بعد Deploy، سيكون رابط مثل:
```
https://sallim-backend.vercel.app
```

#### 3. تحديث Environment Variables في Backend
```env
# في Vercel Dashboard → sallim-backend → Settings → Environment Variables
CLIENT_URL=https://www.sallim.co
BACKEND_URL=https://sallim-backend.vercel.app
```

#### 4. تحديث Paymob Webhook URL
```
https://sallim-backend.vercel.app/api/v1/paymob-flash/callback
```

#### 5. تحديث Frontend Environment Variables
```env
# في .env في Frontend أو Vercel Dashboard
VITE_API_URL=https://sallim-backend.vercel.app
```

---

### الحل 2: إصلاح Routing في نفس Project (أسرع ولكن أقل موثوقية)

#### 1. إنشاء `vercel.json` في مجلد `server/`
```json
{
  "name": "sallim-backend",
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/index.js"
    },
    {
      "src": "/(.*)",
      "status": 404
    }
  ]
}
```

#### 2. Redeploy Backend

---

### الحل 3: استخدام Custom Domain للـ Backend

#### 1. شراء Domain للـ Backend
```
api.sallim.co
```

#### 2. إضافته في Vercel
```
1. اذهب إلى Project Settings → Domains
2. أضف: api.sallim.co
3. اضبط DNS كما يطلب Vercel
```

#### 3. تحديث URLs
```env
BACKEND_URL=https://api.sallim.co
```

---

## 🎯 الحل الموصى به

استخدم **الحل 1** (فصل Projects) لأنه:
- ✅ أكثر استقراراً
- ✅ أسهل في الصيانة
- ✅ لا يوجد routing conflicts
- ✅ أفضل performance

---

## 📋 خطوات التنفيذ (الحل 1)

### الخطوة 1: إنشاء Backend Project جديد
```
1. Vercel Dashboard → Add New Project
2. اربط GitHub repo: sallim
3. Root Directory: server
4. اسم Project: sallim-backend
5. Deploy
```

### الخطوة 2: تحديث Environment Variables
```
في Vercel → sallim-backend → Settings → Environment Variables:

CLIENT_URL=https://www.sallim.co
BACKEND_URL=https://sallim-backend.vercel.app
PAYMOB_MODE=live
```

### الخطوة 3: تحديث Paymob
```
Paymob Dashboard → Settings → Integration → Webhook URL:

https://sallim-backend.vercel.app/api/v1/paymob-flash/callback
```

### الخطوة 4: تحديث Frontend
```
في .env أو Vercel → Frontend Project:

VITE_API_URL=https://sallim-backend.vercel.app
```

### الخطوة 5: Redeploy كل شيء
```
1. Redeploy sallim-backend
2. Redeploy sallim (Frontend)
```

---

## ✅ التحقق من الإصلاح

بعد التنفيذ، اختبر:

```bash
curl https://sallim-backend.vercel.app/api/v1/paymob-flash/health
```

يجب أن تُرجع JSON مثل:
```json
{
  "success": true,
  "mode": "live",
  "clientUrl": "https://www.sallim.co",
  "backendUrl": "https://sallim-backend.vercel.app"
}
```

---

## 🔧 إذا فشل الحل 1

### جرب الحل 2 (إصلاح Routing)
1. أنشئ `server/vercel.json` (كما في الحل 2)
2. Push إلى GitHub
3. Redeploy

### إذا فشل الحل 2 أيضاً
جرب الحل 3 (Custom Domain) أو استخدام Render أو Railway للـ Backend.

---

## 📝 ملاحظات مهمة

1. **لا تستخدم نفس Vercel Project** للـ Frontend و Backend
2. **افصل Projects** لاستقرار أفضل
3. **استخدم Domain منفصل** للـ Backend إن أمكن
4. **اختبر كل شيء** بعد Redeploy

---

**المشكلة واضحة: Backend URL يُوجه إلى Frontend. استخدم الحل 1 (فصل Projects) للتغلب عليها. 🔧**