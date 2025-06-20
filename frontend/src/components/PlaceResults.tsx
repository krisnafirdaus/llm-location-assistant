'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MapPinIcon, StarIcon, GlobeAltIcon, ClockIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { type Place } from '@/services/api'

interface PlaceResultsProps {
  places: Place[]
  isLoading: boolean
}

export function PlaceResults({ places, isLoading }: PlaceResultsProps) {
  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
      >
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Searching for places...</h3>
          <p className="text-gray-600">Please wait while I find the best options for you.</p>
        </div>
      </motion.div>
    )
  }

  if (!places.length) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
      >
        <div className="text-center">
          <MapPinIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Yet</h3>
          <p className="text-gray-600">
            Start a conversation to discover amazing places around you!
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-4">
        <div className="flex items-center space-x-3">
          <MapPinIcon className="h-6 w-6 text-white" />
          <h2 className="text-lg font-semibold text-white">
            Found {places.length} Places
          </h2>
        </div>
      </div>

      {/* Results */}
      <div className="max-h-96 overflow-y-auto p-4">
        <AnimatePresence>
          {places.map((place, index) => (
            <motion.div
              key={place.place_id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.1 }}
              className="mb-4 last:mb-0"
            >
              <PlaceCard place={place} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function PlaceCard({ place }: { place: Place }) {
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarSolid key={i} className="h-4 w-4 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<StarIcon key="half" className="h-4 w-4 text-yellow-400" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  const getPriceLevel = (level?: number) => {
    if (!level) return null
    return '💰'.repeat(level)
  }

  const formatTypes = (types: string[]) => {
    return types
      .filter(type => !['establishment', 'point_of_interest'].includes(type))
      .slice(0, 3)
      .map(type => type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
      .join(', ')
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {place.name}
          </h3>
          
          {place.rating && (
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                {renderStars(place.rating)}
              </div>
              <span className="text-sm text-gray-600">
                {place.rating.toFixed(1)}
              </span>
              {place.price_level && (
                <span className="text-sm text-gray-600">
                  • {getPriceLevel(place.price_level)}
                </span>
              )}
            </div>
          )}
        </div>

        {place.opening_hours !== undefined && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
            place.opening_hours 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <ClockIcon className="h-3 w-3" />
            <span>{place.opening_hours ? 'Open' : 'Closed'}</span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-start space-x-2">
          <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600">{place.address}</p>
        </div>

        {place.types.length > 0 && (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {place.types.slice(0, 3).map((type, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                >
                  {type.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <motion.a
        href={place.google_maps_url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-lg hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium"
      >
        <GlobeAltIcon className="h-4 w-4" />
        <span>View on Google Maps</span>
      </motion.a>
    </motion.div>
  )
}
