@echo off
title DSA IDE — Striver A2Z
color 0A
cls

echo.
echo   =============================================
echo      ⚡  DSA IDE  —  Striver A2Z DSA Sheet
echo   =============================================
echo.

cd /d d:\Stirver_A2Z_DSA\dsa_ide

if not exist node_modules (
    echo   Installing dependencies (only first time)...
    echo.
    call npm install --silent
    if errorlevel 1 (
        echo   ERROR: npm install failed. Make sure Node.js is installed.
        pause
        exit /b 1
    )
    echo   Done!
    echo.
)

echo   Starting DSA IDE server...
echo   Browser: http://localhost:3456
echo   Press Ctrl+C to stop
echo.
echo   =============================================
echo.

timeout /t 1 /nobreak > nul
start "" "http://localhost:3456"
node server.js
