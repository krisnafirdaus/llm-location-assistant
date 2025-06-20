# LLM Location Assistant

> **Repository**: `llm-location-assistant`  
> **Description**: AI-powered location assistant with Google Maps integration and LLM chat interface

A comprehensive system that combines a Flask backend API with a modern Next.js frontend, integrating Google Maps API and local LLM systems like Open WebUI. Users can ask for places to go, eat, or visit, and get embedded maps with directions.

## 🚀 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js UI   │    │   Open WebUI    │    │   Mobile App    │
│   (Frontend)    │    │     (LLM)       │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼───────────────┐
                    │     Flask API Server       │
                    │   (Rate Limited & Secure)  │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │     Google Maps APIs       │
                    │  (Places, Directions, etc) │
                    └─────────────────────────────┘
```

## ✨ Features

### Backend (Flask API)
- 🗺️ **Google Maps Integration**: Search for places, get directions, and view locations
- 🤖 **LLM Integration**: Natural language processing for location queries
- 🚀 **Rate Limiting**: Built-in protection against API abuse
- 🔒 **Security**: API key management and input validation
- � **Docker Support**: Easy deployment with Docker Compose

### Frontend (Next.js)
- 🎨 **Modern UI/UX**: Beautiful gradient design with smooth animations
- 💬 **Real-time Chat**: Interactive chat interface with the AI assistant
- � **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Performance**: Optimized with Next.js 15 and Turbopack
- 🎭 **Animations**: Smooth transitions using Framer Motion

## Prerequisites

1. **Google Cloud Account**: Register at [Google Cloud Console](https://console.cloud.google.com/)
2. **Google Maps API Key**: Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API
3. **Redis** (optional): For rate limiting and caching
4. **Python 3.8+**: For running the application

## Quick Start

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/llm-location-assistant.git
cd llm-location-assistant
```

### Step 2: Choose Your Setup Method

### Option 1: Development Mode (Recommended for testing)

**Backend (Flask API)**:
```bash
# Setup backend
cd backend
python -m venv venv
source venv/bin/activate  # On macOS/Linux
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Google Maps API key

# Run backend
python app.py
# Backend available at http://localhost:5000
```

**Frontend (Next.js)**:
```bash
# Setup frontend
cd frontend
npm install

# Run frontend
npm run dev
# Frontend available at http://localhost:3000
```

### Option 2: Docker Compose (Full Stack)

```bash
# Run entire stack
docker-compose up --build

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
# - Open WebUI: http://localhost:8080
# - Redis: localhost:6379
```

## 📚 Complete Documentation

- [📖 **Quick Start Guide**](./docs/QUICKSTART.md) - Get started in 5 minutes
- [🏗️ **Project Structure**](./docs/PROJECT_STRUCTURE.md) - File and folder organization  
- [📡 **API Documentation**](./docs/API_DOCS.md) - Complete backend API endpoints
- [🚀 **Deployment Guide**](./docs/DEPLOYMENT.md) - Production deployment guide
- [🎨 **Frontend Guide**](./frontend/README.md) - Next.js frontend documentation
- [📚 **Documentation Index**](./docs/README.md) - Complete documentation index

## API Endpoints

### Health Check
```http
GET /api/health
```

### Search Places
```http
POST /api/search
Content-Type: application/json

{
  "query": "restaurants near me",
  "location": "New York, NY",
  "radius": 5000,
  "type": "restaurant"
}
```

### Get Directions
```http
POST /api/directions
Content-Type: application/json

{
  "origin": "New York, NY",
  "destination": "Boston, MA",
  "mode": "driving"
}
```

### LLM Chat Interface
```http
POST /api/llm-chat
Content-Type: application/json

{
  "message": "Find me good Italian restaurants in Manhattan"
}
```

## Integration with Open WebUI

### Option 1: Docker Compose (Included)

The `docker-compose.yml` already includes Open WebUI. Just run:

```bash
docker-compose up -d
```

Access Open WebUI at `http://localhost:3000`

### Option 2: Standalone Open WebUI

1. Install Open WebUI:
```bash
docker run -d --name open-webui -p 3000:8080 \
  -e OPENAI_API_BASE_URL=http://localhost:5000/api \
  ghcr.io/open-webui/open-webui:main
```

2. Configure Open WebUI to use your API endpoint

### Option 3: Custom LLM Integration

