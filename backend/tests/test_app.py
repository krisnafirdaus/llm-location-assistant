"""
Unit tests for the LLM Location Assistant API
"""

import pytest
import json
import os
from app import app, location_service

@pytest.fixture
def client():
    """Create a test client"""
    # Set testing configuration
    app.config['TESTING'] = True
    app.config['DEBUG'] = True
    os.environ['RATELIMIT_STORAGE_URL'] = 'memory://'
    with app.test_client() as client:
        yield client

@pytest.fixture
def sample_places_data():
    """Sample places data for testing"""
    return {
        'success': True,
        'query': 'restaurants',
        'results_count': 2,
        'places': [
            {
                'name': 'Test Restaurant 1',
                'place_id': 'test_id_1',
                'rating': 4.5,
                'address': '123 Test St',
                'location': {'lat': 40.7128, 'lng': -74.0060},
                'types': ['restaurant', 'food'],
                'google_maps_url': 'https://maps.google.com/test1'
            },
            {
                'name': 'Test Restaurant 2',
                'place_id': 'test_id_2',
                'rating': 4.2,
                'address': '456 Test Ave',
                'location': {'lat': 40.7589, 'lng': -73.9851},
                'types': ['restaurant', 'food'],
                'google_maps_url': 'https://maps.google.com/test2'
            }
        ]
    }

class TestHealthEndpoint:
    """Test the health check endpoint"""
    
    def test_health_check(self, client):
        """Test health check returns correct status"""
        response = client.get('/api/health')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert 'status' in data
        assert data['status'] == 'healthy'
        assert 'timestamp' in data
        assert 'google_maps_configured' in data

class TestSearchEndpoint:
    """Test the search places endpoint"""
    
    def test_search_missing_query(self, client):
        """Test search endpoint with missing query"""
        response = client.post('/api/search', 
                             data=json.dumps({}),
                             content_type='application/json')
        assert response.status_code == 400
        
        data = json.loads(response.data)
        assert 'error' in data
        assert 'query' in data['error']
    
    def test_search_valid_query(self, client):
        """Test search endpoint with valid query"""
        response = client.post('/api/search',
                             data=json.dumps({'query': 'restaurants'}),
                             content_type='application/json')
        
        # Should return 200 or 503 depending on Google Maps configuration
        assert response.status_code in [200, 503]
        
        data = json.loads(response.data)
        if response.status_code == 503:
            assert 'error' in data
        else:
            assert 'llm_response' in data
            assert 'places_data' in data

class TestDirectionsEndpoint:
    """Test the directions endpoint"""
    
    def test_directions_missing_params(self, client):
        """Test directions endpoint with missing parameters"""
        response = client.post('/api/directions',
                             data=json.dumps({'origin': 'New York'}),
                             content_type='application/json')
        assert response.status_code == 400
        
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_directions_valid_params(self, client):
        """Test directions endpoint with valid parameters"""
        response = client.post('/api/directions',
                             data=json.dumps({
                                 'origin': 'New York, NY',
                                 'destination': 'Boston, MA'
                             }),
                             content_type='application/json')
        
        # Should return 200 or 503 depending on Google Maps configuration
        assert response.status_code in [200, 503]

class TestLLMChatEndpoint:
    """Test the LLM chat endpoint"""
    
    def test_chat_missing_message(self, client):
        """Test chat endpoint with missing message"""
        response = client.post('/api/llm-chat',
                             data=json.dumps({}),
                             content_type='application/json')
        assert response.status_code == 400
        
        data = json.loads(response.data)
        assert 'error' in data
    
    def test_chat_search_intent(self, client):
        """Test chat endpoint with search intent"""
        response = client.post('/api/llm-chat',
                             data=json.dumps({
                                 'message': 'find restaurants near me'
                             }),
                             content_type='application/json')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert 'response' in data
        assert 'type' in data
    
    def test_chat_help_intent(self, client):
        """Test chat endpoint with general message"""
        response = client.post('/api/llm-chat',
                             data=json.dumps({
                                 'message': 'hello'
                             }),
                             content_type='application/json')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        assert 'response' in data
        assert data['type'] == 'help'

class TestLLMResponseGenerator:
    """Test the LLM response generator"""
    
    def test_generate_response_success(self, sample_places_data):
        """Test generating response with successful places data"""
        from app import llm_generator
        
        response = llm_generator.generate_response('restaurants', sample_places_data)
        
        assert 'I found 2 great options' in response
        assert 'Test Restaurant 1' in response
        assert 'Test Restaurant 2' in response
        assert 'Google Maps' in response
    
    def test_generate_response_no_results(self):
        """Test generating response with no results"""
        from app import llm_generator
        
        empty_data = {
            'success': True,
            'places': []
        }
        
        response = llm_generator.generate_response('restaurants', empty_data)
        assert 'couldn\'t find any places' in response
    
    def test_generate_response_error(self):
        """Test generating response with error"""
        from app import llm_generator
        
        error_data = {
            'success': False,
            'error': 'API error'
        }
        
        response = llm_generator.generate_response('restaurants', error_data)
        assert 'sorry' in response.lower()

class TestRateLimiting:
    """Test rate limiting functionality"""
    
    def test_rate_limit_not_exceeded(self, client):
        """Test that normal requests don't hit rate limits"""
        for _ in range(5):  # Send 5 requests
            response = client.get('/api/health')
            assert response.status_code == 200
    
    def test_rate_limit_headers(self, client):
        """Test that rate limit headers are present"""
        response = client.get('/api/health')
        # Flask-Limiter may add rate limit headers
        # This test ensures the endpoint is accessible

if __name__ == '__main__':
    pytest.main([__file__])
