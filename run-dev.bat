@echo off
set "PATH=D:\nodejs;%PATH%"
set "TEMP=D:\temp"
set "TMP=D:\temp"
set "npm_config_cache=D:\npm-cache"
set "NODE_OPTIONS=--max-old-space-size=2048"

echo ========================================================
echo   SelenSync - Next.js Development Server (Port 3000)
echo ========================================================
echo Node version:
node -v
echo.
echo Starting server on http://localhost:3000 ...
cd /d "%~dp0"
node node_modules\next\dist\bin\next dev --disable-source-maps
pause
