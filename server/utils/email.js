import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@sallim.co'
const ADMIN_EMAIL = 'admin@sallim.co'
const WHATSAPP_NUMBER = '201007835547'
const SITE_URL = process.env.CLIENT_URL || 'https://www.sallim.co'

// ══════════════════════════════════════════
// Shared Layout
// ══════════════════════════════════════════

function emailLayout(content) {
  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
<div dir="rtl" style="max-width:520px;margin:32px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
  <!-- Header -->
  <div style="background:#7c3aed;padding:28px 32px;text-align:center;">
    <div style="font-size:24px;font-weight:bold;color:#ffffff;letter-spacing:1px;">سَلِّم</div>
    <div style="font-size:12px;color:#e9d5ff;margin-top:4px;">منصة بطاقات التهنئة</div>
  </div>
  <!-- Body -->
  <div style="padding:32px;color:#1e293b;line-height:1.8;font-size:15px;">
    ${content}
  </div>
  <!-- Footer -->
  <div style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
    <div style="font-size:13px;color:#94a3b8;">منصة سلّم | <a href="${SITE_URL}" style="color:#7c3aed;text-decoration:none;">sallim.co</a> | <a href="mailto:support@sallim.co" style="color:#7c3aed;text-decoration:none;">support@sallim.co</a></div>
  </div>
</div>
</body>
</html>`
}

function btn(text, url, color = '#7c3aed') {
  return `<div style="text-align:center;margin:28px 0;"><a href="${url}" style="display:inline-block;padding:14px 36px;background:${color};color:#ffffff;text-decoration:none;border-radius:10px;font-size:16px;font-weight:bold;">${text}</a></div>`
}

// ══════════════════════════════════════════
// 1. sendActivationEmail — كود تفعيل للشركة
// ══════════════════════════════════════════

async function sendActivationEmail({ to, companyName, code, packageName, limit }) {
  const html = emailLayout(`
    <h2 style="color:#7c3aed;margin:0 0 16px;font-size:22px;">كود تفعيل حسابك</h2>
    <p>أهلاً <strong>${companyName}</strong>،</p>
    <p>تم إنشاء حسابك المؤسسي في منصة سلّم. باقتك: <strong>${packageName}</strong> — <strong>${limit}</strong> بطاقة.</p>
    <p>استخدم الكود التالي لتفعيل حسابك:</p>
    <div style="background:#f4f4f5;border-radius:12px;padding:24px;text-align:center;margin:24px 0;border:2px dashed #7c3aed40;">
      <div style="font-size:36px;font-weight:900;letter-spacing:6px;color:#7c3aed;font-family:monospace;">${code}</div>
    </div>
    ${btn('فعّل حسابك الآن', `${SITE_URL}/company-activation?code=${encodeURIComponent(code)}`)}
    <p style="font-size:13px;color:#64748b;text-align:center;">⚠️ الكود صالح لمرة واحدة فقط</p>
  `)

  return resend.emails.send({
    from: `سَلِّم <${FROM_EMAIL}>`,
    to,
    subject: 'كود تفعيل حسابك في منصة سلّم',
    html,
  })
}

// ══════════════════════════════════════════
// 2. sendInvoiceEmail — فاتورة
// ══════════════════════════════════════════

async function sendInvoiceEmail({ to, customerName, invoiceNumber, date, items, total, currency = 'SAR' }) {
  const currencyLabel = currency === 'SAR' ? 'ر.س' : currency

  const rows = items.map(item => `
    <tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;font-size:14px;">${item.name}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:center;font-size:14px;">${item.qty}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f1f5f9;text-align:left;font-size:14px;font-weight:700;">${item.price} ${currencyLabel}</td>
    </tr>
  `).join('')

  const html = emailLayout(`
    <h2 style="color:#7c3aed;margin:0 0 16px;font-size:22px;">فاتورتك من منصة سلّم</h2>
    <p>أهلاً <strong>${customerName}</strong>،</p>

    <div style="background:#f8fafc;border-radius:12px;padding:16px 20px;margin:20px 0;">
      <table dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#64748b;">رقم الفاتورة:</td>
          <td style="padding:6px 0;font-weight:700;">#${invoiceNumber}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;font-size:13px;color:#64748b;">التاريخ:</td>
          <td style="padding:6px 0;font-weight:700;">${date}</td>
        </tr>
      </table>
    </div>

    <table dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:20px 0;">
      <thead>
        <tr style="background:#f8fafc;">
          <th style="padding:10px 12px;text-align:right;font-size:13px;color:#64748b;font-weight:600;">الخدمة</th>
          <th style="padding:10px 12px;text-align:center;font-size:13px;color:#64748b;font-weight:600;">الكمية</th>
          <th style="padding:10px 12px;text-align:left;font-size:13px;color:#64748b;font-weight:600;">السعر</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <div style="background:#7c3aed10;border-radius:12px;padding:16px 20px;text-align:center;margin:20px 0;">
      <span style="font-size:14px;color:#64748b;">الإجمالي</span>
      <div style="font-size:28px;font-weight:900;color:#7c3aed;">${total} ${currencyLabel}</div>
    </div>

    <p style="text-align:center;color:#64748b;font-size:14px;">شكراً لثقتك في سلّم 💜</p>
  `)

  return resend.emails.send({
    from: `سَلِّم <${FROM_EMAIL}>`,
    to,
    subject: `فاتورتك من منصة سلّم #${invoiceNumber}`,
    html,
  })
}

