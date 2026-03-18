@echo off
cd /d "c:\Users\abdel\Desktop\تهنئة العيد"
node --check server/routes/paymob-flash.js
if errorlevel 1 exit /b 1
node --check server/utils/paymob-flash.js
if errorlevel 1 exit /b 1
npm run build
