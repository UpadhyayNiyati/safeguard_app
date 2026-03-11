@echo off
REM SafeGuard Setup Script for Windows
REM This script automates the setup process for the SafeGuard application

echo.
echo =========================================
echo   SafeGuard - Emergency Safety App
echo   Setup Script for Windows
echo =========================================
echo.

REM Check if Python is installed
echo Checking for Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed. Please install it from https://www.python.org
    pause
    exit /b 1
)
echo Python found: 
python --version
echo.

REM Check if Node.js is installed
echo Checking for Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install it from https://nodejs.org
    pause
    exit /b 1
)
echo Node.js found:
node --version
echo.

REM Check if npm is installed
echo Checking for npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed.
    pause
    exit /b 1
)
echo npm found:
npm --version
echo.

REM Create Python virtual environment
echo Creating Python virtual environment...
if exist "venv" (
    echo Virtual environment already exists.
) else (
    python -m venv venv
    echo Virtual environment created
)
echo.

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
echo Virtual environment activated
echo.

REM Install Python dependencies
echo Installing Python dependencies...
pip install --upgrade pip >nul 2>&1
pip install -r requirements.txt
echo Python dependencies installed
echo.

REM Install Node.js dependencies
echo Installing Node.js dependencies...
call npm install
echo Node.js dependencies installed
echo.

REM Check if .env.local exists
echo Checking environment configuration...
if exist ".env.local" (
    echo .env.local configuration found
) else (
    echo Creating .env.local...
    if exist ".env.example" (
        copy .env.example .env.local
    )
)
echo.

REM Summary
echo =========================================
echo   Setup Complete!
echo =========================================
echo.
echo Next steps:
echo.
echo 1. Configure your database in .env.local:
echo    - Update DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
echo    - Ensure MySQL is running
echo.
echo 2. Initialize the database:
echo    - Run: venv\Scripts\activate.bat
echo    - Run: python -c "from app import app, db; app.app_context().push(); db.create_all()"
echo.
echo 3. Start the Flask backend:
echo    - Run: venv\Scripts\activate.bat
echo    - Run: python app.py
echo    - Backend will run on http://localhost:5000
echo.
echo 4. In a new terminal, start the Next.js frontend:
echo    - Run: npm run dev
echo    - Frontend will run on http://localhost:3000
echo.
echo 5. Open http://localhost:3000 in your browser
echo.
echo For detailed setup instructions, see COMPLETE_SETUP.md
echo.
pause
