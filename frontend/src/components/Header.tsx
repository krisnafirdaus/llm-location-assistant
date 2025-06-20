'use client'

import { motion } from 'framer-motion'
import { MapPinIcon, SparklesIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
            >
              <MapPinIcon className="h-8 w-8 text-white" />
            </motion.div>
            
            <div>
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent"
              >
                LLM Location Assistant
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mt-2 flex items-center space-x-2"
              >
                <SparklesIcon className="h-5 w-5" />
                <span>Powered by AI & Google Maps</span>
                <SparklesIcon className="h-5 w-5" />
              </motion.p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/chat">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl hover:from-green-700 hover:to-emerald-600 transition-all duration-300"
              >
                <SparklesIcon className="h-5 w-5" />
                <span>Chat with PICO</span>
              </motion.button>
            </Link>
            <Link href="/auth">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-xl hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
              >
                <UserCircleIcon className="h-5 w-5" />
                <span>Sign In</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
