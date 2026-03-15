#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Use the environment variable or direct path
const baseDir = process.cwd();
const files = ['fix_arabic.js', 'fix_arabic.py', 'tempfix.js', 'tempfix.py'];

console.log('Deleting files from:', baseDir, '\n');

const results = {
  deleted: [],
  notFound: [],
  errors: []
};

files.forEach(file => {
  const filePath = path.join(baseDir, file);
  try {
    fs.unlinkSync(filePath);
    results.deleted.push(file);
    console.log(`✓ DELETED: ${file}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      results.notFound.push(file);
      console.log(`✗ NOT FOUND: ${file}`);
    } else {
      results.errors.push({ file, error: err.message });
      console.log(`✗ ERROR (${file}): ${err.message}`);
    }
  }
});

console.log('\n--- SUMMARY ---');
console.log(`Deleted: ${results.deleted.length}`);
results.deleted.forEach(f => console.log(`  - ${f}`));
console.log(`Not found: ${results.notFound.length}`);
results.notFound.forEach(f => console.log(`  - ${f}`));
if (results.errors.length > 0) {
  console.log(`Errors: ${results.errors.length}`);
  results.errors.forEach(e => console.log(`  - ${e.file}: ${e.error}`));
}
