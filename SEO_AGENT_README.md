# 🤖 Anti-Gravity SEO Agent

Advanced SEO automation tool for the Sallim platform. This agent performs comprehensive website crawling, generates optimized XML sitemaps, conducts detailed SEO audits, and provides actionable recommendations.

## 🎯 Features

### Phase 1: Comprehensive Crawling
- ✅ Full website crawling with configurable depth
- ✅ Robots.txt parsing and respect
- ✅ Redirect chain detection
- ✅ Broken link reporting (4xx/5xx errors)
- ✅ Dynamic content discovery (blog posts, games, diwaniyas)
- ✅ Internal linking structure analysis
- ✅ Orphan page detection
- ✅ Polite crawling with configurable delays

### Phase 2: Sitemap Generation
- ✅ Valid XML sitemap following sitemaps.org protocol
- ✅ Priority rules (homepage: 1.0, sections: 0.8, posts: 0.7, etc.)
- ✅ Change frequency rules (daily, weekly, monthly)
- ✅ Automatic sitemap index for >50,000 URLs
- ✅ Last-modified dates from HTTP headers
- ✅ Automatic robots.txt update with sitemap reference

### Phase 3: SEO Audit
- ✅ Title tag analysis (presence, length: 30-60 chars)
- ✅ Meta description analysis (presence, length: 120-160 chars)
- ✅ Canonical tag validation
- ✅ Open Graph tags detection
- ✅ Structured data (JSON-LD) detection
- ✅ Robots meta tag analysis
- ✅ Crawlability issues identification

### Phase 4: Reporting
- ✅ Comprehensive JSON report with all findings
- ✅ Prioritized recommendations (HIGH, MEDIUM, LOW)
- ✅ Console summary with key metrics
- ✅ Detailed per-page issue tracking

## 🚀 Quick Start

### Installation

The SEO agent is a Node.js application. Ensure you have Node.js installed (v14 or higher).

```bash
# Check Node.js version
node --version

# The agent uses ES modules, so it's ready to run
```

### Configuration

Edit `enhanced_seo_agent.js` to customize settings:

```javascript
const CONFIG = {
  SITE_URL: 'https://www.sallim.co',
  API_URL: 'http://localhost:3001/api/v1',
  CRAWL_DELAY: 1000,        // Delay between requests (ms)
  MAX_DEPTH: 3,              // Maximum crawl depth
  USER_AGENT: 'Mozilla/5.0 (compatible; SEO-Agent/2.0; +https://www.sallim.co)',
  
  EXCLUDE_PATTERNS: [
    '/admin',
    '/dashboard',
    '/profile',
    // Add more patterns to exclude
  ]
};
```

### Running the Agent

```bash
# Run the SEO agent
node enhanced_seo_agent.js
```

### Expected Output

```
🤖 ANTI-GRAVITY SEO AGENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target: https://www.sallim.co
Max Depth: 3
Crawl Delay: 1000ms

🔍 PHASE 1: COMPREHENSIVE CRAWLING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Fetched robots.txt from https://www.sallim.co/robots.txt
🔎 Crawling [depth 0]: https://www.sallim.co/
🔎 Crawling [depth 1]: https://www.sallim.co/about
...

📄 PHASE 2: SITEMAP GENERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Generated sitemap with 25 URLs
✅ Saved sitemap.xml
✅ Updated robots.txt

🔍 PHASE 3: SEO AUDIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Audit Results:
   - Pages with missing titles: 0
   - Pages with missing descriptions: 2
   - Pages with missing canonicals: 5
   - Pages with missing OG tags: 10
   - Pages with missing structured data: 15
   - Orphan pages: 0

📋 PHASE 5: FINAL REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Saved detailed SEO report to seo_report.json

============================================================
📊 CRAWL SUMMARY
============================================================
Total URLs found:         25
Broken links (4xx/5xx):   0
Redirect chains:          0
Orphan pages:             0

📄 SITEMAP
============================================================
File:                     sitemap.xml
Total URLs:               25
Sitemap Index:            No

🔍 CRAWLABILITY ISSUES
============================================================
Missing canonical tags:   5 pages
Missing meta description: 2 pages
Missing title tags:       0 pages
Missing OG tags:          10 pages
Missing structured data:  15 pages

⚡ RECOMMENDATIONS (Priority Order)
============================================================

1. [HIGH  ] Add canonical tags to all pages
   5 pages are missing canonical tags.
   Action: Add <link rel="canonical"> tags to prevent duplicate content issues.

2. [MEDIUM] Add meta descriptions to all pages
   2 pages are missing meta descriptions.
   Action: Write unique, compelling meta descriptions (120-160 characters) for better CTR.

3. [MEDIUM] Add Open Graph tags
   10 pages are missing Open Graph tags.
   Action: Add og:title, og:description, og:url, and og:image for better social sharing.

============================================================
✅ SEO AGENT COMPLETE
============================================================
```