// ══════════════════════════════════════════
// 3. sendPackagePurchaseEmail — تأكيد شراء
// ══════════════════════════════════════════

async function sendPackagePurchaseEmail({ to, customerName, packageName, quantity, amount, currency = 'SAR', downloadUrl }) {
  const currencyLabel = currency === 'SAR' ? 'ر.س' : currency

  const html = emailLayout(`
    <h2 style="color:#7c3aed;margin:0 0 16px;font-size:22px;">✅ تم الشراء بنجاح!</h2>
    <p>أهلاً <strong>${customerName}</strong>،</p>
    <p>تم تأكيد شراء باقتك بنجاح. إليك التفاصيل:</p>

    <div style="background:#f8fafc;border-radius:12px;padding:20px;margin:20px 0;">
      <table dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr><td style="padding:8px 0;font-size:14px;color:#64748b;">الباقة:</td><td style="padding:8px 0;font-weight:700;">${packageName}</td></tr>
        <tr><td style="padding:8px 0;font-size:14px;color:#64748b;">عدد البطاقات:</td><td style="padding:8px 0;font-weight:700;">${quantity} بطاقة</td></tr>
        <tr><td style="padding:8px 0;font-size:14px;color:#64748b;">المبلغ:</td><td style="padding:8px 0;font-weight:700;color:#7c3aed;">${amount} ${currencyLabel}</td></tr>
      </table>
    </div>

    ${btn('حمّل بطاقاتك الآن 🎉', downloadUrl, '#10b981')}
    <p style="font-size:13px;color:#ef4444;text-align:center;">⏰ الرابط صالح لمدة 24 ساعة فقط</p>
  `)

  return resend.emails.send({
    from: `سَلِّم <${FROM_EMAIL}>`,
    to,
    subject: `تم الشراء بنجاح — ${packageName}`,
    html,
  })
}

// ══════════════════════════════════════════
// 4. sendCompanyWelcomeEmail — ترحيب بعد التفعيل
// ══════════════════════════════════════════

async function sendCompanyWelcomeEmail({ to, companyName, packageName, limit, dashboardUrl }) {
  const html = emailLayout(`
    <h2 style="color:#7c3aed;margin:0 0 16px;font-size:22px;">مرحباً بك في سلّم للمؤسسات 🎉</h2>
    <p>أهلاً <strong>${companyName}</strong>،</p>
    <p>تم تفعيل حسابك بنجاح! رصيدك الحالي: <strong style="color:#10b981;font-size:20px;">${limit}</strong> بطاقة.</p>

    <h3 style="color:#1e293b;font-size:16px;margin:28px 0 16px;">ابدأ بـ 3 خطوات بسيطة:</h3>

    <div style="margin:0 0 24px;">
      <div style="margin-bottom:14px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="width:32px;height:32px;border-radius:8px;background:#7c3aed;color:#fff;text-align:center;font-weight:900;vertical-align:top;">1</td>
          <td style="padding-right:12px;"><strong>ارفع أسماء الموظفين</strong><br><span style="font-size:13px;color:#64748b;">CSV أو كتابة يدوية</span></td>
        </tr></table>
      </div>
      <div style="margin-bottom:14px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="width:32px;height:32px;border-radius:8px;background:#7c3aed;color:#fff;text-align:center;font-weight:900;vertical-align:top;">2</td>
          <td style="padding-right:12px;"><strong>اختر القالب المناسب</strong><br><span style="font-size:13px;color:#64748b;">عشرات القوالب الجاهزة</span></td>
        </tr></table>
      </div>
      <div>
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="width:32px;height:32px;border-radius:8px;background:#7c3aed;color:#fff;text-align:center;font-weight:900;vertical-align:top;">3</td>
          <td style="padding-right:12px;"><strong>ولّد وحمّل ZIP</strong><br><span style="font-size:13px;color:#64748b;">كل البطاقات جاهزة دفعة واحدة</span></td>
        </tr></table>
      </div>
    </div>

    ${btn('افتح الداشبورد', dashboardUrl || `${SITE_URL}/company/dashboard`)}
  `)

  return resend.emails.send({
    from: `سَلِّم <${FROM_EMAIL}>`,
    to,
    subject: 'مرحباً بك في سلّم للمؤسسات',
    html,
  })
}

