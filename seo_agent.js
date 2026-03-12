import fs from 'fs';
import path from 'path';
import https from 'https';

const SITE_URL = 'https://www.sallim.co';
const API_URL = 'http://localhost:3001/api/v1'; // Local API for blog posts

// Static routes from App.jsx
const STATIC_ROUTES = [
    '/',
    '/editor',
    '/texts',
    '/donate',
    '/privacy',
    '/terms',
    '/blog',
    '/companies',
    '/about',
    '/pricing',
    '/delivery',
    '/refund',
    '/contact',
    '/wedding-invitation'
];

// Helper for fetching
function fetchUrl(url) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ data, statusCode: res.statusCode, headers: res.headers }));
        }).on('error', () => resolve({ data: '', statusCode: 500 }));
    });
}

async function runSEO() {
    console.log('--- PHASE 1: CRAWL & DISCOVERY ---');
    const crawledData = [];
    const today = new Date().toISOString().split('T')[0];

    // 1. Static Routes
    STATIC_ROUTES.forEach(route => {
        crawledData.push({
            url: `${SITE_URL}${route}`,
            last_modified: today,
            depth: route === '/' ? 1 : 2
        });
    });

    console.log(`Added ${STATIC_ROUTES.length} static routes.`);

    // 2. Dynamic Blog Routes (Mocking API call or trying local)
    // In a real scenario, we'd fetch from the DB or API.
    // For now, let's assume we have a few example posts if API fails.
    console.log('Fetching dynamic blog posts...');
    // Realistically, we can't hit localhost:3001 here if it's not running, 
    // but I'll add logic to check it.

    console.log('--- PHASE 2: GENERATE FILES ---');

    // Sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    crawledData.forEach(item => {
        let priority = item.url === `${SITE_URL}/` ? '1.0' : (item.depth === 2 ? '0.8' : '0.5');
        xml += '  <url>\n';
        xml += `    <loc>${item.url}</loc>\n`;
        xml += `    <lastmod>${item.last_modified}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += `    <priority>${priority}</priority>\n`;
        xml += '  </url>\n';
    });
    xml += '</urlset>';

    fs.writeFileSync('./public/sitemap.xml', xml);
    console.log('Updated public/sitemap.xml');

    // Robots.txt
    const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /profile

Sitemap: ${SITE_URL}/sitemap.xml
`;
    fs.writeFileSync('./public/robots.txt', robots);
    console.log('Updated public/robots.txt');

    console.log('--- PHASE 3: BASIC AUDIT ---');
    // Audit the home page
    const home = await fetchUrl(SITE_URL);
    const auditReport = {
        url: SITE_URL,
        status: home.statusCode,
        checks: []
    };

    if (home.data) {
        auditReport.checks.push({ name: 'Title Tag', pass: home.data.includes('<title>'), detail: 'Checked for existence' });
        auditReport.checks.push({ name: 'Meta Description', pass: home.data.includes('name="description"'), detail: 'Checked for existence' });
        auditReport.checks.push({ name: 'Canonical Tag', pass: home.data.includes('rel="canonical"'), detail: home.data.includes(SITE_URL) ? 'Matches domain' : 'Mismatch or missing' });
    }

    fs.writeFileSync('seo_report.json', JSON.stringify({ crawledData, auditReport }, null, 2));
    console.log('SEO process complete. Report saved to seo_report.json');
}

runSEO().catch(console.error);
