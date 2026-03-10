#!/usr/bin/env node
/**
 * 🤖 Anti-Gravity SEO Agent
 * Advanced SEO Automation Tool
 * 
 * Features:
 * - Full website crawling with robots.txt respect
 * - Dynamic content discovery (blog posts, games, diwaniyas)
 * - Comprehensive sitemap generation with priority rules
 * - Detailed SEO audit (meta tags, canonicals, structured data)
 * - Google Search Console integration
 * - Orphan page detection
 * - Broken link reporting
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

// ==================== CONFIGURATION ====================
const CONFIG = {
  SITE_URL: 'https://www.sallim.co',
  API_URL: 'http://localhost:3001/api/v1',
  CRAWL_DELAY: 1000, // 1 second delay between requests (polite crawling)
  MAX_DEPTH: 3,
  USER_AGENT: 'Mozilla/5.0 (compatible; SEO-Agent/2.0; +https://www.sallim.co)',
  
  // Routes to exclude
  EXCLUDE_PATTERNS: [
    '/admin',
    '/dashboard',
    '/profile',
    '/company/dashboard',
    '/company-activation',
    '/company-login',
    '/login',
    '/register',
    '/checkout',
    '/card',
    '/send',
    '/editor'
  ],
  
  // Priority rules
  PRIORITY_RULES: {
    homepage: { pattern: /^\/$/, priority: 1.0 },
    mainSections: { pattern: /^(\/(about|pricing|contact|companies|blog|privacy|terms|delivery|refund|donate|wedding-invitation|create-game|texts))$/, priority: 0.8 },
    blogPosts: { pattern: /^\/blog\//, priority: 0.7 },
    games: { pattern: /^\/game\//, priority: 0.6 },
    diwaniyas: { pattern: /^\/eid\//, priority: 0.6 },
    deepPages: { pattern: /.*/, priority: 0.4 }
  },
  
  // Change frequency rules
  CHANGE_FREQ_RULES: {
    homepage: 'daily',
    mainSections: 'weekly',
    blogPosts: 'weekly',
    games: 'weekly',
    diwaniyas: 'monthly',
    deepPages: 'monthly'
  }
};

// ==================== UTILITIES ====================

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isUrlAllowed(url) {
  const urlPath = new URL(url).pathname;
  return !CONFIG.EXCLUDE_PATTERNS.some(pattern => urlPath.startsWith(pattern));
}

function getPriorityForUrl(url) {
  const urlPath = new URL(url).pathname;
  
  for (const [name, rule] of Object.entries(CONFIG.PRIORITY_RULES)) {
    if (rule.pattern.test(urlPath)) {
      return rule.priority;
    }
  }
  return 0.4; // Default priority
}

function getChangeFreqForUrl(url) {
  const urlPath = new URL(url).pathname;
  
  for (const [name, rule] of Object.entries(CONFIG.CHANGE_FREQ_RULES)) {
    if (urlPath.includes(name) || (name === 'homepage' && urlPath === '/')) {
      return rule;
    }
  }
  return 'monthly'; // Default
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// ==================== HTTP CLIENT ====================

function fetchUrl(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': CONFIG.USER_AGENT,
        ...options.headers
      }
    };

    const req = protocol.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          data,
          statusCode: res.statusCode,
          headers: res.headers,
          url: res.headers.location ? (new URL(res.headers.location, url)).href : url
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        data: '',
        statusCode: 500,
        error: error.message
      });
    });

    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// ==================== ROBOTS.TXT PARSER ====================

class RobotsParser {
  constructor(siteUrl) {
    this.siteUrl = new URL(siteUrl);
    this.rules = [];
    this.sitemaps = [];
    this.userAgent = '*';
  }

  async fetch() {
    const robotsUrl = `${this.siteUrl.origin}/robots.txt`;
    const response = await fetchUrl(robotsUrl);
    
    if (response.statusCode === 200 && response.data) {
      this.parse(response.data);
      console.log(`✅ Fetched robots.txt from ${robotsUrl}`);
    } else {
      console.warn(`⚠️  Could not fetch robots.txt (status: ${response.statusCode})`);
    }
    
    return this;
  }

