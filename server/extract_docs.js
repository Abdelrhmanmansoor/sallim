import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateDocs() {
    const md = [];
    md.push('# دليل واجهة برمجة التطبيقات (API Reference) وقاعدة البيانات');
    md.push('هذا الملف يحتوي على جميع الـ Endpoints الخاصة بالمشروع بالإضافة إلى هيكل قاعدة البيانات (Models) لإنشاء لوحة تحكم شاملة للمنصة.\\n');

    // 1. Parse Routes
    md.push('## 🌐 الـ Endpoints (API Routes)');
    const routesDir = path.join(__dirname, 'routes');
    const routeFiles = fs.readdirSync(routesDir).filter(f => f.endsWith('.js'));

    const routeMounts = {
        'cards.js': '/api/v1/cards',
        'stats.js': '/api/v1/stats',
        'admin.js': '/api/v1/admin',
        'admin-invite-codes.js': '/api/v1/admin/invite-codes',
        'admin-companies.js': '/api/v1/admin/companies',
        'company.js': '/api/v1/company',
        'wallet.js': '/api/v1/company/wallet',
        'campaigns.js': '/api/v1/company/campaigns',
        'team.js': '/api/v1/company/team',
        'templates.js': '/api/v1/templates',
        'blog.js': '/api/v1/blog',
        'tickets.js': '/api/v1/tickets',
        'diwan.js': '/api/v1/diwan',
        'diwaniya.js': '/api/v1/diwaniya',
        'diwaniya-family.js': '/api/v1/diwaniya',
        'auth.js': '/api/v1/auth'
    };

    for (const file of routeFiles) {
        const filePath = path.join(routesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const prefix = routeMounts[file] || `/api/v1/${file.replace('.js', '')}`;

        md.push(`### 📂 ${file} (\`${prefix}\`)`);

        const lines = content.split('\\n');
        const routeRegex = /router\.(get|post|put|delete|patch)\((['"`])(.*?)\2/g;

        let match;
        const endpoints = [];
        while ((match = routeRegex.exec(content)) !== null) {
            const method = match[1].toUpperCase();
            let routePath = match[3];
            if (routePath === '/') routePath = '';
            endpoints.push(`- **${method}** \`${prefix}${routePath}\``);
        }

        if (endpoints.length > 0) {
            md.push(...endpoints);
        } else {
            md.push('- لا يوجد مسارات مباشرة أو تعذر الاستخراج');
        }
        md.push('');
    }

    // 2. Parse Models using Regex to avoid unhandled async imports issues
    md.push('## 🗄️ هيكل قاعدة البيانات (Database Models)');
    const modelsDir = path.join(__dirname, 'models');
    const modelFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith('.js'));

    for (const file of modelFiles) {
        const filePath = path.join(modelsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Naively extract schema definition body
        md.push(`### 📄 ${file.replace('.js', '')}`);
        md.push('```javascript');

        const schemaMatch = content.match(/new\\s+mongoose\\.Schema\\(\\{([\\s\\S]*?)\\}\\s*,/);
        if (schemaMatch && schemaMatch[1]) {
            // Just take the first 40 lines of the schema to avoid huge files
            const schemaLines = schemaMatch[1].trim().split('\\n');
            md.push(schemaLines.join('\\n'));
        } else {
            md.push('// Could not automatically extract schema structure');
        }

        md.push('```\\n');
    }

    fs.writeFileSync(path.join(__dirname, 'DASHBOARD_REFERENCE.md'), md.join('\\n'), 'utf-8');
    console.log('DASHBOARD_REFERENCE.md generated successfully.');
}

generateDocs().catch(console.error);