// ══════════════════════════════════════════
// 5. sendLimitWarningEmail — تحذير 80%
// ══════════════════════════════════════════

async function sendLimitWarningEmail({ to, companyName, used, limit, remaining }) {
  const percent = Math.round((used / limit) * 100)

  const html = emailLayout(`
    <h2 style="color:#f59e0b;margin:0 0 16px;font-size:22px;">⚠️ رصيدك على وشك النفاد</h2>
    <p>أهلاً <strong>${companyName}</strong>،</p>
    <p>استهلاك رصيدك وصل <strong style="color:#f59e0b;">${percent}%</strong>.</p>

    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
      <div style="font-size:14px;color:#92400e;margin-bottom:8px;">الاستهلاك</div>
      <div style="font-size:32px;font-weight:900;color:#f59e0b;">${used} <span style="font-size:16px;color:#92400e;font-weight:600;">من ${limit}</span></div>
      <div style="height:8px;background:#fde68a;border-radius:100px;margin:12px 0;overflow:hidden;">
        <div style="height:100%;width:${percent}%;background:linear-gradient(90deg,#f59e0b,#ef4444);border-radius:100px;"></div>
      </div>
      <div style="font-size:16px;font-weight:800;color:#dc2626;">متبقي ${remaining} بطاقة فقط</div>
    </div>

    ${btn('جدّد باقتك الآن', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحباً، أرغب بتجديد باقة شركة ${companyName} في منصة سلّم`)}`, '#25D366')}
  `)

  return resend.emails.send({
    from: `سَلِّم <${FROM_EMAIL}>`,
    to,
    subject: '⚠️ رصيدك على وشك النفاد',
    html,
  })
}

// ══════════════════════════════════════════
// 6. sendLimitReachedEmail — نفاد كامل
// ══════════════════════════════════════════

async function sendLimitReachedEmail({ to, companyName, limit }) {
  const html = emailLayout(`
    <h2 style="color:#ef4444;margin:0 0 16px;font-size:22px;">🔴 انتهى رصيد بطاقاتك</h2>
    <p>أهلاً <strong>${companyName}</strong>،</p>
    <p>نفدت الـ <strong>${limit}</strong> بطاقة المتاحة في باقتك.</p>

    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
      <div style="font-size:40px;margin-bottom:8px;">🚫</div>
      <div style="font-size:16px;font-weight:800;color:#dc2626;">الرصيد: 0 بطاقة</div>
      <div style="font-size:13px;color:#b91c1c;margin-top:8px;">الرابط الخاص بموظفيك متوقف حالياً</div>
    </div>

    <p>لاستئناف الخدمة، جدّد باقتك عبر التواصل معنا:</p>
    ${btn('تواصل معنا لتجديد الباقة', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحباً، نفد رصيد شركة ${companyName} وأرغب بتجديد الباقة`)}`, '#25D366')}
  `)

  return resend.emails.send({
    from: `سَلِّم <${FROM_EMAIL}>`,
    to,
    subject: '🔴 انتهى رصيد بطاقاتك',
    html,
  })
}

// ══════════════════════════════════════════
// 7. sendNewOrderNotification — إشعار للأدمن
// ══════════════════════════════════════════

