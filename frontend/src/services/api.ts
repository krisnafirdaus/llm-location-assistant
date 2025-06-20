import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export interface HealthResponse {
  status: string
  google_maps_configured: boolean
  redis_connected: boolean
  timestamp: string
}

export interface SearchRequest {
  query: string
  location?: string
  radius?: number
  type?: string
}

export interface ChatRequest {
  message: string
  context?: any
}

export interface Place {
  name: string
  place_id: string
  rating?: number
  price_level?: number
  address: string
  location: {
    lat: number
    lng: number
  }
  types: string[]
  opening_hours?: boolean
  photos: string[]
  google_maps_url: string
}

export interface SearchResponse {
  llm_response: string
  places_data: {
    success: boolean
    query: string
    location?: string
    results_count: number
    places: Place[]
    map_center?: {
      lat: number
      lng: number
    }
    search_radius: number
  }
  query_info: {
    original_query: string
    location?: string
    radius: number
    type?: string
  }
}

export interface ChatResponse {
  response: string
  type: 'places' | 'directions' | 'help' | 'error'
  data?: any
}

export interface DirectionsRequest {
  origin: string
  destination: string
  mode?: 'driving' | 'walking' | 'transit' | 'bicycling'
}

export interface DirectionsResponse {
  success: boolean
  origin: string
  destination: string
  mode: string
  distance: string
  duration: string
  start_address: string
  end_address: string
  steps: string[]
  google_maps_url: string
}

class LocationAPI {
  async checkHealth(): Promise<HealthResponse> {
    const response = await api.get<HealthResponse>('/api/health')
    return response.data
  }

  async searchPlaces(request: SearchRequest): Promise<SearchResponse> {
    const response = await api.post<SearchResponse>('/api/search', request)
    return response.data
  }

  async chatQuery(request: ChatRequest): Promise<ChatResponse> {
    const response = await api.post<ChatResponse>('/api/llm-chat', request)
    return response.data
  }

  async getDirections(request: DirectionsRequest): Promise<DirectionsResponse> {
    const response = await api.post<DirectionsResponse>('/api/directions', request)
    return response.data
  }
}

export const locationAPI = new LocationAPI()
export default api
