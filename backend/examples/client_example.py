"""
Simple client example for testing the LLM Location Assistant API
"""

import requests
import json
from typing import Dict, Any

class LocationAPIClient:
    """Client for interacting with the Location Assistant API"""
    
    def __init__(self, base_url: str = "http://localhost:5001"):
        self.base_url = base_url
        self.session = requests.Session()
        
    def health_check(self) -> Dict[str, Any]:
        """Check API health status"""
        try:
            response = self.session.get(f"{self.base_url}/api/health")
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {"error": str(e)}
    
    def search_places(self, query: str, location: str = None, 
                     radius: int = 5000, place_type: str = None) -> Dict[str, Any]:
        """Search for places"""
        payload = {"query": query}
        if location:
            payload["location"] = location
        if radius != 5000:
            payload["radius"] = radius
        if place_type:
            payload["type"] = place_type
            
        try:
            response = self.session.post(
                f"{self.base_url}/api/search",
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {"error": str(e)}
    
    def get_directions(self, origin: str, destination: str, 
                      mode: str = "driving") -> Dict[str, Any]:
        """Get directions between locations"""
        payload = {
            "origin": origin,
            "destination": destination,
            "mode": mode
        }
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/directions",
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {"error": str(e)}
    
    def chat_query(self, message: str) -> Dict[str, Any]:
        """Send a natural language query to the LLM chat endpoint"""
        payload = {"message": message}
        
        try:
            response = self.session.post(
                f"{self.base_url}/api/llm-chat",
                json=payload
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            return {"error": str(e)}

def main():
    """Example usage of the Location API Client"""
    
    print("🗺️ LLM Location Assistant - Client Example")
    print("==========================================")
    
    # Initialize client
    client = LocationAPIClient()
    
    # Health check
    print("\n1. Health Check")
    print("-" * 30)
    health = client.health_check()
    if "error" in health:
        print(f"❌ Error: {health['error']}")
        return
    else:
        print(f"✅ Status: {health['status']}")
        print(f"🗺️ Google Maps: {'✅' if health['google_maps_configured'] else '❌'}")
        print(f"🔴 Redis: {'✅' if health['redis_connected'] else '❌'}")
    
    # Example 1: Search for places
    print("\n2. Search for Places")
    print("-" * 30)
    search_result = client.search_places(
        query="Italian restaurants",
        location="Manhattan, New York",
        radius=2000
    )
    
    if "error" in search_result:
        print(f"❌ Error: {search_result['error']}")
    else:
        print(f"🔍 Query: {search_result['query_info']['original_query']}")
        places_data = search_result.get('places_data', {})
        if places_data.get('success') and places_data.get('places'):
            places = places_data['places']
            print(f"📍 Found {len(places)} places:")
            for i, place in enumerate(places[:3], 1):
                print(f"  {i}. {place['name']} ⭐ {place.get('rating', 'N/A')}")
                print(f"     📍 {place.get('address', 'No address')}")
        else:
            print("❌ No places found or search failed")
    
    # Example 2: Get directions
    print("\n3. Get Directions")
    print("-" * 30)
    directions_result = client.get_directions(
        origin="Times Square, New York",
        destination="Central Park, New York",
        mode="walking"
    )
    
    if "error" in directions_result:
        print(f"❌ Error: {directions_result['error']}")
    else:
        if directions_result.get('success'):
            print(f"🚶 From: {directions_result['start_address']}")
            print(f"🏁 To: {directions_result['end_address']}")
            print(f"📏 Distance: {directions_result['distance']}")
            print(f"⏰ Duration: {directions_result['duration']}")
        else:
            print("❌ Directions not found")
    
    # Example 3: Natural language chat
    print("\n4. Natural Language Query")
    print("-" * 30)
    chat_result = client.chat_query("Find me good coffee shops near Brooklyn Bridge")
    
    if "error" in chat_result:
        print(f"❌ Error: {chat_result['error']}")
    else:
        print(f"🤖 Response: {chat_result['response'][:200]}...")
        if chat_result.get('type') == 'places':
            print("📍 Type: Location search results")
        else:
            print(f"💬 Type: {chat_result.get('type', 'General')}")
    
    print("\n" + "=" * 50)
    print("✅ Example completed! Check the web interface at http://localhost:5000")

if __name__ == "__main__":
    main()
