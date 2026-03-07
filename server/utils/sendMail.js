import nodemailer from 'nodemailer'

/**
 * Send an email using Nodemailer
 * It uses the environment variables for SMTP configuration
 */
export async function sendEmail({ to, subject, html }) {
    try {
        // In production, configure these in your .env
        // We are using a test account or generic SMTP as fallback

        // Create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.ethereal.email',
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        })

        // Send the email
        const info = await transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'سَلِّم للمؤسسات'}" <${process.env.SMTP_FROM_EMAIL || 'noreply@sallim.com'}>`,
            to,
            subject,
            html, // html body
        })

        console.log('Message sent: %s', info.messageId)

        // Try to get test URL if using ethereal email
        if (process.env.SMTP_HOST === 'smtp.ethereal.email') {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
        }

        return true
    } catch (error) {
        console.error('Email sending failed:', error)
        return false
    }
}

/**
 * Generate Activation Email HTML Template
 */
export function getActivationEmailHtml(companyName, activationLink, activationCode) {
    return `
    <div dir="rtl" style="font-family: 'Tahoma', sans-serif; background-color: #f8fafc; padding: 40px 20px; color: #0f172a; text-align: right;">
      <div style="max-w-md; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
        <h2 style="color: #2563eb; margin-bottom: 20px;">مرحباً بك في سَلِّم للمؤسسات 👋</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #475569;">
          أهلاً بأصدقائنا في <strong>${companyName}</strong>،<br>
          تم دعوتكم لإنشاء حساب مؤسسي على منصة سَلِّم لتصميم بطاقات التهنئة، مما يتيح لكم تخصيص هوية بطاقاتكم وإرسالها لعملائكم وموظفيكم بكل سهولة.
        </p>
        
        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 30px 0; text-align: center;">
          <p style="text-align: center; font-size: 14px; color: #64748b; margin-top: 0; margin-bottom: 15px;">رمز التفعيل الخاص بك (يصلح لمدة 48 ساعة):</p>
          <div style="font-family: monospace; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #0f172a;">
            ${activationCode}
          </div>
        </div>
        
        <a href="${activationLink}" style="display: block; width: 100%; text-align: center; background-color: #2563eb; color: #ffffff; padding: 14px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
          تفعيل الحساب وإعداد كلمة المرور
        </a>
        
        <hr style="border: 0; height: 1px; background-color: #e2e8f0; margin: 30px 0;">
        
        <p style="font-size: 13px; color: #94a3b8; text-align: center; margin: 0;">
          إذا لم تكن قد طلبت هذا الحساب، يرجى تجاهل هذه الرسالة.<br>
          مع تحيات فريق عمل سَلِّم.
        </p>
      </div>
    </div>
  `
}