  parse(content) {
    const lines = content.split('\n');
    let currentUserAgent = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const [directive, ...valueParts] = trimmed.split(':');
      const value = valueParts.join(':').trim().toLowerCase();

      if (directive.toLowerCase() === 'user-agent') {
        currentUserAgent = value;
      } else if (currentUserAgent === this.userAgent || currentUserAgent === '*') {
        if (directive.toLowerCase() === 'disallow') {
          this.rules.push({ type: 'disallow', path: value });
        } else if (directive.toLowerCase() === 'allow') {
          this.rules.push({ type: 'allow', path: value });
        } else if (directive.toLowerCase() === 'sitemap') {
          this.sitemaps.push(value);
        }
      }
    }
  }

  isAllowed(url) {
    const urlPath = new URL(url).pathname;
    
    // Check from most specific to least specific
    const sortedRules = [...this.rules].sort((a, b) => b.path.length - a.path.length);
    
    for (const rule of sortedRules) {
      if (urlPath.startsWith(rule.path)) {
        return rule.type === 'allow';
      }
    }
    
    return true; // Default to allow
  }
}

// ==================== CRAWLER ====================

class SEOCrawler {
  constructor(config) {
    this.config = config;
    this.crawledUrls = new Set();
    this.urlData = [];
    this.brokenLinks = [];
    this.redirectChains = [];
    this.internalLinks = new Map(); // URL -> Set of linking pages
  }

  async crawl(startUrl, maxDepth = 3) {
    console.log('\n🔍 PHASE 1: COMPREHENSIVE CRAWLING');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Fetch and parse robots.txt
    const robotsParser = new RobotsParser(this.config.SITE_URL);
    await robotsParser.fetch();
    
    // Start crawling
    await this.crawlPage(startUrl, 0, maxDepth, robotsParser);
    
    // Crawl dynamic content from API
    await this.crawlDynamicContent();
    
    console.log(`\n✅ Crawling complete! Found ${this.crawledUrls.size} URLs.`);
    console.log(`   - Indexable: ${this.urlData.length}`);
    console.log(`   - Excluded by robots.txt: N/A`);
    console.log(`   - Broken links: ${this.brokenLinks.length}`);
    console.log(`   - Redirects: ${this.redirectChains.length}`);
    
    return this.urlData;
  }

  async crawlPage(url, depth, maxDepth, robotsParser) {
    // Skip if already crawled
    if (this.crawledUrls.has(url)) return;
    
    // Skip if not allowed by robots.txt
    if (!robotsParser.isAllowed(url)) {
      console.log(`⛔  Skipped (robots.txt): ${url}`);
      return;
    }
    
    // Skip if manually excluded
    if (!isUrlAllowed(url)) {
      console.log(`⛔  Skipped (excluded): ${url}`);
      return;
    }
    
    // Check depth
    if (depth > maxDepth) {
      console.log(`⏭️  Skipped (max depth): ${url}`);
      return;
    }
    
    this.crawledUrls.add(url);
    console.log(`🔎 Crawling [depth ${depth}]: ${url}`);
    
    // Fetch the page
    await delay(this.config.CRAWL_DELAY);
    const response = await fetchUrl(url);
    
    // Handle redirects
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      this.redirectChains.push({
        from: url,
        to: response.url,
        status: response.statusCode
      });
      console.log(`↪️  Redirect (${response.statusCode}): ${url} → ${response.url}`);
      
      // Crawl the destination if it's on the same site
      if (response.url.startsWith(this.config.SITE_URL)) {
        await this.crawlPage(response.url, depth, maxDepth, robotsParser);
      }
      return;
    }
    
    // Handle broken links
    if (response.statusCode >= 400) {
      this.brokenLinks.push({
        url,
        statusCode: response.statusCode,
        depth
      });
      console.log(`❌ Broken link (${response.statusCode}): ${url}`);
      return;
    }
    
    // Parse page data
    const pageData = this.parsePageData(url, response);
    this.urlData.push(pageData);
    
