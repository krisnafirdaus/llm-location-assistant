'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import { locationAPI, type HealthResponse } from '@/services/api'

export function HealthStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await locationAPI.checkHealth()
        setHealth(data)
      } catch (error) {
        console.error('Health check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkHealth()
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <div className="flex items-center space-x-3">
          <ClockIcon className="h-6 w-6 text-gray-400 animate-spin" />
          <span className="text-gray-600">Checking system status...</span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
      
      <div className="space-y-3">
        <StatusItem 
          label="API Server"
          status={health?.status === 'healthy'}
          description={health?.status === 'healthy' ? 'Online' : 'Offline'}
        />
        
        <StatusItem 
          label="Google Maps"
          status={health?.google_maps_configured || false}
          description={health?.google_maps_configured ? 'Configured' : 'API key needed'}
        />
        
        <StatusItem 
          label="Redis Cache"
          status={health?.redis_connected || false}
          description={health?.redis_connected ? 'Connected' : 'Using memory cache'}
        />
      </div>

      {!health?.google_maps_configured && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <p className="text-sm text-amber-800">
            💡 Add your Google Maps API key to enable full functionality
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

interface StatusItemProps {
  label: string
  status: boolean
  description: string
}

function StatusItem({ label, status, description }: StatusItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        {status ? (
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
        ) : (
          <XCircleIcon className="h-5 w-5 text-red-500" />
        )}
        <span className="font-medium text-gray-900">{label}</span>
      </div>
      <span className={`text-sm ${status ? 'text-green-600' : 'text-red-600'}`}>
        {description}
      </span>
    </div>
  )
}
