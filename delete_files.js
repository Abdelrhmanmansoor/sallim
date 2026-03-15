const fs = require('fs');
const path = require('path');

const baseDir = 'c:\\Users\\abdel\\Desktop\\تهنئة العيد';
const files = ['fix_arabic.js', 'fix_arabic.py', 'tempfix.js', 'tempfix.py'];

console.log('Attempting to delete files...\n');

files.forEach(file => {
  const filePath = path.join(baseDir, file);
  try {
    fs.unlinkSync(filePath);
    console.log(`✓ DELETED: ${file}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`✗ NOT FOUND: ${file}`);
    } else {
      console.log(`✗ ERROR (${file}): ${err.message}`);
    }
  }
});

console.log('\nDone.');
