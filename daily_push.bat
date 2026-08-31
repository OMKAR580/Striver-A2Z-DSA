@echo off
echo ========================================
echo   Daily Push to GitHub
echo ========================================
echo.

cd /d d:\Stirver_A2Z_DSA

echo Kya solve kiya aaj? (Commit message likho):
set /p msg="Message: "

git add .
git commit -m "%msg%"
git push

echo.
echo ========================================
echo   Push ho gaya! 
echo   https://github.com/OMKAR580/Striver-A2Z-DSA
echo ========================================
pause
