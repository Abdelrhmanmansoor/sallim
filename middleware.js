// Vercel Edge Middleware — injects Open Graph meta tags for /g/:shortId
// Runs before static file serving so social bots get proper OG preview images
//
// Required Vercel env var (set in project settings, NOT VITE_ prefixed):
//   BACKEND_URL=https://sallim-be.vercel.app

const BACKEND_URL = process.env.BACKEND_URL || 'https://sallim-be.vercel.app'
const CLIENT_URL = 'https://www.sallim.co'

const BOT_UA = /facebookexternalhit|whatsapp|twitterbot|telegrambot|slackbot|discordbot|linkedinbot|googlebot|bingbot|yandex|crawler|spider|preview/i

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export default async function middleware(request) {
  const ua = request.headers.get('user-agent') || ''
  if (!BOT_UA.test(ua)) return // regular browser — let Vercel serve index.html via rewrite

  const url = new URL(request.url)
  const shortId = url.pathname.replace(/^\/g\//, '').split('/')[0].split('?')[0]
  if (!shortId) return

  try {
    const apiRes = await fetch(`${BACKEND_URL}/api/v1/company/greet-links/${shortId}`, {
      headers: { 'user-agent': 'Sallim-OG-Bot/1.0' },
      signal: AbortSignal.timeout(5000),
    })

    if (!apiRes.ok) return

    const json = await apiRes.json()
    if (!json.success || !json.data) return

    const d = json.data
    const title = escapeHtml(d.greetingText || d.occasionName || 'بطاقة تهنئة')
    const companyName = escapeHtml(d.customCompanyName || d.company?.name || 'سَلِّم')
    const description = escapeHtml(`${companyName} يدعوك للحصول على بطاقتك — اضغط لتكتب اسمك وتحمّل بطاقتك`)
    const imageUrl = escapeHtml(d.templateImage || `${CLIENT_URL}/images/logo.png`)
    const pageUrlRaw = `${CLIENT_URL}/g/${shortId}` // raw for JS (shortId is nanoid — safe)
    const pageUrl = escapeHtml(pageUrlRaw)

    const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<title>${title} | سَلِّم</title>
<meta name="description" content="${description}">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="${pageUrl}">
<meta property="og:site_name" content="سَلِّم">
<meta property="og:locale" content="ar_SA">
<meta property="og:title" content="${title} | ${companyName}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:image:width" content="1080">
<meta property="og:image:height" content="1920">
<meta property="og:image:type" content="image/png">
<meta property="og:image:alt" content="${title}">

<!-- Twitter / X -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title} | ${companyName}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${imageUrl}">

<!-- Redirect browsers immediately -->
<meta http-equiv="refresh" content="0;url=${pageUrl}">
<script>window.location.replace("${pageUrlRaw}")</script>
</head>
<body>
<p style="font-family:sans-serif;text-align:center;margin-top:40px">جارٍ التحميل...</p>
</body>
</html>`

    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=60, s-maxage=300',
      },
    })
  } catch {
    return // on error pass through
  }
}

export const config = {
  matcher: '/g/:shortId*',
}
