@echo off
:menu
cls
echo ===================================================
echo   SISVEST NON-FUNCTIONAL TESTING DASHBOARD
echo ===================================================
echo  1. Run k6 Load Testing (Performance API)
echo  2. Run Bandit SAST Scan (Code Security Backend)
echo  3. Run Dependency Vulnerability Audit (Full Stack)
echo  4. Open Lighthouse Guide (Accessibility, SEO, Perf UI)
echo  5. Run All Automated Tests (1, 2, and 3)
echo  6. Exit
echo ===================================================
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto k6_test
if "%choice%"=="2" goto bandit_test
if "%choice%"=="3" goto audit_test
if "%choice%"=="4" goto lighthouse_guide
if "%choice%"=="5" goto run_all
if "%choice%"=="6" goto exit_app
goto menu

:k6_test
echo.
echo === Starting k6 Load Testing ===
where k6 >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] k6 CLI is not installed!
    echo Please install it first from https://k6.io/ or run: winget install gnu.k6
    pause
    goto menu
)
k6 run performance_k6.js
pause
goto menu

:bandit_test
echo.
call security_bandit.bat
goto menu

:audit_test
echo.
call security_audit.bat
goto menu

:lighthouse_guide
echo.
echo Opening README.md for Google Lighthouse & Accessibility guide...
start notepad.exe README.md
goto menu

:run_all
echo.
echo === Running All Automated Tests ===
echo.
echo [1/3] Running Bandit SAST Scan...
bandit -r ../backend/
echo.
echo [2/3] Running Dependency Audit...
cd ../frontend && call npm audit && cd ../non_functional_tests
pip-audit -r ../backend/requirements.txt
echo.
echo [3/3] Running k6 Load Testing...
where k6 >nul 2>nul
if %errorlevel% equ 0 (
    k6 run performance_k6.js
) else (
    echo [WARNING] k6 is not installed. Skipping k6 load test.
)
echo.
echo ===================================================
echo All automated non-functional tests completed!
echo ===================================================
pause
goto menu

:exit_app
echo.
echo Thank you for using Sisvest Non-Functional Testing Suite!
exit /b 0
