"""
Flask Backend API for LLM with Google Maps Integration
"""

import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import googlemaps
from dotenv import load_dotenv
import redis
from typing import Dict, List, Optional, Any
import json
from datetime import datetime, timedelta, timezone

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key-change-me')

# Enable CORS
CORS(app, origins=["*"])  # In production, specify allowed origins

# Initialize Redis for rate limiting (fallback to memory if Redis unavailable)
try:
    redis_client = redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379/0'))
    redis_client.ping()  # Test connection
except:
    redis_client = None
    logger.warning("Redis not available, using in-memory rate limiting")

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri=os.getenv('REDIS_URL', 'memory://') if redis_client else 'memory://'
)
limiter.init_app(app)

# Initialize Google Maps client
GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')
if not GOOGLE_MAPS_API_KEY or GOOGLE_MAPS_API_KEY == 'your_google_maps_api_key_here':
    logger.warning("GOOGLE_MAPS_API_KEY not found or using placeholder value. Maps functionality will be limited.")
    gmaps = None
else:
    try:
        gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)
    except Exception as e:
        logger.error(f"Failed to initialize Google Maps client: {e}")
        gmaps = None

class LocationService:
    """Service for handling location-based queries and Google Maps integration"""
    
    def __init__(self, gmaps_client):
        self.gmaps = gmaps_client
        self.region = os.getenv('MAPS_REGION', 'US')
        self.language = os.getenv('MAPS_LANGUAGE', 'en')
    
    def search_places(self, query: str, location: Optional[str] = None, 
                     radius: int = 5000, place_type: Optional[str] = None) -> Dict[str, Any]:
        """
        Search for places using Google Maps Places API
        
        Args:
            query: Search query (e.g., "restaurants near me")
            location: Location string or coordinates
            radius: Search radius in meters
            place_type: Type of place (restaurant, gas_station, etc.)
        
        Returns:
            Dict containing search results and map data
        """
        if not self.gmaps:
            raise Exception("Google Maps API not configured")
        
        try:
            # If location is provided, geocode it first
            if location:
                geocode_result = self.gmaps.geocode(location)
                if geocode_result:
                    center = geocode_result[0]['geometry']['location']
                else:
                    raise Exception(f"Could not find location: {location}")
            else:
                # Default to a general search
                center = None
            
            # Perform places search
            if center:
                places_result = self.gmaps.places_nearby(
                    location=center,
                    radius=radius,
                    keyword=query,
                    type=place_type
                )
            else:
                places_result = self.gmaps.places(
                    query=query,
                    region=self.region,
                    language=self.language
                )
            
            # Process results
            processed_results = []
            for place in places_result.get('results', [])[:10]:  # Limit to top 10
                place_details = self._process_place_details(place)
                processed_results.append(place_details)
            
            return {
                'success': True,
                'query': query,
                'location': location,
                'results_count': len(processed_results),
                'places': processed_results,
                'map_center': center,
                'search_radius': radius
            }
            
        except Exception as e:
            logger.error(f"Error searching places: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'query': query
            }
    
    def _process_place_details(self, place: Dict) -> Dict[str, Any]:
        """Process and clean place details from Google Maps API"""
        return {
            'name': place.get('name', 'Unknown'),
            'place_id': place.get('place_id'),
            'rating': place.get('rating'),
            'price_level': place.get('price_level'),
            'address': place.get('vicinity') or place.get('formatted_address'),
            'location': place.get('geometry', {}).get('location'),
            'types': place.get('types', []),
            'opening_hours': place.get('opening_hours', {}).get('open_now'),
            'photos': [photo.get('photo_reference') for photo in place.get('photos', [])[:3]],
            'google_maps_url': f"https://www.google.com/maps/place/?q=place_id:{place.get('place_id')}"
        }
    
    def get_directions(self, origin: str, destination: str, 
                      mode: str = 'driving') -> Dict[str, Any]:
        """
        Get directions between two locations
        
        Args:
            origin: Starting location
            destination: Destination location  
            mode: Transportation mode (driving, walking, transit, bicycling)
        
        Returns:
            Dict containing directions data
        """
        if not self.gmaps:
            raise Exception("Google Maps API not configured")
        
        try:
            directions_result = self.gmaps.directions(
                origin=origin,
                destination=destination,
                mode=mode,
                language=self.language
            )
            
            if not directions_result:
                return {
                    'success': False,
                    'error': 'No directions found'
                }
            
            route = directions_result[0]
            leg = route['legs'][0]
            
            return {
                'success': True,
                'origin': origin,
                'destination': destination,
                'mode': mode,
                'distance': leg['distance']['text'],
                'duration': leg['duration']['text'],
                'start_address': leg['start_address'],
                'end_address': leg['end_address'],
                'steps': [step['html_instructions'] for step in leg['steps']],
                'google_maps_url': f"https://www.google.com/maps/dir/{origin}/{destination}"
            }
            
        except Exception as e:
            logger.error(f"Error getting directions: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

# Initialize location service
location_service = LocationService(gmaps) if gmaps else None

class LLMResponseGenerator:
    """Generate LLM-style responses for location queries"""
    
    def generate_response(self, query: str, places_data: Dict) -> str:
        """Generate a natural language response based on places data"""
        if not places_data.get('success'):
            return f"I'm sorry, I couldn't find any results for '{query}'. Please try a different search term or location."
        
        places = places_data.get('places', [])
        if not places:
            return f"I couldn't find any places matching '{query}'. You might want to try a broader search or different location."
        
        response = f"I found {len(places)} great options for '{query}':\n\n"
        
        for i, place in enumerate(places[:5], 1):  # Top 5 results
            name = place.get('name', 'Unknown')
            rating = place.get('rating')
            address = place.get('address', 'Address not available')
            
            response += f"{i}. **{name}**\n"
            if rating:
                response += f"   ⭐ Rating: {rating}/5\n"
            response += f"   📍 {address}\n"
            response += f"   🔗 [View on Google Maps]({place.get('google_maps_url', '#')})\n\n"
        
        response += "You can click on any of the Google Maps links above to get directions and more details!"
        return response

llm_generator = LLMResponseGenerator()

# API Routes

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'google_maps_configured': gmaps is not None,
        'redis_connected': redis_client is not None
    })