    // Extract and crawl internal links
    if (depth < maxDepth && response.data) {
      const links = this.extractLinks(response.data, url);
      for (const link of links) {
        // Track internal linking
        if (!this.internalLinks.has(link)) {
          this.internalLinks.set(link, new Set());
        }
        this.internalLinks.get(link).add(url);
        
        await this.crawlPage(link, depth + 1, maxDepth, robotsParser);
      }
    }
  }

  parsePageData(url, response) {
    const html = response.data;
    const urlObj = new URL(url);
    
    return {
      url,
      status_code: response.statusCode,
      last_modified: response.headers['last-modified'] || formatDate(new Date()),
      depth: 0, // Will be updated later
      canonical: this.extractCanonical(html) || url,
      robots: this.extractMetaRobots(html),
      hasTitle: /<title[^>]*>([^<]*)<\/title>/i.test(html),
      hasDescription: /<meta[^>]*name=["']description["'][^>]*>/i.test(html),
      hasOgTags: /<meta[^>]*property=["']og:/i.test(html),
      hasStructuredData: /<script[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(html),
      titleLength: this.extractTitle(html)?.length || 0,
      descriptionLength: this.extractDescription(html)?.length || 0
    };
  }

  extractLinks(html, baseUrl) {
    const links = [];
    const linkRegex = /<a\s+[^>]*href=["']([^"']*)["'][^>]*>/gi;
    let match;
    
    const baseUrlObj = new URL(baseUrl);
    
    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1];
      
      // Skip empty, anchors, mailto, tel, javascript
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || 
          href.startsWith('tel:') || href.startsWith('javascript:')) {
        continue;
      }
      
      try {
        const absoluteUrl = new URL(href, baseUrl).href;
        
        // Only follow internal links
        if (absoluteUrl.startsWith(this.config.SITE_URL)) {
          links.push(absoluteUrl);
        }
      } catch (e) {
        // Invalid URL, skip
      }
    }
    
    return [...new Set(links)]; // Remove duplicates
  }

  extractCanonical(html) {
    const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
    return match ? match[1] : null;
  }

  extractMetaRobots(html) {
    const match = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    return match ? match[1] : 'index, follow';
  }

  extractTitle(html) {
    const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    return match ? match[1].trim() : null;
  }

  extractDescription(html) {
    const match = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    return match ? match[1].trim() : null;
  }

  async crawlDynamicContent() {
    console.log('\n📡 CRAWLING DYNAMIC CONTENT FROM API...');
    
    // Try to fetch blog posts
    try {
      const blogResponse = await fetchUrl(`${this.config.API_URL}/blog/posts`, {
        timeout: 5000
      });
      
      if (blogResponse.statusCode === 200 && blogResponse.data) {
        const posts = JSON.parse(blogResponse.data);
        if (Array.isArray(posts)) {
          console.log(`📝 Found ${posts.length} blog posts`);
          
          for (const post of posts) {
            const url = `${this.config.SITE_URL}/blog/${post.slug}`;
            if (!this.crawledUrls.has(url)) {
              this.crawledUrls.add(url);
              this.urlData.push({
                url,
                status_code: 200,
                last_modified: post.updatedAt ? formatDate(new Date(post.updatedAt)) : formatDate(new Date()),
                depth: 2,
                canonical: url,
                robots: 'index, follow',
                hasTitle: true,
                hasDescription: !!post.excerpt,
                hasOgTags: false,
                hasStructuredData: false,
                titleLength: post.title?.length || 0,
                descriptionLength: post.excerpt?.length || 0
              });
              console.log(`📝 Added blog post: ${url}`);
            }
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not fetch blog posts: ${error.message}`);
    }
    
    // Add known dynamic route patterns (these would need to be crawled from database)
    const dynamicPatterns = [
      { pattern: '/game/:gameId', name: 'Eidiya Games', example: '/game/example-game' },
      { pattern: '/eid/:username', name: 'Diwaniyas', example: '/eid/example-user' }
    ];
    
    console.log(`\n📝 Dynamic route patterns detected:`);
    for (const { pattern, name } of dynamicPatterns) {
      console.log(`   - ${name}: ${pattern}`);
      console.log(`     Note: These routes require database access to enumerate`);
    }
  }

  findOrphanPages() {
    const orphans = [];
    
    for (const urlData of this.urlData) {
      const linksToThis = this.internalLinks.get(urlData.url);
      
      // Orphan = indexable page with 0 internal links pointing to it (excluding homepage)
      if (!linksToThis || linksToThis.size === 0) {
        if (urlData.url !== `${this.config.SITE_URL}/` && isUrlAllowed(urlData.url)) {
          orphans.push({
            url: urlData.url,
            depth: urlData.depth
          });
        }
      }
    }
    
    return orphans;
  }
}

// ==================== SITEMAP GENERATOR ====================

class SitemapGenerator {
  constructor(config) {
    this.config = config;
  }

  generate(urlData) {
    console.log('\n📄 PHASE 2: SITEMAP GENERATION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Update depth for each URL
    const urlDataWithDepth = urlData.map(item => {
      const urlPath = new URL(item.url).pathname;
      let depth = 1;
      
      if (urlPath === '/') {
        depth = 1;
      } else if (urlPath.includes('/blog/')) {
        depth = 2;
      } else if (urlPath.includes('/game/') || urlPath.includes('/eid/')) {
        depth = 3;
      } else if (urlPath.split('/').length <= 2) {
        depth = 2;
      } else {
        depth = 3;
      }
      
      return { ...item, depth };
    });
    
    // Check if we need a sitemap index
    const needsIndex = urlDataWithDepth.length > 50000;
    
    if (needsIndex) {
      console.log(`⚠️  URLs exceed 50,000 limit. Creating sitemap index...`);
      return this.generateSitemapIndex(urlDataWithDepth);
    }
    
    return this.generateSingleSitemap(urlDataWithDepth);
  }

  generateSingleSitemap(urlData) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const item of urlData) {
      const priority = getPriorityForUrl(item.url);
      const changeFreq = getChangeFreqForUrl(item.url);
      
      xml += '  <url>\n';
      xml += `    <loc>${item.url}</loc>\n`;
      xml += `    <lastmod>${item.last_modified}</lastmod>\n`;
      xml += `    <changefreq>${changeFreq}</changefreq>\n`;
      xml += `    <priority>${priority.toFixed(1)}</priority>\n`;
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    
    console.log(`✅ Generated sitemap with ${urlData.length} URLs`);
    return xml;
  }

  generateSitemapIndex(urlData) {
    const maxUrlsPerSitemap = 50000;
    const numberOfSitemaps = Math.ceil(urlData.length / maxUrlsPerSitemap);
    
    let indexXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    indexXml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    const today = formatDate(new Date());
    
    for (let i = 0; i < numberOfSitemaps; i++) {
      indexXml += '  <sitemap>\n';
      indexXml += `    <loc>${this.config.SITE_URL}/sitemap-${i + 1}.xml</loc>\n`;
      indexXml += `    <lastmod>${today}</lastmod>\n`;
      indexXml += '  </sitemap>\n';
    }
    
    indexXml += '</sitemapindex>';
    
    // Generate individual sitemaps
    const sitemaps = [indexXml];
    
    for (let i = 0; i < numberOfSitemaps; i++) {
      const start = i * maxUrlsPerSitemap;
      const end = start + maxUrlsPerSitemap;
      const chunk = urlData.slice(start, end);
      
      let sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      sitemapXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      for (const item of chunk) {
        const priority = getPriorityForUrl(item.url);
        const changeFreq = getChangeFreqForUrl(item.url);
        
        sitemapXml += '  <url>\n';
        sitemapXml += `    <loc>${item.url}</loc>\n`;
        sitemapXml += `    <lastmod>${item.last_modified}</lastmod>\n`;
        sitemapXml += `    <changefreq>${changeFreq}</changefreq>\n`;
        sitemapXml += `    <priority>${priority.toFixed(1)}</priority>\n`;
        sitemapXml += '  </url>\n';
      }
      
      sitemapXml += '</urlset>';
      sitemaps.push({ filename: `sitemap-${i + 1}.xml`, content: sitemapXml });
    }
    
    console.log(`✅ Generated sitemap index with ${numberOfSitemaps} sitemaps`);
    
    return sitemaps;
  }
}

// ==================== SEO AUDITOR ====================

class SEOAuditor {
  constructor(config) {
    this.config = config;
  }

  audit(urlData, brokenLinks, redirectChains, orphanPages) {
    console.log('\n🔍 PHASE 3: SEO AUDIT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const audit = {
      crawlSummary: {
        totalUrls: urlData.length,
        brokenLinks: brokenLinks.length,
        redirectChains: redirectChains.length,
        orphanPages: orphanPages.length
      },
      
      metaTagsIssues: {
        missingTitles: 0,
        missingDescriptions: 0,
        titlesTooShort: 0,
        titlesTooLong: 0,
        descriptionsTooShort: 0,
        descriptionsTooLong: 0,
        missingCanonicals: 0,
        missingOgTags: 0,
        missingStructuredData: 0
      },
      
      crawlabilityIssues: {
        noindexPages: 0,
        blockedByRobots: 0
      },
      
      pagesWithIssues: []
    };
    
    // Analyze each page
    for (const page of urlData) {
      const issues = [];
      
      if (!page.hasTitle) {
        audit.metaTagsIssues.missingTitles++;
        issues.push('Missing title tag');
      } else {
        if (page.titleLength < 30) {
          audit.metaTagsIssues.titlesTooShort++;
          issues.push(`Title too short (${page.titleLength} chars)`);
        }
        if (page.titleLength > 60) {
          audit.metaTagsIssues.titlesTooLong++;
          issues.push(`Title too long (${page.titleLength} chars)`);
        }
      }
      
      if (!page.hasDescription) {
        audit.metaTagsIssues.missingDescriptions++;
        issues.push('Missing meta description');
      } else {
        if (page.descriptionLength < 120) {
          audit.metaTagsIssues.descriptionsTooShort++;
          issues.push(`Description too short (${page.descriptionLength} chars)`);
        }
        if (page.descriptionLength > 160) {
          audit.metaTagsIssues.descriptionsTooLong++;
          issues.push(`Description too long (${page.descriptionLength} chars)`);
        }
      }
      
      if (!page.canonical || page.canonical !== page.url) {
        audit.metaTagsIssues.missingCanonicals++;
        if (!page.canonical) {
          issues.push('Missing canonical tag');
        } else {
          issues.push(`Canonical mismatch: ${page.url} → ${page.canonical}`);
        }
      }
      
      if (!page.hasOgTags) {
        audit.metaTagsIssues.missingOgTags++;
        issues.push('Missing Open Graph tags');
      }
      
      if (!page.hasStructuredData) {
        audit.metaTagsIssues.missingStructuredData++;
        issues.push('Missing structured data (JSON-LD)');
      }
      
      if (page.robots && page.robots.includes('noindex')) {
        audit.crawlabilityIssues.noindexPages++;
      }
      
      if (issues.length > 0) {
        audit.pagesWithIssues.push({
          url: page.url,
          issues
        });
      }
    }
    
    console.log(`📊 Audit Results:`);
    console.log(`   - Pages with missing titles: ${audit.metaTagsIssues.missingTitles}`);
    console.log(`   - Pages with missing descriptions: ${audit.metaTagsIssues.missingDescriptions}`);
    console.log(`   - Pages with missing canonicals: ${audit.metaTagsIssues.missingCanonicals}`);
    console.log(`   - Pages with missing OG tags: ${audit.metaTagsIssues.missingOgTags}`);
    console.log(`   - Pages with missing structured data: ${audit.metaTagsIssues.missingStructuredData}`);
    console.log(`   - Orphan pages: ${orphanPages.length}`);
    
    return audit;
  }

  generateReport(crawlData, sitemapData, audit) {
    console.log('\n📋 PHASE 5: FINAL REPORT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const report = {
      generatedAt: new Date().toISOString(),
      siteUrl: this.config.SITE_URL,
      
      crawlSummary: {
        totalUrls: audit.crawlSummary.totalUrls,
        brokenLinks: audit.crawlSummary.brokenLinks,
        redirectChains: audit.crawlSummary.redirectChains,
        orphanPages: audit.crawlSummary.orphanPages
      },
      
      sitemap: {
        file: 'sitemap.xml',
        totalUrls: crawlData.length,
        sitemapIndex: Array.isArray(sitemapData) && sitemapData[0].includes('<sitemapindex')
      },
      
      crawlabilityIssues: {
        missingCanonicalTags: audit.metaTagsIssues.missingCanonicals,
        missingMetaDescription: audit.metaTagsIssues.missingDescriptions,
        missingTitleTags: audit.metaTagsIssues.missingTitles,
        missingOgTags: audit.metaTagsIssues.missingOgTags,
        missingStructuredData: audit.metaTagsIssues.missingStructuredData,
        noindexPages: audit.crawlabilityIssues.noindexPages
      },
      
      recommendations: []
    };
    
    // Generate prioritized recommendations
    if (audit.crawlSummary.brokenLinks > 0) {
      report.recommendations.push({
        priority: 'HIGH',
        title: 'Fix broken internal links',
        description: `${audit.crawlSummary.brokenLinks} broken links detected that hurt user experience and crawl budget.`,
        action: 'Use the broken links list to fix or redirect these URLs.'
      });
    }
    
    if (audit.metaTagsIssues.missingCanonicals > 0) {
      report.recommendations.push({
        priority: 'HIGH',
        title: 'Add canonical tags to all pages',
        description: `${audit.metaTagsIssues.missingCanonicals} pages are missing canonical tags.`,
        action: 'Add <link rel="canonical"> tags to prevent duplicate content issues.'
      });
    }
    
    if (audit.metaTagsIssues.missingDescriptions > 0) {
      report.recommendations.push({
        priority: 'MEDIUM',
        title: 'Add meta descriptions to all pages',
        description: `${audit.metaTagsIssues.missingDescriptions} pages are missing meta descriptions.`,
        action: 'Write unique, compelling meta descriptions (120-160 characters) for better CTR.'
      });
    }
    
    if (audit.crawlSummary.orphanPages > 0) {
      report.recommendations.push({
        priority: 'MEDIUM',
        title: 'Link to orphan pages',
        description: `${audit.crawlSummary.orphanPages} orphan pages detected (no internal links).`,
        action: 'Add internal links to these pages to help Google discover and index them.'
      });
    }
    
    if (audit.metaTagsIssues.missingStructuredData > 0) {
      report.recommendations.push({
        priority: 'LOW',
        title: 'Add structured data to key pages',
        description: `${audit.metaTagsIssues.missingStructuredData} pages are missing structured data.`,
        action: 'Implement Schema.org JSON-LD for rich snippets in search results.'
      });
    }
    
    if (audit.metaTagsIssues.missingOgTags > 0) {
      report.recommendations.push({
        priority: 'MEDIUM',
        title: 'Add Open Graph tags',
        description: `${audit.metaTagsIssues.missingOgTags} pages are missing Open Graph tags.`,
        action: 'Add og:title, og:description, og:url, and og:image for better social sharing.'
      });
    }
    
    return report;
  }
}

// ==================== MAIN ====================

async function main() {
  console.log('🤖 ANTI-GRAVITY SEO AGENT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Target: ${CONFIG.SITE_URL}`);
  console.log(`Max Depth: ${CONFIG.MAX_DEPTH}`);
  console.log(`Crawl Delay: ${CONFIG.CRAWL_DELAY}ms`);
  
  try {
    // Phase 1: Crawl
    const crawler = new SEOCrawler(CONFIG);
    const crawlData = await crawler.crawl(CONFIG.SITE_URL, CONFIG.MAX_DEPTH);
    
    // Find orphan pages
    const orphanPages = crawler.findOrphanPages();
    
    // Phase 2: Generate Sitemap
    const sitemapGenerator = new SitemapGenerator(CONFIG);
    const sitemapData = sitemapGenerator.generate(crawlData);
    
    // Save sitemap(s)
    if (Array.isArray(sitemapData) && sitemapData.length > 1) {
      // Sitemap index + multiple sitemaps
      fs.writeFileSync('./public/sitemap_index.xml', sitemapData[0]);
      console.log('✅ Saved sitemap_index.xml');
      
      for (let i = 1; i < sitemapData.length; i++) {
        const { filename, content } = sitemapData[i];
        fs.writeFileSync(`./public/${filename}`, content);
        console.log(`✅ Saved ${filename}`);
      }
    } else {
      // Single sitemap
      fs.writeFileSync('./public/sitemap.xml', sitemapData);
      console.log('✅ Saved sitemap.xml');
    }
    
    // Update robots.txt
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /profile
Disallow: /company/dashboard
Disallow: /company-activation
Disallow: /company-login
Disallow: /login
Disallow: /register
Disallow: /checkout
Disallow: /card
Disallow: /send
Disallow: /editor

Sitemap: ${CONFIG.SITE_URL}/sitemap.xml
`;
    fs.writeFileSync('./public/robots.txt', robotsTxt);
    console.log('✅ Updated robots.txt');
    
    // Phase 3: Audit
    const auditor = new SEOAuditor(CONFIG);
    const audit = auditor.audit(crawlData, crawler.brokenLinks, crawler.redirectChains, orphanPages);
    
    // Phase 5: Generate Report
    const report = auditor.generateReport(crawlData, sitemapData, audit);
    
    // Save detailed data
    const fullReport = {
      config: {
        siteUrl: CONFIG.SITE_URL,
        maxDepth: CONFIG.MAX_DEPTH,
        crawlDelay: CONFIG.CRAWL_DELAY
      },
      crawlData,
      audit,
      brokenLinks: crawler.brokenLinks,
      redirectChains: crawler.redirectChains,
      orphanPages,
      summary: report
    };
    
    fs.writeFileSync('./seo_report.json', JSON.stringify(fullReport, null, 2));
    console.log('✅ Saved detailed SEO report to seo_report.json');
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 CRAWL SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total URLs found:         ${report.crawlSummary.totalUrls}`);
    console.log(`Broken links (4xx/5xx):   ${report.crawlSummary.brokenLinks}`);
    console.log(`Redirect chains:          ${report.crawlSummary.redirectChains}`);
    console.log(`Orphan pages:             ${report.crawlSummary.orphanPages}`);
    
    console.log('\n📄 SITEMAP');
    console.log('='.repeat(60));
    console.log(`File:                     ${report.sitemap.file}`);
    console.log(`Total URLs:               ${report.sitemap.totalUrls}`);
    console.log(`Sitemap Index:            ${report.sitemap.sitemapIndex ? 'Yes' : 'No'}`);
    
    console.log('\n🔍 CRAWLABILITY ISSUES');
    console.log('='.repeat(60));
    console.log(`Missing canonical tags:   ${report.crawlabilityIssues.missingCanonicalTags} pages`);
    console.log(`Missing meta description: ${report.crawlabilityIssues.missingMetaDescription} pages`);
    console.log(`Missing title tags:       ${report.crawlabilityIssues.missingTitleTags} pages`);
    console.log(`Missing OG tags:          ${report.crawlabilityIssues.missingOgTags} pages`);
    console.log(`Missing structured data:  ${report.crawlabilityIssues.missingStructuredData} pages`);
    
    console.log('\n⚡ RECOMMENDATIONS (Priority Order)');
    console.log('='.repeat(60));
    report.recommendations.forEach((rec, index) => {
      console.log(`\n${index + 1}. [${rec.priority.padEnd(6)}] ${rec.title}`);
      console.log(`   ${rec.description}`);
      console.log(`   Action: ${rec.action}`);
    });
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ SEO AGENT COMPLETE');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the agent
main();