You can integrate with any LLM by making HTTP requests to the `/api/llm-chat` endpoint:

```python
import requests

def ask_location_llm(query):
    response = requests.post('http://localhost:5000/api/llm-chat', 
                           json={'message': query})
    return response.json()

# Example usage
result = ask_location_llm("Find coffee shops near Central Park")
print(result['response'])
```

## Usage Examples

### Web Interface

1. Open `http://localhost:5000`
2. Try these example queries:
   - "Find pizza restaurants in New York"
   - "Search for coffee shops near me"
   - "Best museums in San Francisco"
   - "Gas stations in Los Angeles"

### API Examples

```python
import requests

# Search for places
response = requests.post('http://localhost:5000/api/search', json={
    'query': 'Italian restaurants',
    'location': 'Manhattan, NY',
    'radius': 2000
})

places = response.json()

# Get directions
response = requests.post('http://localhost:5000/api/directions', json={
    'origin': 'Times Square, NY',
    'destination': 'Central Park, NY',
    'mode': 'walking'
})

directions = response.json()
```

## Security Best Practices

### API Key Security

1. **Restrict API Keys**: In Google Cloud Console, restrict your API key to specific:
   - HTTP referrers (for web apps)
   - IP addresses (for server apps)
   - APIs (only enable needed APIs)

2. **Environment Variables**: Never commit API keys to version control

3. **Rotation**: Regularly rotate API keys

### Rate Limiting

The application includes built-in rate limiting:
- 50 requests per hour per IP
- 200 requests per day per IP
- Configurable via environment variables

### Production Deployment

1. **HTTPS**: Use SSL/TLS certificates
2. **Firewall**: Restrict access to necessary ports
3. **Monitoring**: Set up logging and monitoring
4. **Backup**: Regular backups of data and configuration

## Testing

Run the test suite:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_app.py -v
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │   Open WebUI    │    │   Mobile App    │
│   (Browser)     │    │     (LLM)       │    │                 │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼───────────────┐
                    │      Flask API Server      │
                    │   (Rate Limited & Secure)  │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────▼───────────────┐
                    │     Google Maps APIs       │
                    │  (Places, Directions, etc) │
                    └─────────────────────────────┘
```

## Troubleshooting

### Common Issues

1. **Google Maps API Key Issues**:
   - Verify API key is correct
   - Check if required APIs are enabled
   - Ensure billing is set up (required for Google Maps)

2. **Redis Connection Issues**:
   - Check if Redis is running: `redis-cli ping`
   - Verify Redis URL in environment variables

3. **Rate Limiting Issues**:
   - Check current limits: `GET /api/health`
   - Adjust limits in environment variables

4. **CORS Issues**:
   - Configure `CORS_ORIGINS` in environment variables
   - For development, use `*` (not recommended for production)

### Logs

Check application logs:
```bash
# Docker
docker-compose logs app

# Local
tail -f app.log
```

## Monitoring and Metrics

### Health Monitoring

The `/api/health` endpoint provides:
- Service status
- Google Maps API configuration status
- Redis connection status
- Timestamp

### Performance Monitoring

Consider adding:
- Application Performance Monitoring (APM)
- Error tracking (e.g., Sentry)
- Custom metrics collection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter issues:

1. Check the troubleshooting section
2. Review the logs
3. Create an issue with:
   - Error description
   - Steps to reproduce
   - Environment details
   - Log excerpts (without sensitive data)

## Roadmap

Future enhancements:
- [ ] Advanced LLM integration (OpenAI, Anthropic, etc.)
- [ ] Real-time location tracking
- [ ] Multi-language support
- [ ] Advanced caching strategies
- [ ] Analytics dashboard
- [ ] Mobile app development
- [ ] Voice interface integration

---

## Example Assumptions Made

1. **Google Cloud Setup**: Assumes users will create a new Google Cloud account for free credits
2. **LLM Choice**: Integrated with Open WebUI for flexibility in choosing local LLMs
3. **Security**: Implemented rate limiting and basic security measures
4. **Deployment**: Provided both local and Docker deployment options
5. **UI/UX**: Created a modern, responsive web interface for testing
6. **Error Handling**: Comprehensive error handling and user feedback
7. **Testing**: Included unit tests for reliability
8. **Documentation**: Extensive documentation for easy setup and usage
