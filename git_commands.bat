@echo off
chcp 65001 > nul
cd /d "c:\Users\abdel\Desktop\تهنئة العيد"
echo === Running git add -A ===
git add -A
echo.
echo === Running git commit ===
git commit -m "fix: GreetPage Eid design + Arabic URL encoding + short links + credit deduction

- Remove duplicate export default GreetPage (was causing build error)
- safeEncodeUrl: properly encode Arabic path segments in template URLs
- loadImageForCanvas: fetch->blob approach to avoid tainted canvas CORS
- resolveImg: convert relative template URLs to absolute sallim.co URLs
- Dark gradient Eid background with EidBackground animation component
- Floating particles (stars/crescents) and blurred orbs animation
- GreetLink model: shortId, templateImage, font, nameY, customCompanyName
- POST /greet-links: company auth, create short link
- GET /greet-links/:shortId: public fetch all link settings
- POST /greet-links/:shortId/record: deduct company credit
- App.jsx: hide navbar/footer/WhatsApp on /g/:shortId routes
- CompanyDashboard: save links to backend, convert relative to absolute URLs

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
echo.
echo === Running git push ===
git push
echo.
echo === DONE ===
