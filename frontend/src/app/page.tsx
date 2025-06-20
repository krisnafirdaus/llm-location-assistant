'use client'

import { useState } from 'react'
import { ChatInterface } from '@/components/ChatInterface'
import { PlaceResults } from '@/components/PlaceResults'
import { Header } from '@/components/Header'
import { HealthStatus } from '@/components/HealthStatus'
import { Toaster } from 'react-hot-toast'
import { type Place } from '@/services/api'

export default function Home() {
  const [places, setPlaces] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Toaster position="top-right" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Chat Interface */}
          <div className="space-y-6">
            <HealthStatus />
            <ChatInterface 
              setPlaces={setPlaces}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
          </div>

          {/* Results */}
          <div className="space-y-6">
            <PlaceResults 
              places={places}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
