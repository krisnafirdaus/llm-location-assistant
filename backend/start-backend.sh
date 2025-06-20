#!/bin/bash

# LLM Location Assistant - Start Backend Script

echo "🚀 Starting LLM Location Assistant Backend..."

# Check if we're in the right directory
if [ ! -f "app.py" ]; then
    echo "❌ Error: app.py not found. Please run this script from the backend directory."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file and add your Google Maps API key."
fi

# Start Redis if not running (optional)
echo "🔍 Checking Redis..."
if ! pgrep redis-server > /dev/null; then
    echo "⚠️  Redis not running. Please start Redis manually or use Docker Compose."
fi

# Start Flask application
echo "🎯 Starting Flask backend on port 5001..."
export FLASK_ENV=development
export FLASK_DEBUG=True
python app.py

echo "✅ Backend started successfully!"
