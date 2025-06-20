"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPinIcon, 
  MagnifyingGlassIcon, 
  UserCircleIcon,
  CogIcon,
  BellIcon,
  HeartIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';
import { 
  MapPinIcon as MapPinSolid,
  HeartIcon as HeartSolid,
  StarIcon as StarSolid
} from '@heroicons/react/24/solid';

interface DashboardProps {
  userEmail: string;
  onSignOut: () => void;
}

interface Place {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: string;
  category: string;
  isFavorite: boolean;
  image?: string;
}

interface RecentSearch {
  id: string;
  query: string;
  timestamp: string;
  results: number;
}

const Dashboard: React.FC<DashboardProps> = ({ userEmail, onSignOut }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'nearby' | 'favorites' | 'recent'>('nearby');
  const [isListening, setIsListening] = useState(false);

  // Mock data
  const [nearbyPlaces] = useState<Place[]>([
    {
      id: '1',
      name: 'Starbucks Coffee',
      address: '123 Main St, Downtown',
      rating: 4.5,
      distance: '0.2 km',
      category: 'Coffee Shop',
      isFavorite: true
    },
    {
      id: '2',
      name: 'Central Park',
      address: 'Central District',
      rating: 4.8,
      distance: '0.5 km',
      category: 'Park',
      isFavorite: false
    },
    {
      id: '3',
      name: 'Tech Mall',
      address: '456 Tech Ave',
      rating: 4.3,
      distance: '1.2 km',
      category: 'Shopping',
      isFavorite: true
    }
  ]);

  const [recentSearches] = useState<RecentSearch[]>([
    { id: '1', query: 'restaurants near me', timestamp: '2 hours ago', results: 15 },
    { id: '2', query: 'coffee shops downtown', timestamp: '1 day ago', results: 8 },
    { id: '3', query: 'gas stations', timestamp: '2 days ago', results: 12 }
  ]);

  const [favorites] = useState<Place[]>(
    nearbyPlaces.filter(place => place.isFavorite)
  );

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Simulate search
    setTimeout(() => {
      setIsSearching(false);
    }, 1500);
  };

  const handleVoiceSearch = () => {
    setIsListening(!isListening);
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setSearchQuery('Find coffee shops near me');
      }, 3000);
    }
  };

  const toggleFavorite = (placeId: string) => {
    // Toggle favorite logic would go here
    console.log('Toggle favorite:', placeId);
  };

  const renderPlaceCard = (place: Place) => (
    <motion.div
      key={place.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:border-purple-400/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-1">{place.name}</h3>
          <p className="text-gray-300 text-sm mb-2">{place.address}</p>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <StarSolid className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm">{place.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPinSolid className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300 text-sm">{place.distance}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleFavorite(place.id)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          {place.isFavorite ? (
            <HeartSolid className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-purple-400 text-sm font-medium bg-purple-400/20 px-3 py-1 rounded-full">
          {place.category}
        </span>
        <button className="text-purple-400 hover:text-purple-300 transition-colors">
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="text-xl font-bold text-white">
                  LLM<span className="text-purple-400">MAPS</span>
                </div>
              </div>
              <div>
                <h1 className="text-white text-xl font-semibold">Welcome back!</h1>
                <p className="text-gray-300 text-sm">{userEmail}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                <BellIcon className="w-6 h-6" />
              </button>
              <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                <CogIcon className="w-6 h-6" />
              </button>
              <button 
                onClick={onSignOut}
                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <UserCircleIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Search Section */}
        <section className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for places, restaurants, or ask anything..."
                className="w-full pl-14 pr-20 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
              <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-4">
                <button
                  onClick={handleVoiceSearch}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isListening ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <MicrophoneIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isSearching}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl hover:from-purple-700 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Quick Actions */}
        <section className="px-6 mb-6">
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { icon: MapPinIcon, label: 'Nearby', color: 'purple' },
              { icon: StarIcon, label: 'Top Rated', color: 'yellow' },
              { icon: HeartIcon, label: 'Favorites', color: 'red' },
              { icon: ClockIcon, label: 'Recent', color: 'blue' }
            ].map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-purple-400/50 transition-all duration-300"
              >
                <action.icon className={`w-8 h-8 mx-auto mb-2 text-${action.color}-400`} />
                <p className="text-white text-sm font-medium">{action.label}</p>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Content Tabs */}
        <section className="px-6">
          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-white/10 rounded-2xl p-1 mb-6">
              {[
                { id: 'nearby' as const, label: 'Nearby Places' },
                { id: 'favorites' as const, label: 'Favorites' },
                { id: 'recent' as const, label: 'Recent Searches' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'nearby' && (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {nearbyPlaces.map(renderPlaceCard)}
                  </div>
                )}

                {activeTab === 'favorites' && (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {favorites.length > 0 ? (
                      favorites.map(renderPlaceCard)
                    ) : (
                      <div className="col-span-full text-center py-12">
                        <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No favorites yet</p>
                        <p className="text-gray-500 text-sm">Start exploring and save your favorite places!</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'recent' && (
                  <div className="space-y-4">
                    {recentSearches.map((search) => (
                      <motion.div
                        key={search.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:border-purple-400/50 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-medium">{search.query}</h3>
                            <p className="text-gray-400 text-sm">{search.results} results • {search.timestamp}</p>
                          </div>
                          <button className="text-purple-400 hover:text-purple-300 transition-colors">
                            <ArrowRightIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
