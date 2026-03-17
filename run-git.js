const { execSync } = require('child_process');
const path = require('path');

const dir = `c:\\Users\\abdel\\Desktop\\تهنئة العيد`;
const options = {
  cwd: dir,
  encoding: 'utf-8',
  stdio: 'pipe'
};

try {
  console.log('=== Running git add -A ===');
  const addOutput = execSync('git add -A', options);
  console.log(addOutput || '(no output)');

  console.log('\n=== Running git commit ===');
  const commitOutput = execSync(`git commit -m "feat: short greet links /g/:shortId stored in MongoDB\n\n- Add GreetLink model with shortId, templateImage, font, etc.\n- POST /company/greet-links (auth) creates short link, returns shortId\n- GET /company/greet-links/:shortId (public) returns full settings\n- Add /g/:shortId route to App.jsx\n- GreetPage now fetches all settings from API by shortId\n- Fix canvas image loading: use offscreen canvas + encodeURI\n- Fix template not found for custom/DB templates\n- EmployeeLinkView saves to backend and generates clean short URL\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"`, options);
  console.log(commitOutput || '(no output)');

  console.log('\n=== Running git push ===');
  const pushOutput = execSync('git push', options);
  console.log(pushOutput || '(no output)');

  console.log('\n✅ All git commands completed successfully!');
} catch (error) {
  console.error('❌ Error executing git commands:');
  console.error('STDOUT:', error.stdout);
  console.error('STDERR:', error.stderr);
  console.error('Message:', error.message);
  process.exit(1);
}
