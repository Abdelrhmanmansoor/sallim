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
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <title>مرحباً بك في سلّم</title>
</head>
<body style="margin:0;padding:0;background:#0d0d14;font-family:'Segoe UI',Tahoma,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d14;min-height:100vh;">
    <tr><td align="center" style="padding:40px 16px;">

      <!-- Card -->
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;border-radius:24px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,0.6);">

        <!-- ── Hero Header ── -->
        <tr>
          <td style="background:linear-gradient(145deg,#1a0a2e 0%,#0f0f1e 40%,#1a1030 100%);padding:48px 40px 40px;text-align:center;position:relative;">
            <!-- Decorative top line -->
            <div style="height:3px;background:linear-gradient(90deg,transparent,#c9a227,#e8c547,#c9a227,transparent);border-radius:2px;margin-bottom:36px;"></div>

            <!-- Logo -->
            <div style="margin-bottom:20px;">
              <img src="https://www.sallim.co/images/logo.png"
                   alt="سلّم"
                   width="110"
                   style="display:block;margin:0 auto;max-height:60px;object-fit:contain;"
                   onerror="this.style.display='none'" />
            </div>

            <!-- Brand name fallback + tagline -->
            <div style="font-size:13px;color:#c9a227;letter-spacing:3px;font-weight:600;margin-bottom:28px;">مِنَصَّة بَطَاقَاتِ التَّهْنِئَة</div>

            <!-- Celebration icon -->
            <div style="width:72px;height:72px;background:linear-gradient(135deg,#c9a227,#e8c547);border-radius:50%;margin:0 auto 20px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 40px rgba(201,162,39,0.35);">
              <span style="font-size:34px;line-height:72px;display:block;text-align:center;">✦</span>
            </div>

            <h1 style="margin:0 0 10px;font-size:26px;font-weight:800;color:#f5f0e8;letter-spacing:0.5px;">
              تم تفعيل حسابكم بنجاح
            </h1>
            <p style="margin:0;font-size:15px;color:#a89060;font-weight:400;">
              أهلاً وسهلاً، <strong style="color:#e8c547;">${companyName}</strong>
            </p>

            <!-- Decorative bottom line -->
            <div style="height:1px;background:linear-gradient(90deg,transparent,#c9a22750,transparent);margin-top:36px;"></div>
          </td>
        </tr>

        <!-- ── Package Banner ── -->
        <tr>
          <td style="background:linear-gradient(135deg,#c9a227,#e8c547,#c9a227);padding:18px 40px;text-align:center;">
            <span style="font-size:13px;color:#1a0a2e;font-weight:700;letter-spacing:1px;">الباقة المفعّلة</span>
            <span style="font-size:18px;color:#0d0d14;font-weight:900;margin-right:10px;">◈ ${packageName}</span>
            <span style="font-size:13px;color:#1a0a2e;font-weight:700;">— ${limit} بطاقة سنوياً</span>
          </td>
        </tr>

        <!-- ── Body ── -->
        <tr>
          <td style="background:#12111f;padding:40px 40px 36px;">

            <!-- Intro -->
            <p style="margin:0 0 28px;font-size:15px;color:#b8b0c8;line-height:1.9;text-align:center;">
              تم إتمام الدفع وإعداد لوحة التحكم الخاصة بكم.<br>
              فيما يلي بيانات الدخول إلى حسابكم المؤسسي.
            </p>

            <!-- Credentials Card -->
            <div style="background:linear-gradient(145deg,#1c1a30,#1a1828);border:1px solid #c9a22730;border-radius:18px;padding:28px 32px;margin-bottom:28px;">
              <div style="font-size:11px;font-weight:700;color:#c9a227;letter-spacing:2px;text-align:center;margin-bottom:22px;text-transform:uppercase;">بيانات الدخول للوحة التحكم</div>

              <!-- Email row -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td style="padding:14px 18px;background:#0d0d14;border-radius:10px;">
                    <div style="font-size:11px;color:#6b6480;font-weight:600;margin-bottom:5px;letter-spacing:1px;">البريد الإلكتروني</div>
                    <div style="font-size:15px;color:#e2daf0;font-weight:700;direction:ltr;text-align:right;">${email}</div>
                  </td>
                </tr>
              </table>

              <!-- Password row -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:14px 18px;background:#0d0d14;border-radius:10px;border:1px solid #c9a22740;">
                    <div style="font-size:11px;color:#c9a227;font-weight:600;margin-bottom:5px;letter-spacing:1px;">كلمة المرور</div>
                    <div style="font-size:20px;color:#e8c547;font-weight:900;font-family:monospace;letter-spacing:4px;text-align:center;padding:4px 0;">${password}</div>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Warning notice -->
            <div style="background:#1e0d0d;border:1px solid #7f1d1d50;border-radius:12px;padding:14px 20px;margin-bottom:32px;text-align:center;">
              <span style="font-size:13px;color:#fca5a5;font-weight:700;">⚠ احتفظ بهذه البيانات — لن تُرسَل مرة أخرى</span>
            </div>

            <!-- CTA Button -->
            <div style="text-align:center;margin-bottom:36px;">
              <a href="${SITE_URL}/company-login"
                 style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#c9a227,#e8c547,#c9a227);color:#0d0d14;text-decoration:none;border-radius:50px;font-size:17px;font-weight:900;letter-spacing:0.5px;box-shadow:0 8px 32px rgba(201,162,39,0.4);">
                ادخل لوحة التحكم الآن ←
              </a>
            </div>

            <!-- Steps -->
            <div style="border-top:1px solid #ffffff10;padding-top:28px;">
              <div style="font-size:12px;color:#6b6480;text-align:center;letter-spacing:2px;margin-bottom:20px;font-weight:600;">ابدأ بثلاث خطوات بسيطة</div>

              <!-- Step 1 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td style="width:36px;vertical-align:top;">
                    <div style="width:32px;height:32px;background:linear-gradient(135deg,#c9a227,#e8c547);border-radius:50%;text-align:center;line-height:32px;font-size:13px;font-weight:900;color:#0d0d14;">١</div>
                  </td>
                  <td style="padding-right:14px;vertical-align:top;">
                    <div style="font-size:14px;color:#e2daf0;font-weight:700;padding-top:2px;">ارفع أسماء موظفيك</div>
                    <div style="font-size:12px;color:#6b6480;margin-top:3px;">عبر ملف CSV أو الإدخال اليدوي</div>
                  </td>
                </tr>
              </table>

              <!-- Step 2 -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                <tr>
                  <td style="width:36px;vertical-align:top;">
                    <div style="width:32px;height:32px;background:linear-gradient(135deg,#c9a227,#e8c547);border-radius:50%;text-align:center;line-height:32px;font-size:13px;font-weight:900;color:#0d0d14;">٢</div>
                  </td>
                  <td style="padding-right:14px;vertical-align:top;">
                    <div style="font-size:14px;color:#e2daf0;font-weight:700;padding-top:2px;">اختر قالب البطاقة المناسب</div>
                    <div style="font-size:12px;color:#6b6480;margin-top:3px;">عشرات القوالب الاحترافية الجاهزة</div>
                  </td>
                </tr>
              </table>

              <!-- Step 3 -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:36px;vertical-align:top;">
                    <div style="width:32px;height:32px;background:linear-gradient(135deg,#c9a227,#e8c547);border-radius:50%;text-align:center;line-height:32px;font-size:13px;font-weight:900;color:#0d0d14;">٣</div>
                  </td>
                  <td style="padding-right:14px;vertical-align:top;">
                    <div style="font-size:14px;color:#e2daf0;font-weight:700;padding-top:2px;">ولّد وحمّل جميع البطاقات</div>
                    <div style="font-size:12px;color:#6b6480;margin-top:3px;">كل البطاقات دفعة واحدة بنقرة واحدة</div>
                  </td>
                </tr>
              </table>
            </div>

          </td>
        </tr>

        <!-- ── Footer ── -->
        <tr>
          <td style="background:#0a0910;padding:28px 40px;text-align:center;border-top:1px solid #ffffff08;">
            <div style="height:1px;background:linear-gradient(90deg,transparent,#c9a22740,transparent);margin-bottom:20px;"></div>
            <div style="font-size:12px;color:#4a4560;margin-bottom:10px;">
              منصة سلّم للتهنئة المؤسسية
            </div>
            <div style="font-size:12px;color:#4a4560;">
              <a href="${SITE_URL}" style="color:#c9a227;text-decoration:none;">sallim.co</a>
              &nbsp;·&nbsp;
              <a href="mailto:support@sallim.co" style="color:#c9a227;text-decoration:none;">support@sallim.co</a>
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`

  return resend.emails.send({
    from: `سَلِّم <${FROM_EMAIL}>`,
    to,
    subject: '✦ حسابكم المؤسسي جاهز — منصة سلّم',
    html,
  })
}

// ══════════════════════════════════════════
// Exports
// ══════════════════════════════════════════

// ══════════════════════════════════════════
// 9. sendEidWelcomeEmail — ترحيب مجاني + تهنئة عيد الفطر
// ══════════════════════════════════════════

async function sendEidWelcomeEmail({ to, companyName }) {
  const html = emailLayout(`
    <div style="text-align:center;margin-bottom:32px;">
      <div style="font-size:48px;margin-bottom:12px;">🌙✨</div>
      <h2 style="color:#7c3aed;margin:0 0 8px;font-size:26px;font-weight:900;">تهانينا بمناسبة عيد الفطر المبارك</h2>
      <p style="font-size:14px;color:#94a3b8;margin:0;">تقبّل الله منا ومنكم صالح الأعمال</p>
    </div>

    <p style="font-size:16px;color:#1e293b;margin-bottom:16px;">أهلاً وسهلاً <strong>${companyName}</strong>،</p>

    <p style="font-size:15px;color:#374151;line-height:1.9;margin-bottom:20px;">
      يسعدنا انضمامكم إلى <strong>منصة سَلِّم</strong> — منصة بطاقات التهنئة الاحترافية.
      <br />
      حسابكم جاهز الآن ويمكنكم البدء فوراً بإنشاء تهانيكم المخصصة.
    </p>

    <div style="background:#f5f3ff;border-radius:14px;padding:20px 24px;margin:24px 0;border:1px solid #ede9fe;">
      <p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#6d28d9;">✅ ما يمكنكم فعله الآن:</p>
      <ul style="margin:0;padding:0 16px;color:#4c1d95;font-size:14px;line-height:2;">
        <li>إضافة شعار وألوان شركتكم</li>
        <li>رفع قوائم الموظفين والعملاء</li>
        <li>إنشاء بطاقات تهنئة جماعية في ثوانٍ</li>
        <li>مشاركة روابط التهاني عبر واتساب</li>
      </ul>
    </div>

    <div style="text-align:center;margin:32px 0;">
      <a href="${SITE_URL}/company-login"
         style="display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#ffffff;text-decoration:none;border-radius:50px;font-size:17px;font-weight:900;box-shadow:0 8px 24px rgba(124,58,237,0.35);">
        ادخل إلى لوحة التحكم
      </a>
    </div>

    <p style="text-align:center;font-size:15px;color:#64748b;line-height:1.8;margin-top:24px;">
      كل عام وأنتم بخير 🌙<br/>
      <span style="color:#7c3aed;font-weight:700;">فريق منصة سَلِّم</span>
    </p>
  `)

  return resend.emails.send({
    from: `سَلِّم <${FROM_EMAIL}>`,
    to,
    subject: `🌙 عيد مبارك — أهلاً بكم في منصة سَلِّم`,
    html,
  })
}

export {
  sendActivationEmail,
  sendInvoiceEmail,
  sendPackagePurchaseEmail,
  sendCompanyWelcomeEmail,
  sendLimitWarningEmail,
  sendLimitReachedEmail,
  sendNewOrderNotification,
  sendCompanyCredentialsEmail,
  sendEidWelcomeEmail
}