async function sendNewOrderNotification({ companyName, packageName, contactNumber, requestDate }) {
  const html = emailLayout(`
    <h2 style="color:#7c3aed;margin:0 0 16px;font-size:22px;">🔔 طلب باقة جديد</h2>

    <div style="background:#f8fafc;border-radius:12px;padding:20px;margin:20px 0;">
      <table dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr><td style="padding:10px 0;font-size:14px;color:#64748b;width:120px;">اسم الشركة:</td><td style="padding:10px 0;font-weight:700;font-size:16px;">${companyName}</td></tr>
        <tr><td style="padding:10px 0;font-size:14px;color:#64748b;">الباقة المطلوبة:</td><td style="padding:10px 0;font-weight:700;color:#7c3aed;">${packageName}</td></tr>
        <tr><td style="padding:10px 0;font-size:14px;color:#64748b;">رقم التواصل:</td><td style="padding:10px 0;font-weight:700;direction:ltr;text-align:right;">${contactNumber}</td></tr>
        <tr><td style="padding:10px 0;font-size:14px;color:#64748b;">تاريخ الطلب:</td><td style="padding:10px 0;font-weight:700;">${requestDate}</td></tr>
      </table>
    </div>

    ${btn('افتح لوحة الأدمن', `${SITE_URL}/admin/dashboard`)}
  `)

  return resend.emails.send({
    from: `سَلِّم <${FROM_EMAIL}>`,
    to: ADMIN_EMAIL,
    subject: `🔔 طلب باقة جديد — ${companyName}`,
    html,
  })
}

// ══════════════════════════════════════════
// 8. sendCompanyCredentialsEmail — بيانات الدخول بعد الدفع
// ══════════════════════════════════════════

async function sendCompanyCredentialsEmail({ to, companyName, email, password, packageName, limit }) {
  const html = emailLayout(`
    <h2 style="color:#7c3aed;margin:0 0 16px;font-size:22px;">🎉 تم تفعيل حساب شركتك بنجاح!</h2>
    <p>أهلاً <strong>${companyName}</strong>،</p>
    <p>تم الدفع بنجاح وحسابك جاهز الآن. باقتك: <strong>${packageName}</strong> — <strong>${limit}</strong> بطاقة سنوياً.</p>

    <div style="background:#f8fafc;border:2px solid #7c3aed33;border-radius:14px;padding:24px;margin:24px 0;">
      <div style="font-size:13px;font-weight:700;color:#7c3aed;margin-bottom:14px;text-align:center;">بيانات الدخول للوحة التحكم</div>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;font-size:14px;color:#64748b;width:40%;">البريد الإلكتروني:</td>
          <td style="padding:10px 0;font-weight:800;font-size:14px;direction:ltr;text-align:right;">${email}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:14px;color:#64748b;">كلمة المرور:</td>
          <td style="padding:10px 0;font-weight:800;font-size:16px;font-family:monospace;letter-spacing:2px;color:#7c3aed;">${password}</td>
        </tr>
      </table>
    </div>

    <p style="font-size:13px;color:#dc2626;font-weight:700;text-align:center;">⚠️ احتفظ بهذه البيانات — لن تُرسَل مرة أخرى</p>

    ${btn('ادخل لوحة التحكم الآن', `${SITE_URL}/company-login`)}

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin-top:20px;">
      <div style="font-size:13px;color:#166534;font-weight:700;margin-bottom:8px;">ابدأ بـ 3 خطوات بسيطة:</div>
      <div style="font-size:13px;color:#166534;">١. ارفع أسماء موظفيك</div>
      <div style="font-size:13px;color:#166534;margin-top:4px;">٢. اختر قالب البطاقة</div>
      <div style="font-size:13px;color:#166534;margin-top:4px;">٣. ولّد وحمّل كل البطاقات دفعة واحدة</div>
    </div>
  `)

  return resend.emails.send({
    from: `سَلِّم <${FROM_EMAIL}>`,
    to,
    subject: '✅ حسابك جاهز — بيانات الدخول لمنصة سلّم',
    html,
  })
}

// ══════════════════════════════════════════
// Exports
// ══════════════════════════════════════════

export {
  sendActivationEmail,
  sendInvoiceEmail,
  sendPackagePurchaseEmail,
  sendCompanyWelcomeEmail,
  sendLimitWarningEmail,
  sendLimitReachedEmail,
  sendNewOrderNotification,
  sendCompanyCredentialsEmail
}