@app.route('/api/search', methods=['POST'])
@limiter.limit("30 per minute")
def search_places():
    """
    Search for places based on query
    
    Expected JSON payload:
    {
        "query": "restaurants near me",
        "location": "New York, NY" (optional),
        "radius": 5000 (optional),
        "type": "restaurant" (optional)
    }
    """
    try:
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({'error': 'Missing query parameter'}), 400
        
        query = data['query']
        location = data.get('location')
        radius = data.get('radius', 5000)
        place_type = data.get('type')
        
        if not location_service:
            return jsonify({'error': 'Google Maps service not available'}), 503
        
        # Search for places
        results = location_service.search_places(
            query=query,
            location=location,
            radius=radius,
            place_type=place_type
        )
        
        # Generate LLM-style response
        llm_response = llm_generator.generate_response(query, results)
        
        return jsonify({
            'llm_response': llm_response,
            'places_data': results,
            'query_info': {
                'original_query': query,
                'location': location,
                'radius': radius,
                'type': place_type
            }
        })
        
    except Exception as e:
        logger.error(f"Error in search endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/directions', methods=['POST'])
@limiter.limit("20 per minute")
def get_directions():
    """
    Get directions between two locations
    
    Expected JSON payload:
    {
        "origin": "New York, NY",
        "destination": "Boston, MA",
        "mode": "driving" (optional)
    }
    """
    try:
        data = request.get_json()
        if not data or 'origin' not in data or 'destination' not in data:
            return jsonify({'error': 'Missing origin or destination'}), 400
        
        origin = data['origin']
        destination = data['destination']
        mode = data.get('mode', 'driving')
        
        if not location_service:
            return jsonify({'error': 'Google Maps service not available'}), 503
        
        directions = location_service.get_directions(origin, destination, mode)
        
        return jsonify(directions)
        
    except Exception as e:
        logger.error(f"Error in directions endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/llm-chat', methods=['POST'])
@limiter.limit("60 per minute")
def llm_chat():
    """
    Main endpoint for LLM integration - processes natural language queries
    
    Expected JSON payload:
    {
        "message": "Find me good Italian restaurants in Manhattan",
        "context": {...} (optional)
    }
    """
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'Missing message parameter'}), 400
        
        message = data['message'].lower()
        
        # Simple intent detection (in production, use a proper NLP model)
        if any(keyword in message for keyword in ['find', 'search', 'looking for', 'where']):
            # Extract location query
            query = data['message']
            
            # Try to extract location from the message
            location = None
            if 'in ' in message:
                location_part = message.split('in ')[-1]
                location = location_part.strip()
            
            if not location_service:
                return jsonify({
                    'response': "I'm sorry, the location service is currently unavailable. Please try again later.",
                    'type': 'error'
                })
            
            # Search for places
            results = location_service.search_places(query=query, location=location)
            llm_response = llm_generator.generate_response(query, results)
            
            return jsonify({
                'response': llm_response,
                'type': 'places',
                'data': results
            })
        
        elif any(keyword in message for keyword in ['directions', 'how to get', 'route']):
            return jsonify({
                'response': "To get directions, please use the format: 'Get directions from [origin] to [destination]'",
                'type': 'instruction'
            })
        
        else:
            return jsonify({
                'response': "I can help you find places and get directions! Try asking me to 'find restaurants near me' or 'search for coffee shops in downtown'.",
                'type': 'help'
            })
        
    except Exception as e:
        logger.error(f"Error in LLM chat endpoint: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({'error': 'Rate limit exceeded. Please try again later.'}), 429

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info(f"Starting server on port {port}")
    logger.info(f"Google Maps API configured: {gmaps is not None}")
    logger.info(f"Redis connected: {redis_client is not None}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
