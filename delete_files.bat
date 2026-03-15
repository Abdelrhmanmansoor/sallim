@echo off
setlocal enabledelayedexpansion

echo Attempting to delete files...

REM Try to delete each file
if exist "c:\Users\abdel\Desktop\تهنئة العيد\fix_arabic.js" (
    del "c:\Users\abdel\Desktop\تهنئة العيد\fix_arabic.js" && echo DELETED: fix_arabic.js || echo FAILED: fix_arabic.js
) else (
    echo NOT FOUND: fix_arabic.js
)

if exist "c:\Users\abdel\Desktop\تهنئة العيد\fix_arabic.py" (
    del "c:\Users\abdel\Desktop\تهنئة العيد\fix_arabic.py" && echo DELETED: fix_arabic.py || echo FAILED: fix_arabic.py
) else (
    echo NOT FOUND: fix_arabic.py
)

if exist "c:\Users\abdel\Desktop\تهنئة العيد\tempfix.js" (
    del "c:\Users\abdel\Desktop\تهنئة العيد\tempfix.js" && echo DELETED: tempfix.js || echo FAILED: tempfix.js
) else (
    echo NOT FOUND: tempfix.js
)

if exist "c:\Users\abdel\Desktop\تهنئة العيد\tempfix.py" (
    del "c:\Users\abdel\Desktop\تهنئة العيد\tempfix.py" && echo DELETED: tempfix.py || echo FAILED: tempfix.py
) else (
    echo NOT FOUND: tempfix.py
)

if exist "c:\Users\abdel\Desktop\fix_arabic.js" (
    del "c:\Users\abdel\Desktop\fix_arabic.js" && echo DELETED: fix_arabic.js (Desktop root) || echo FAILED: fix_arabic.js (Desktop root)
) else (
    echo NOT FOUND: fix_arabic.js (Desktop root)
)

if exist "c:\Users\abdel\Desktop\fix_arabic.py" (
    del "c:\Users\abdel\Desktop\fix_arabic.py" && echo DELETED: fix_arabic.py (Desktop root) || echo FAILED: fix_arabic.py (Desktop root)
) else (
    echo NOT FOUND: fix_arabic.py (Desktop root)
)

echo.
echo Deletion process completed
pause
