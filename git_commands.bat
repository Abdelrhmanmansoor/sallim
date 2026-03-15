@echo off
chcp 65001 > nul
cd /d "c:\Users\abdel\Desktop\تهنئة العيد"
echo === Running git add -A ===
git add -A
echo.
echo === Running git commit ===
git commit -m "fix: PayPal ENV default to live + better error logging

- Changed PAYPAL_ENV default from sandbox to live (live client ID was hitting sandbox API)
- Added detailed error logging for PayPal token and API errors
- Server /paypal/create now returns detail and paypalError fields
- Frontend createOrder shows actual error detail in console
- Added startup log showing PayPal config status

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
echo.
echo === Running git push ===
git push
