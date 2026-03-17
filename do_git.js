const { execSync } = require('child_process')
const dir = __dirname

const msg = `fix: GreetPage Eid design + image encoding + deduplicate export + credit deduction

- Remove duplicate export default GreetPage function
- Add safeEncodeUrl for Arabic path segments in template image URLs
- Dark gradient Eid background with floating particle animation
- EidBackground component with blurred orbs and floating stars/crescents
- loadImageForCanvas uses fetch->blob to avoid tainted canvas CORS issues
- resolveImg converts relative template URLs to absolute sallim.co URLs
- POST /greet-links/:shortId/record endpoint for credit deduction
- customCompanyName field in GreetLink model, dashboard, and API
- Hide navbar/footer/WhatsApp on /g/:shortId routes in App.jsx
- Company dashboard: handleCreateLink/handleGenerateIndividual save to backend

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>`

try {
  console.log('>> git add -A')
  execSync('git add -A', { cwd: dir, stdio: 'inherit' })
  console.log('>> git commit')
  execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, { cwd: dir, stdio: 'inherit' })
  console.log('>> git push')
  execSync('git push', { cwd: dir, stdio: 'inherit' })
  console.log('DONE')
} catch (e) {
  console.error('ERROR:', e.message)
  process.exit(1)
}
