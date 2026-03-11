#!/bin/bash

# SafeGuard Setup Script
# This script automates the setup process for the SafeGuard application

echo "========================================="
echo "  SafeGuard - Emergency Safety App"
echo "  Setup Script"
echo "========================================="
echo ""

# Check if Python is installed
echo "Checking for Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install it from https://www.python.org"
    exit 1
fi
echo "✅ Python found: $(python3 --version)"
echo ""

# Check if Node.js is installed
echo "Checking for Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://www.nodejs.org"
    exit 1
fi
echo "✅ Node.js found: $(node --version)"
echo ""

# Check if npm is installed
echo "Checking for npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi
echo "✅ npm found: $(npm --version)"
echo ""

# Create Python virtual environment
echo "Creating Python virtual environment..."
if [ -d "venv" ]; then
    echo "Virtual environment already exists."
else
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi
echo ""

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate || . venv/Scripts/activate
echo "✅ Virtual environment activated"
echo ""

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt
echo "✅ Python dependencies installed"
echo ""

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install
echo "✅ Node.js dependencies installed"
echo ""

# Check if .env.local exists
echo "Checking environment configuration..."
if [ -f ".env.local" ]; then
    echo "✅ .env.local configuration found"
else
    echo "⚠️  .env.local not found. Creating default..."
    cp .env.example .env.local 2>/dev/null || echo "⚠️  .env.example not found"
fi
echo ""

# Summary
echo "========================================="
echo "  Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Configure your database in .env.local:"
echo "   - Update DB_HOST, DB_USER, DB_PASSWORD, DB_NAME"
echo "   - Ensure MySQL is running"
echo ""
echo "2. Initialize the database:"
echo "   - Activate venv: source venv/bin/activate"
echo "   - Run: python -c \"from app import app, db; app.app_context().push(); db.create_all()\""
echo ""
echo "3. Start the Flask backend:"
echo "   - Activate venv: source venv/bin/activate"
echo "   - Run: python app.py"
echo "   - Backend will run on http://localhost:5000"
echo ""
echo "4. In a new terminal, start the Next.js frontend:"
echo "   - Run: npm run dev"
echo "   - Frontend will run on http://localhost:3000"
echo ""
echo "5. Open http://localhost:3000 in your browser"
echo ""
echo "For detailed setup instructions, see COMPLETE_SETUP.md"
echo ""
