@echo off
setlocal enabledelayedexpansion

set "source1=c:\Users\abdel\AppData\Roaming\Code\User\globalStorage\github.copilot-chat\copilot-cli-images\1773564571992-aum37y89.png"
set "dest1=c:\Users\abdel\Desktop\تهنئة العيد\public\images\banner-mobile.png"
set "source2=c:\Users\abdel\AppData\Roaming\Code\User\globalStorage\github.copilot-chat\copilot-cli-images\1773564571992-d70z7iti.png"
set "dest2=c:\Users\abdel\Desktop\تهنئة العيد\public\images\banner-desktop.png"

copy "!source1!" "!dest1!"
if errorlevel 1 (
    echo Error copying file 1
    exit /b 1
)

copy "!source2!" "!dest2!"
if errorlevel 1 (
    echo Error copying file 2
    exit /b 1
)

echo.
echo Both files copied successfully!
echo - banner-mobile.png
echo - banner-desktop.png
