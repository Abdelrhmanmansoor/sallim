const fs = require('fs');
const path = 'c:\\Users\\abdel\\Desktop\\تهنئة العيد\\public\\templates\\exclusive';

try {
  fs.mkdirSync(path, { recursive: true });
  console.log('Directory created successfully at:', path);
} catch (err) {
  console.error('Error creating directory:', err.message);
  process.exit(1);
}
