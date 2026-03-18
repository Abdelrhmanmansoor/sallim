@echo off
cd /d "c:\Users\abdel\Desktop\تهنئة العيد"

echo === Step 1: Check Git Status ===
git status

echo.
echo === Step 2: Add All Changes ===
git add .

echo.
echo === Step 3: Create Commit ===
git commit -m "تهنئة العيد مبارك" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo.
echo === Step 4: Push to Remote ===
git push

echo.
echo === Completed! ===
pause
