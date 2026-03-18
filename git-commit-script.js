#!/usr/bin/env node

import { execSync } from 'child_process';

const projectDir = 'c:\\Users\\abdel\\Desktop\\تهنئة العيد';

function runCommand(cmd, description) {
  console.log(`\n>>> ${description}`);
  console.log(`Command: ${cmd}`);
  try {
    const output = execSync(cmd, { 
      cwd: projectDir,
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    console.log(output);
    return output;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.stdout) console.log('STDOUT:', error.stdout);
    if (error.stderr) console.log('STDERR:', error.stderr);
    throw error;
  }
}

try {
  // 1. Check git status
  console.log('=== Step 1: Check Git Status ===');
  runCommand('git status', 'Checking git status');

  // 2. Add all changes
  console.log('\n=== Step 2: Add All Changes ===');
  runCommand('git add .', 'Adding all changes');

  // 3. Commit with Arabic message and co-author
  console.log('\n=== Step 3: Create Commit ===');
  const commitMessage = `إصلاح مشكلة السعر 0 في صفحة الدفع - دعم الباقات

- إضافة دعم لأنواع الباقات (starter, business, enterprise)
- إصلاح عدم ظهور السعر عند الانتقال من صفحة التسعير
- تحسين منطق تحديد نوع المنتج في Paymob و PayPal

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`;
  
  runCommand(`git commit -m "${commitMessage.split('\n')[0]}" -m "${commitMessage.split('\n').slice(1).join('\n')}"`, 'Creating commit with Arabic message and co-author');

  // 4. Push to remote
  console.log('\n=== Step 4: Push to Remote ===');
  runCommand('git push', 'Pushing changes to remote');

  console.log('\n=== All steps completed successfully! ===');
} catch (error) {
  console.error('\n=== Error occurred ===');
  process.exit(1);
}
