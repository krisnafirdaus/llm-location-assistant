'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PaperAirplaneIcon, MicrophoneIcon } from '@heroicons/react/24/outline'
import { ChatBubbleLeftIcon, UserIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'
import { locationAPI, type Place } from '@/services/api'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  setPlaces: (places: Place[]) => void
  setIsLoading: (loading: boolean) => void
  isLoading: boolean
}

export function ChatInterface({ setPlaces, setIsLoading, isLoading }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI location assistant. I can help you find restaurants, shops, attractions, and more. Just ask me something like "Find Italian restaurants near me" or "Search for coffee shops in San Francisco"!',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const exampleQueries = [
    '🍕 Find pizza in NYC',
    '☕ Coffee shops nearby',
    '🏛️ Museums in SF',
    '⛽ Gas stations in LA'
  ]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await locationAPI.chatQuery({
        message: inputValue
      })

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Update places if we got location data
      if (response.type === 'places' && response.data?.places) {
        setPlaces(response.data.places)
      } else {
        setPlaces([])
      }

    } catch (error) {
      console.error('Chat error:', error)
      toast.error('Failed to send message. Please try again.')
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const useExampleQuery = (query: string) => {
    const cleanQuery = query.substring(2) // Remove emoji
    setInputValue(cleanQuery)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
    >
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-cyan-500 p-4">
        <div className="flex items-center space-x-3">
          <ChatBubbleLeftIcon className="h-6 w-6 text-white" />
          <h2 className="text-lg font-semibold text-white">AI Chat Assistant</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`p-2 rounded-full ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-indigo-500 to-cyan-500' 
                    : 'bg-gray-200'
                }`}>
                  {message.type === 'user' ? (
                    <UserIcon className="h-4 w-4 text-white" />
                  ) : (
                    <ChatBubbleLeftIcon className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                
                <div className={`rounded-2xl p-4 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-indigo-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-gray-200">
                <ChatBubbleLeftIcon className="h-4 w-4 text-gray-600" />
              </div>
              <div className="bg-gray-100 rounded-2xl p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to find places..."
              className="w-full px-4 py-3 border border-gray-300 rounded-full resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              rows={1}
              disabled={isLoading}
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-full hover:from-indigo-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

        {/* Example Queries */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">💡 Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((query, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => useExampleQuery(query)}
                className="px-3 py-2 text-sm bg-gradient-to-r from-indigo-500 to-cyan-500 text-white rounded-full hover:from-indigo-600 hover:to-cyan-600 transition-all duration-200"
              >
                {query}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
