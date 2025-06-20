#!/bin/bash

# LLM Location Assistant Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Setting up LLM Location Assistant..."
echo "======================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3.8+ and try again."
    exit 1
fi

echo "✅ Python 3 found"

# Check if we're in a virtual environment
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "🔄 Activating virtual environment..."
    source venv/bin/activate
    echo "✅ Virtual environment activated"
else
    echo "✅ Virtual environment already active"
fi

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your Google Maps API key"
else
    echo "✅ .env file already exists"
fi

# Check if Redis is available
if command -v redis-server &> /dev/null; then
    echo "✅ Redis found"
    
    # Check if Redis is running
    if redis-cli ping &> /dev/null; then
        echo "✅ Redis is running"
    else
        echo "🔄 Starting Redis server..."
        redis-server --daemonize yes
        echo "✅ Redis started"
    fi
else
    echo "⚠️  Redis not found. Installing via package manager..."
    
    # Detect OS and install Redis
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install redis
            brew services start redis
        else
            echo "❌ Homebrew not found. Please install Redis manually."
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y redis-server
            sudo systemctl start redis-server
        elif command -v yum &> /dev/null; then
            sudo yum install -y redis
            sudo systemctl start redis
        else
            echo "❌ Package manager not found. Please install Redis manually."
        fi
    fi
fi

# Run tests
echo "🧪 Running tests..."
if python -m pytest tests/ -v; then
    echo "✅ All tests passed"
else
    echo "⚠️  Some tests failed. Check the output above."
fi

echo ""
echo "🎉 Setup complete!"
echo "==================="
echo ""
echo "Next steps:"
echo "1. Edit the .env file with your Google Maps API key:"
echo "   nano .env"
echo ""
echo "2. Start the application:"
echo "   python app.py"
echo ""
echo "3. Open your browser to:"
echo "   http://localhost:5000"
echo ""
echo "4. Or use Docker Compose:"
echo "   docker-compose up --build"
echo ""
echo "📚 Check README.md for detailed instructions"
echo ""
echo "Need help getting a Google Maps API key?"
echo "👉 https://developers.google.com/maps/documentation/javascript/get-api-key"
