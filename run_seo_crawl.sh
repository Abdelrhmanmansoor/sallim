#!/bin/bash

# 🤖 Anti-Gravity SEO Agent - Execution Script
# This script runs the enhanced SEO agent and displays the results

echo "🤖 Starting Anti-Gravity SEO Agent..."
echo ""

# Run the enhanced SEO agent
node enhanced_seo_agent.js

# Check if the report was generated
if [ -f "seo_report.json" ]; then
    echo ""
    echo "📊 Detailed SEO Report Generated!"
    echo "📁 View the full report: seo_report.json"
    echo ""
    
    # Display key metrics using jq if available, otherwise use cat
    if command -v jq &> /dev/null; then
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "QUICK SUMMARY"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        cat seo_report.json | jq '{
            totalUrls: .crawlData | length,
            brokenLinks: (.brokenLinks | length),
            orphanPages: (.orphanPages | length),
            missingCanonicals: .audit.metaTagsIssues.missingCanonicals,
            missingDescriptions: .audit.metaTagsIssues.missingDescriptions,
            recommendations: .summary.recommendations | length
        }'
        echo ""
        echo "RECOMMENDATIONS:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        cat seo_report.json | jq -r '.summary.recommendations[] | "\(.priority) - \(.title)"'
    else
        echo "ℹ️  Install jq for formatted JSON viewing: https://stedolan.github.io/jq/"
        echo "   Or view seo_report.json in your code editor"
    fi
else
    echo "❌ Error: seo_report.json was not generated"
    exit 1
fi

echo ""
echo "✅ SEO Agent Complete!"
echo ""
echo "Next Steps:"
echo "1. Review the recommendations above"
echo "2. Check public/sitemap.xml for the generated sitemap"
echo "3. Check public/robots.txt for updated robots.txt"
echo "4. Implement the HIGH priority recommendations first"
echo "5. Submit sitemap to Google Search Console when ready"