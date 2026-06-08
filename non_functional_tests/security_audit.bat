@echo off
echo ===================================================
echo [Security] Running Dependency Vulnerability Audit
echo ===================================================
echo.

:: ------------------------------------
:: 1. Frontend Audit (npm audit)
:: ------------------------------------
echo === [1/2] Auditing Frontend Dependencies (npm audit) ===
cd ../frontend
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo Running npm audit...
    call npm audit
) else (
    echo [WARNING] npm is not installed or not in PATH! Skipping frontend audit.
)
cd ../non_functional_tests

echo.
echo ===================================================
echo.

:: ------------------------------------
:: 2. Backend Audit (pip-audit)
:: ------------------------------------
echo === [2/2] Auditing Backend Dependencies (pip-audit) ===
where pip >nul 2>nul
if %errorlevel% equ 0 (
    echo Checking if 'pip-audit' is installed...
    pip show pip-audit >nul 2>nul
    if %errorlevel% neq 0 (
        echo Installing pip-audit via pip...
        pip install pip-audit
    )
    echo Running pip-audit on backend requirements...
    pip-audit -r ../backend/requirements.txt
) else (
    echo [WARNING] Python/pip is not installed or not in PATH! Skipping backend audit.
)

echo.
echo ===================================================
echo Dependency audit completed!
echo ===================================================
pause
