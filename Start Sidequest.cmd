@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is required for the local server.
  echo You can also open dist\index.html directly in your browser.
  pause
  exit /b 1
)
echo Open http://localhost:4173 in your browser.
echo Keep this window open while using Sidequest. Press Ctrl+C to stop.
node scripts\serve.mjs
pause
