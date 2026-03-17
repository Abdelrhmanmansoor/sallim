@echo off
cd /d "c:\Users\abdel\Desktop\تهنئة العيد"
echo === Running git add -A ===
git add -A
echo.
echo === Running git commit ===
git commit -m "feat: short greet links /g/:shortId stored in MongoDB

- Add GreetLink model with shortId, templateImage, font, etc.
- POST /company/greet-links (auth) creates short link, returns shortId
- GET /company/greet-links/:shortId (public) returns full settings
- Add /g/:shortId route to App.jsx
- GreetPage now fetches all settings from API by shortId
- Fix canvas image loading: use offscreen canvas + encodeURI
- Fix template not found for custom/DB templates
- EmployeeLinkView saves to backend and generates clean short URL

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
echo.
echo === Running git push ===
git push
echo.
echo === Done ===
