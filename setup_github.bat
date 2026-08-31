@echo off
echo ========================================
echo   Striver A2Z DSA - GitHub Setup
echo ========================================
echo.

cd /d d:\Stirver_A2Z_DSA

echo [1/5] Git initialize kar raha hai...
git init

echo.
echo [2/5] Git user config set kar raha hai...
git config user.name "OMKAR580"
git config user.email "omkardubey165@gmail.com"

echo.
echo [3/5] GitHub remote add kar raha hai...
git remote remove origin 2>nul
git remote add origin https://github.com/OMKAR580/Striver-A2Z-DSA.git

echo.
echo [4/5] GitHub se existing files pull kar raha hai (conflict avoid karne ke liye)...
git fetch origin
git branch -M main
git pull origin main --allow-unrelated-histories --no-edit

echo.
echo [5/5] Saare local files add karke push kar raha hai...
git add .
git commit -m "Setup: Striver A2Z DSA complete folder structure + Pattern Questions"
git push -u origin main

echo.
echo ========================================
echo   Setup Complete! GitHub pe check karo
echo   https://github.com/OMKAR580/Striver-A2Z-DSA
echo ========================================
pause
