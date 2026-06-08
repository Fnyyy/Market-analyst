@echo off
echo ===================================================
echo [SAST] Running Bandit Static Security Scan for Backend
echo ===================================================
echo.

:: Check if pip is available
where pip >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python/pip is not installed or not in PATH!
    pause
    exit /b 1
)

:: Install bandit if not present
echo Checking if 'bandit' is installed...
pip show bandit >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing bandit via pip...
    pip install bandit
) else (
    echo Bandit is already installed.
)

echo.
echo Running security scan on 'backend' directory...
echo Results will be printed to screen and saved to 'bandit_report.txt'...
echo.

:: Run bandit
bandit -r ../backend/ -f txt -o bandit_report.txt
bandit -r ../backend/

echo.
echo ===================================================
echo Security scan completed! Report saved to non_functional_tests/bandit_report.txt
echo ===================================================
pause
