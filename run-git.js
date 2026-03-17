const { execSync } = require('child_process');

const dir = `c:\\Users\\abdel\\Desktop\\تهنئة العيد`;
const options = { cwd: dir, encoding: 'utf-8', stdio: 'pipe' };

const msg = `fix: GreetPage clean design + fix image + credit deduction + custom name

- Fix template image: convert relative /templates/... to absolute URL before saving
- Fix CORS canvas: use fetch->blob on offscreen canvas
- New GreetPage: elegant minimal design, no header/footer, gradient bg
- Loading spinner replaces old loading text
- Add customCompanyName field editable when creating link
- Add POST /greet-links/:shortId/record endpoint to deduct company credit
- Return customCompanyName from GET /greet-links/:shortId
- Add customCompanyName to GreetLink model

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`;

try {
  console.log('=== git add ===');
  console.log(execSync('git add -A', options) || '(ok)');

  console.log('=== git commit ===');
  console.log(execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, options) || '(ok)');

  console.log('=== git push ===');
  console.log(execSync('git push', options) || '(ok)');

  console.log('\n✅ Done!');
} catch (e) {
  console.error('STDOUT:', e.stdout);
  console.error('STDERR:', e.stderr);
  process.exit(1);
}
