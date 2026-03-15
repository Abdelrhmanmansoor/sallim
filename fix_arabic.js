const fs = require('fs');
const path = require('path');

const filePath = 'c:\\Users\\abdel\\Desktop\\تهنئة العيد\\src\\pages\\EditorPage.jsx';

// Read file as UTF-8
console.log('Reading file...');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log(`Total lines: ${lines.length}\n`);

// Define the fixes with line numbers and correct content
const fixes = [
  {
    lineNum: 4045,
    correctContent: '            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>التنسيق</h3>',
    correctArabic: 'التنسيق'
  },
  {
    lineNum: 4046,
    correctContent: '            <p style={{ margin: 0, fontSize: 12, color: \'#888\' }}>الخط والألوان والتأثيرات</p>',
    correctArabic: 'الخط والألوان والتأثيرات'
  },
  {
    lineNum: 4052,
    correctArabic: 'الخط',
    checkOnly: true
  },
  {
    lineNum: 4069,
    correctArabic: 'ألوان النصوص',
    checkOnly: true
  },
  {
    lineNum: 4071,
    correctArabic: 'الرئيسي',
    checkOnly: true
  },
  {
    lineNum: 4072,
    correctArabic: 'الفرعي',
    checkOnly: true
  },
  {
    lineNum: 4073,
    correctArabic: 'المستلم',
    checkOnly: true
  },
  {
    lineNum: 4074,
    correctArabic: 'المرسل',
    checkOnly: true
  },
  {
    lineNum: 4080,
    correctArabic: 'التأثيرات',
    checkOnly: true
  },
  {
    lineNum: 4084,
    correctArabic: 'ظل النص',
    checkOnly: true
  },
  {
    lineNum: 4095,
    correctArabic: 'حدود النص',
    checkOnly: true
  },
  {
    lineNum: 4107,
    correctArabic: 'سمك الحدود',
    checkOnly: true
  },
  {
    lineNum: 4111,
    correctArabic: 'اللون',
    checkOnly: true
  },
  {
    lineNum: 4118,
    correctArabic: 'طبقة لونية',
    checkOnly: true
  }
];

let modified = false;
const changedLines = [];

// Apply fixes
for (const fix of fixes) {
  const idx = fix.lineNum - 1; // Convert to 0-indexed
  const currentLine = lines[idx];
  
  if (fix.checkOnly) {
    // Just check if the correct text exists
    if (currentLine.includes(fix.correctArabic)) {
      console.log(`✓ Line ${fix.lineNum}: Already has correct text "${fix.correctArabic}"`);
    } else {
      console.log(`✗ Line ${fix.lineNum}: Missing correct text`);
      console.log(`  Current: ${currentLine.substring(0, 80)}`);
      console.log(`  Expected: "${fix.correctArabic}"\n`);
    }
  } else {
    // Replace the full line
    if (currentLine !== fix.correctContent) {
      console.log(`Fixing line ${fix.lineNum}...`);
      lines[idx] = fix.correctContent;
      modified = true;
      changedLines.push(fix.lineNum);
    } else {
      console.log(`✓ Line ${fix.lineNum}: Already correct`);
    }
  }
}

if (modified) {
  console.log(`\n✓ Modified ${changedLines.length} lines: ${changedLines.join(', ')}`);
  console.log('Writing file back as UTF-8...');
  
  const newContent = lines.join('\n');
  fs.writeFileSync(filePath, newContent, { encoding: 'utf8' });
  console.log('✓ File written successfully\n');
} else {
  console.log('\n✓ No modifications needed\n');
}

// Verify by reading lines 4038-4130
console.log('=== VERIFICATION: Lines 4038-4130 ===\n');
const verifyStart = 4037; // 0-indexed
const verifyEnd = 4130;

for (let i = verifyStart; i < verifyEnd && i < lines.length; i++) {
  const lineNum = i + 1;
  // Highlight the target lines
  const isTarget = [4045, 4046, 4052, 4069, 4071, 4072, 4073, 4074, 4080, 4084, 4095, 4107, 4111, 4118].includes(lineNum);
  if (isTarget) {
    console.log(`>>> Line ${lineNum}:`);
    console.log(`    ${lines[i]}`);
  }
}

console.log('\n✓ Script completed');
