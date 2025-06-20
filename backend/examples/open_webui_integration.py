"""
Example integration with Open WebUI for LLM Location Assistant

This example shows how to create a custom function for Open WebUI
that integrates with our location API.
"""

import requests
import json
from typing import Dict, Any

class LocationAssistantFunction:
    """
    Open WebUI function for location-based queries
    """
    
    def __init__(self, api_base_url: str = "http://localhost:5000"):
        self.api_base_url = api_base_url
    
    class Valves:
        """Configuration valves for the function"""
        api_base_url: str = "http://localhost:5000"
        enabled: bool = True
    
    def __init__(self):
        self.valves = self.Valves()
    
    def search_places(self, query: str, location: str = None) -> Dict[str, Any]:
        """
        Search for places using the location API
        
        Args:
            query: What to search for (e.g., "restaurants", "coffee shops")
            location: Where to search (e.g., "New York, NY")
        
        Returns:
            Dict containing search results
        """
        try:
            response = requests.post(
                f"{self.valves.api_base_url}/api/search",
                json={
                    "query": query,
                    "location": location
                },
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {
                    "error": f"API request failed with status {response.status_code}",
                    "details": response.text
                }
        
        except requests.RequestException as e:
            return {
                "error": f"Failed to connect to location API: {str(e)}"
            }
    
    def get_directions(self, origin: str, destination: str, mode: str = "driving") -> Dict[str, Any]:
        """
        Get directions between two locations
        
        Args:
            origin: Starting location
            destination: Destination location
            mode: Transportation mode (driving, walking, transit, bicycling)
        
        Returns:
            Dict containing directions data
        """
        try:
            response = requests.post(
                f"{self.valves.api_base_url}/api/directions",
                json={
                    "origin": origin,
                    "destination": destination,
                    "mode": mode
                },
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {
                    "error": f"API request failed with status {response.status_code}",
                    "details": response.text
                }
        
        except requests.RequestException as e:
            return {
                "error": f"Failed to connect to location API: {str(e)}"
            }
    
    def process_location_query(self, user_message: str) -> str:
        """
        Process a natural language location query
        
        Args:
            user_message: User's message/query
        
        Returns:
            Formatted response with location information
        """
        try:
            response = requests.post(
                f"{self.valves.api_base_url}/api/llm-chat",
                json={"message": user_message},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if data.get('type') == 'places' and data.get('data', {}).get('places'):
                    # Format the response with places information
                    places = data['data']['places']
                    response_text = data['response']
                    
                    # Add interactive map links
                    response_text += "\n\n🗺️ **Quick Actions:**\n"
                    for i, place in enumerate(places[:3], 1):
                        name = place.get('name', 'Unknown')
                        maps_url = place.get('google_maps_url', '#')
                        response_text += f"{i}. [Open {name} in Google Maps]({maps_url})\n"
                    
                    return response_text
                else:
                    return data.get('response', 'I couldn\'t process your location query.')
            
            else:
                return f"Sorry, I encountered an error processing your request (Status: {response.status_code})"
        
        except requests.RequestException as e:
            return f"Sorry, I couldn't connect to the location service: {str(e)}"

# Example usage functions for Open WebUI

def find_places(query: str, location: str = None) -> str:
    """
    Find places based on a search query
    
    :param query: What to search for (e.g., "Italian restaurants", "gas stations")
    :param location: Where to search (optional, e.g., "New York, NY")
    :return: Formatted list of places with map links
    """
    assistant = LocationAssistantFunction()
    
    if not assistant.valves.enabled:
        return "Location search is currently disabled."
    
    result = assistant.search_places(query, location)
    
    if "error" in result:
        return f"❌ Error: {result['error']}"
    
    places_data = result.get('places_data', {})
    if not places_data.get('success'):
        return f"❌ Search failed: {places_data.get('error', 'Unknown error')}"
    
    places = places_data.get('places', [])
    if not places:
        return f"🔍 No places found for '{query}'" + (f" in {location}" if location else "")
    
    response = f"🗺️ Found {len(places)} places for '{query}':\n\n"
    
    for i, place in enumerate(places[:5], 1):
        name = place.get('name', 'Unknown')
        rating = place.get('rating')
        address = place.get('address', 'Address not available')
        maps_url = place.get('google_maps_url', '#')
        
        response += f"**{i}. {name}**\n"
        if rating:
            response += f"⭐ Rating: {rating}/5\n"
        response += f"📍 {address}\n"
        response += f"🔗 [View on Google Maps]({maps_url})\n\n"
    
    return response

def get_directions(origin: str, destination: str, mode: str = "driving") -> str:
    """
    Get directions between two locations
    
    :param origin: Starting location
    :param destination: Destination location  
    :param mode: Transportation mode (driving, walking, transit, bicycling)
    :return: Formatted directions with map link
    """
    assistant = LocationAssistantFunction()
    
    if not assistant.valves.enabled:
        return "Directions service is currently disabled."
    
    result = assistant.get_directions(origin, destination, mode)
    
    if "error" in result:
        return f"❌ Error: {result['error']}"
    
    if not result.get('success'):
        return f"❌ Directions failed: {result.get('error', 'Unknown error')}"
    
    response = f"🗺️ **Directions from {result['start_address']} to {result['end_address']}**\n\n"
    response += f"🚗 **Mode:** {mode.title()}\n"
    response += f"📏 **Distance:** {result['distance']}\n"
    response += f"⏰ **Duration:** {result['duration']}\n\n"
    response += f"🔗 [Open in Google Maps]({result['google_maps_url']})\n\n"
    
    if result.get('steps'):
        response += "**Turn-by-turn directions:**\n"
        for i, step in enumerate(result['steps'][:5], 1):
            # Clean HTML tags from instructions
            clean_step = step.replace('<b>', '**').replace('</b>', '**')
            clean_step = clean_step.replace('<div style="font-size:0.9em">', ' (')
            clean_step = clean_step.replace('</div>', ')')
            response += f"{i}. {clean_step}\n"
    
    return response

# Main function for Open WebUI integration
def location_assistant(user_message: str) -> str:
    """
    Main function for processing location-related queries in Open WebUI
    
    :param user_message: User's natural language query
    :return: Formatted response with location information
    """
    assistant = LocationAssistantFunction()
    return assistant.process_location_query(user_message)

# Example configuration for Open WebUI functions.py
FUNCTIONS = {
    "find_places": {
        "function": find_places,
        "description": "Search for places like restaurants, shops, or attractions",
        "parameters": {
            "query": {"type": "string", "description": "What to search for"},
            "location": {"type": "string", "description": "Where to search (optional)"}
        }
    },
    "get_directions": {
        "function": get_directions,
        "description": "Get directions between two locations",
        "parameters": {
            "origin": {"type": "string", "description": "Starting location"},
            "destination": {"type": "string", "description": "Destination location"},
            "mode": {"type": "string", "description": "Transportation mode", "default": "driving"}
        }
    },
    "location_assistant": {
        "function": location_assistant,
        "description": "Process natural language location queries",
        "parameters": {
            "user_message": {"type": "string", "description": "User's location query"}
        }
    }
}
