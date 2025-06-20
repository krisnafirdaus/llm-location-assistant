"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, 
  UserCircleIcon, 
  PaperAirplaneIcon,
  MicrophoneIcon,
  PlusIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { 
  MicrophoneIcon as MicrophoneSolid,
  MapPinIcon as MapPinSolid
} from '@heroicons/react/24/solid';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  places?: Array<{
    name: string;
    distance: string;
    rating: number;
  }>;
}

interface ChatInterfaceProps {
  nickname: string;
  onBack: () => void;
}

const ChatConversation: React.FC<ChatInterfaceProps> = ({ nickname, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hello, ${nickname}! I'm ready to help you discover amazing places around you. What are you looking for today?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: generateBotResponse(inputText),
        timestamp: new Date(),
        places: inputText.toLowerCase().includes('restaurant') || inputText.toLowerCase().includes('coffee') ? [
          { name: 'Local Coffee Shop', distance: '0.2 km', rating: 4.5 },
          { name: 'Italian Restaurant', distance: '0.5 km', rating: 4.8 }
        ] : undefined
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('restaurant') || lowerInput.includes('food')) {
      return `I found some great restaurants near you, ${nickname}! Here are my top recommendations based on ratings and distance.`;
    } else if (lowerInput.includes('coffee') || lowerInput.includes('cafe')) {
      return `Perfect! I know some excellent coffee spots in your area, ${nickname}. Check out these highly-rated cafes!`;
    } else if (lowerInput.includes('gas') || lowerInput.includes('fuel')) {
      return `I can help you find the nearest gas stations, ${nickname}. Here are the closest ones with current prices.`;
    } else {
      return `I understand you're looking for "${input}". Let me search for the best options in your area, ${nickname}!`;
    }
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setInputText('Find coffee shops near me');
      }, 3000);
    }
  };

  const quickSuggestions = [
    { text: 'Find restaurants', icon: '🍽️' },
    { text: 'Coffee shops', icon: '☕' },
    { text: 'Gas stations', icon: '⛽' },
    { text: 'ATMs nearby', icon: '🏧' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20"
        >
          <UserCircleIcon className="w-6 h-6 text-white" />
        </motion.button>

        <div className="text-center">
          <div className="text-lg font-bold text-white">
            Chat with <span className="text-purple-400">PICO</span>
          </div>
          <div className="text-xs text-gray-400">AI Location Assistant</div>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20"
        >
          <Bars3Icon className="w-6 h-6 text-white" />
        </motion.div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.type === 'user' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                  : 'bg-white/10 backdrop-blur-md border border-white/20 text-white'
              }`}>
                <p className="text-sm">{message.content}</p>
                {message.places && (
                  <div className="mt-3 space-y-2">
                    {message.places.map((place, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/10 rounded-xl p-3 border border-white/20"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{place.name}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-300">
                              <MapPinSolid className="w-3 h-3" />
                              <span>{place.distance}</span>
                              <span>⭐ {place.rating}</span>
                            </div>
                          </div>
                          <button className="text-purple-400 hover:text-purple-300">
                            <MapPinIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                <div className="text-xs text-gray-400 mt-2">
                  {message.timestamp.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-300">PICO is typing...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="px-4 py-2">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {quickSuggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion.text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setInputText(suggestion.text)}
              className="flex-shrink-0 flex items-center space-x-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm hover:bg-white/15 transition-all duration-300"
            >
              <span>{suggestion.icon}</span>
              <span>{suggestion.text}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
          </motion.button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Ask me anything, ${nickname}...`}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleVoiceInput}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
          >
            {isListening ? <MicrophoneSolid className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ChatConversation;
