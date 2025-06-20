#!/bin/bash

# LLM Location Assistant - Main Start Script

echo "🚀 LLM Location Assistant - Development Setup"
echo "============================================="

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo ""
    echo "🐳 Docker detected! Choose your preferred startup method:"
    echo ""
    echo "1) 🐳 Docker Compose (Recommended - All services)"
    echo "2) 💻 Manual Development (Frontend + Backend separately)"
    echo "3) 🎯 Backend Only"
    echo "4) 🎨 Frontend Only"
    echo ""
    read -p "Enter your choice (1-4): " choice
else
    echo ""
    echo "⚠️  Docker not detected. Using manual development mode."
    echo ""
    echo "Available options:"
    echo "1) 💻 Frontend + Backend (separate terminals)"
    echo "2) 🎯 Backend Only"
    echo "3) 🎨 Frontend Only"
    echo ""
    read -p "Enter your choice (1-3): " choice
    # Adjust choice for non-docker environment
    case $choice in
        1) choice=2 ;;
        2) choice=3 ;;
        3) choice=4 ;;
    esac
fi

case $choice in
    1)
        echo ""
        echo "🐳 Starting with Docker Compose..."
        echo "This will start:"
        echo "  • Backend API (Flask) on port 5001"
        echo "  • Frontend (Next.js) on port 3000"
        echo "  • Redis cache on port 6379"
        echo "  • Open WebUI on port 8080"
        echo ""
        
        # Check if .env exists in backend
        if [ ! -f "backend/.env" ]; then
            echo "⚠️  Warning: backend/.env not found. Copying from .env.example..."
            cp backend/.env.example backend/.env
            echo "📝 Please edit backend/.env and add your Google Maps API key."
            echo ""
            read -p "Press Enter to continue..."
        fi
        
        docker-compose up --build
        ;;
        
    2)
        echo ""
        echo "💻 Starting Manual Development Mode..."
        echo "This will open separate terminals for backend and frontend."
        echo ""
        
        # Start backend in background
        echo "🎯 Starting Backend..."
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal --title="Backend" -- bash -c "cd backend && ./start-backend.sh; exec bash"
        elif command -v osascript &> /dev/null; then
            osascript -e 'tell application "Terminal" to do script "cd '$(pwd)'/backend && ./start-backend.sh"'
        else
            echo "Please open a new terminal and run: cd backend && ./start-backend.sh"
        fi
        
        sleep 3
        
        # Start frontend in background
        echo "🎨 Starting Frontend..."
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal --title="Frontend" -- bash -c "cd frontend && ./start-frontend.sh; exec bash"
        elif command -v osascript &> /dev/null; then
            osascript -e 'tell application "Terminal" to do script "cd '$(pwd)'/frontend && ./start-frontend.sh"'
        else
            echo "Please open another terminal and run: cd frontend && ./start-frontend.sh"
        fi
        
        echo ""
        echo "✅ Development environment setup complete!"
        echo ""
        echo "🌐 Access your application:"
        echo "   • Frontend: http://localhost:3000"
        echo "   • Backend API: http://localhost:5001"
        echo "   • API Health: http://localhost:5001/api/health"
        echo ""
        ;;
        
    3)
        echo ""
        echo "🎯 Starting Backend Only..."
        cd backend && ./start-backend.sh
        ;;
        
    4)
        echo ""
        echo "🎨 Starting Frontend Only..."
        cd frontend && ./start-frontend.sh
        ;;
        
    *)
        echo "❌ Invalid choice. Exiting..."
        exit 1
        ;;
esac

echo ""
echo "🎉 Thanks for using LLM Location Assistant!"