## 📊 Output Files

### 1. `public/sitemap.xml`
The generated XML sitemap following the sitemaps.org protocol.

Example:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.sallim.co/</loc>
    <lastmod>2026-03-10</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.sallim.co/about</loc>
    <lastmod>2026-03-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 2. `public/robots.txt`
Updated robots.txt with sitemap reference.

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /profile
...

Sitemap: https://www.sallim.co/sitemap.xml
```

### 3. `seo_report.json`
Comprehensive JSON report containing:
- Configuration used
- Full crawl data for each URL
- Detailed audit results
- Broken links list
- Redirect chains
- Orphan pages
- Prioritized recommendations

## 🔍 Understanding the Reports

### Crawl Summary
- **Total URLs found**: Number of unique URLs discovered
- **Broken links**: URLs returning 4xx or 5xx status codes
- **Redirect chains**: URLs that redirect to another location
- **Orphan pages**: Indexable pages with no internal links pointing to them

### Crawlability Issues
- **Missing canonical tags**: Pages without canonical tags (duplicate content risk)
- **Missing meta description**: Pages without meta descriptions (affects CTR)
- **Missing title tags**: Pages without title tags (critical for SEO)
- **Missing OG tags**: Pages without Open Graph tags (social sharing)
- **Missing structured data**: Pages without Schema.org markup (rich snippets)

### Recommendations
Prioritized action items:
- **HIGH**: Fix immediately - affects indexing or user experience
- **MEDIUM**: Important for SEO but not blocking
- **LOW**: Nice to have for optimization

## 🎨 Customization

### Priority Rules

Customize URL priorities in the `PRIORITY_RULES` object:

```javascript
PRIORITY_RULES: {
  homepage: { pattern: /^\/$/, priority: 1.0 },
  mainSections: { pattern: /^(\/(about|pricing|contact))$/, priority: 0.8 },
  blogPosts: { pattern: /^\/blog\//, priority: 0.7 },
  // Add more rules as needed
}
```

### Change Frequency Rules

Customize how often pages are updated:

```javascript
CHANGE_FREQ_RULES: {
  homepage: 'daily',
  mainSections: 'weekly',
  blogPosts: 'weekly',
  // Options: always, hourly, daily, weekly, monthly, yearly, never
}
```

### Exclude Patterns

Add URL patterns to exclude from crawling:

```javascript
EXCLUDE_PATTERNS: [
  '/admin',
  '/dashboard',
  '/api',           // Exclude API endpoints
  '/static',        // Exclude static files
]
```

## 🔧 Troubleshooting

### Issue: "Could not fetch robots.txt"
**Solution**: This is a warning. The agent will continue crawling with default rules.

### Issue: "Broken links detected"
**Solution**: Check the `brokenLinks` array in `seo_report.json` and fix or redirect these URLs.

### Issue: "Orphan pages detected"
**Solution**: Add internal links to these pages from relevant content pages.

### Issue: Crawl is too slow
**Solution**: Reduce `CRAWL_DELAY` (minimum 500ms) or reduce `MAX_DEPTH`.

## 📈 Best Practices

1. **Run Regularly**: Execute the SEO agent weekly or after major content changes
2. **Monitor Broken Links**: Fix broken links immediately to maintain user experience
3. **Update Priority Rules**: Adjust priority rules as your site structure evolves
4. **Check Recommendations**: Review and implement recommendations in priority order
5. **Submit to GSC**: After generating sitemap, submit it to Google Search Console

## 🔗 Integration with Google Search Console

The current version generates the sitemap but requires manual submission to Google Search Console:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property
3. Navigate to "Sitemaps"
4. Submit your sitemap URL: `https://www.sallim.co/sitemap.xml`

## 🚧 Future Enhancements

Potential features for future versions:
- Automatic Google Search Console API integration
- Page speed analysis
- Mobile-friendliness testing
- Image sitemap generation
- Video sitemap generation
- Competition analysis
- Keyword tracking
- Backlink analysis

## 📝 License

This SEO agent is part of the Sallim platform project.

## 🤝 Support

For issues or questions:
1. Check this README for common solutions
2. Review `seo_report.json` for detailed findings
3. Examine the console output for error messages

---

**Built with ❤️ for Sallim - Making Eid celebrations memorable**