const { execSync } = require('child_process');

console.log('=== Running git commands ===\n');

try {
  console.log('--- git status ---');
  const status = execSync('git status', { encoding: 'utf-8', cwd: process.cwd() });
  console.log(status);

  console.log('\n--- git log --oneline -3 ---');
  const log = execSync('git log --oneline -3', { encoding: 'utf-8', cwd: process.cwd() });
  console.log(log);
} catch (error) {
  console.error('Error executing git commands:', error.message);
  process.exit(1);
}
