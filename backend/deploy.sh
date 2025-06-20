#!/bin/bash

# Production deployment script for LLM Location Assistant

set -e

echo "🚀 Deploying LLM Location Assistant to Production..."
echo "==================================================="

# Environment check
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create one with production settings."
    exit 1
fi

# Load environment variables
source .env

# Validate required environment variables
if [ -z "$GOOGLE_MAPS_API_KEY" ]; then
    echo "❌ GOOGLE_MAPS_API_KEY not set in .env file"
    exit 1
fi

if [ -z "$FLASK_SECRET_KEY" ]; then
    echo "❌ FLASK_SECRET_KEY not set in .env file"
    exit 1
fi

echo "✅ Environment variables validated"

# Build Docker image
echo "🐳 Building Docker image..."
docker build -t llm-location-assistant:latest .

# Stop existing containers
echo "🔄 Stopping existing containers..."
docker-compose down || true

# Start services
echo "🚀 Starting production services..."
FLASK_ENV=production docker-compose up -d

# Health check
echo "🏥 Waiting for health check..."
sleep 10

if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Application is healthy"
    echo "🌐 Application available at: http://localhost:5000"
    
    if docker-compose ps | grep -q open-webui; then
        echo "🤖 Open WebUI available at: http://localhost:3000"
    fi
else
    echo "❌ Health check failed"
    echo "📋 Container logs:"
    docker-compose logs app
    exit 1
fi

echo ""
echo "🎉 Production deployment complete!"
echo "=================================="
echo ""
echo "Monitor logs with:"
echo "  docker-compose logs -f"
echo ""
echo "Stop services with:"
echo "  docker-compose down"
