@echo off
title Striver A2Z DSA - Backend Sync Server
color 0A
echo ========================================================
echo   Striver A2Z DSA - Chrome Extension Sync Backend Server
echo ========================================================
echo.
echo Starting local sync server on http://localhost:3456...
echo.

cd /d "%~dp0dsa_ide"

if not exist node_modules (
    echo Installing node dependencies...
    npm install
)

node server.js

pause
