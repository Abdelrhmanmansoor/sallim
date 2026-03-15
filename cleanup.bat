@echo off
setlocal enabledelayedexpansion

echo Deleting files...

if exist "fix_arabic.js" (
    del "fix_arabic.js"
    echo ✓ DELETED: fix_arabic.js
) else (
    echo ✗ NOT FOUND: fix_arabic.js
)

if exist "fix_arabic.py" (
    del "fix_arabic.py"
    echo ✓ DELETED: fix_arabic.py
) else (
    echo ✗ NOT FOUND: fix_arabic.py
)

if exist "tempfix.js" (
    del "tempfix.js"
    echo ✓ DELETED: tempfix.js
) else (
    echo ✗ NOT FOUND: tempfix.js
)

if exist "tempfix.py" (
    del "tempfix.py"
    echo ✓ DELETED: tempfix.py
) else (
    echo ✗ NOT FOUND: tempfix.py
)

echo.
echo Done.
pause
