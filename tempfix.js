// Node.js script to fix garbled Arabic text in EditorPage.jsx
const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, 'src', 'pages', 'EditorPage.jsx');
let lines = fs.readFileSync(filepath, 'utf-8').split('\n');

const replacements = {
    4044: ['fontSize: 16, fontWeight: 700 }}>', '</h3>', 'التنسيق'],
    4045: ["fontSize: 12, color: '#888' }}>", '</p>', 'الخط والألوان والتأثيرات'],
    4068: ["fontWeight: 700, display: 'block', marginBottom: 14 }}>", '</label>', 'ألوان النصوص'],
    4083: ["fontSize: 13, fontWeight: 600 }}>", '</span>', 'ظل النص'],
    4094: ["fontSize: 13, fontWeight: 600 }}>", '</span>', 'حدود النص'],
    4106: ["fontSize: 13, fontWeight: 600 }}>", '</span>', 'سمك الحدود'],
    4110: ['store.setTextStrokeColor} label="', '" />', 'اللون'],
    4117: ["fontSize: 13, fontWeight: 600 }}>", '</span>', 'طبقة لونية'],
};

let fixed = 0;
for (const [lineIdx, [beforeMarker, afterMarker, correctText]] of Object.entries(replacements)) {
    const line = lines[lineIdx];
    const beforePos = line.indexOf(beforeMarker);
    const afterPos = line.indexOf(afterMarker);
    if (beforePos !== -1 && afterPos !== -1) {
        const start = beforePos + beforeMarker.length;
        const end = afterPos;
        lines[lineIdx] = line.substring(0, start) + correctText + line.substring(end);
        console.log(`Fixed line ${parseInt(lineIdx) + 1}`);
        fixed++;
    } else {
        console.log(`WARNING: Could not fix line ${parseInt(lineIdx) + 1} - markers not found`);
        console.log(`  beforeMarker: ${beforeMarker}`);
        console.log(`  line snippet: ${line.substring(0, 100)}`);
    }
}

fs.writeFileSync(filepath, lines.join('\n'), 'utf-8');
console.log(`Done! Fixed ${fixed}/8 lines.`);
