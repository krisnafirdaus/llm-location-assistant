#!/bin/bash

# LLM Location Assistant - Start Frontend Script

echo "🎨 Starting LLM Location Assistant Frontend..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js not found. Please install Node.js first."
    exit 1
fi

echo "📦 Node.js version: $(node --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install
fi

# Check if .env.local file exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local file not found. Creating with default values..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:5001" > .env.local
fi

# Start Next.js development server
echo "🚀 Starting Next.js frontend..."
echo "🌐 Frontend will be available at: http://localhost:3000"
echo "🔗 API Backend should be running at: http://localhost:5001"
echo ""
echo "📱 Available pages:"
echo "   • Main: http://localhost:3000"
echo "   • Auth: http://localhost:3000/auth"
echo "   • Chat: http://localhost:3000/chat"
echo ""

npm run dev

echo "✅ Frontend started successfully!"
