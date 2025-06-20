"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, 
  UserCircleIcon, 
  PlusIcon, 
  ArrowRightIcon,
  WifiIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import ChatConversation from './ChatConversation';

interface ChatSetupProps {
  onComplete?: (nickname: string) => void;
}

const ChatSetup: React.FC<ChatSetupProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'nickname' | 'chat'>('welcome');
  const [selectedNickname, setSelectedNickname] = useState('');
  const [customNickname, setCustomNickname] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [finalNickname, setFinalNickname] = useState('');

  // Suggested nicknames
  const suggestedNames = ['Boss', 'Chief', 'Sir', 'Master', 'Captain', 'Leader'];

  // Update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleReady = () => {
    setIsReady(true);
    setTimeout(() => {
      setCurrentStep('nickname');
    }, 1000);
  };

  const handleNicknameSelect = (nickname: string) => {
    setSelectedNickname(nickname);
    setCustomNickname('');
  };

  const handleCustomNicknameChange = (value: string) => {
    setCustomNickname(value);
    setSelectedNickname('');
  };

  const handleSubmit = () => {
    const nickname = customNickname || selectedNickname || 'Friend';
    setFinalNickname(nickname);
    if (onComplete) {
      onComplete(nickname);
    }
    setTimeout(() => {
      setCurrentStep('chat');
    }, 500);
  };

  const handleBackToSetup = () => {
    setCurrentStep('welcome');
    setSelectedNickname('');
    setCustomNickname('');
    setFinalNickname('');
    setIsReady(false);
  };

  const getActiveNickname = () => customNickname || selectedNickname;

  if (currentStep === 'chat') {
    return (
      <ChatConversation 
        nickname={finalNickname} 
        onBack={handleBackToSetup}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex flex-col">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-6 py-3 text-white text-sm">
        <div className="flex items-center space-x-1">
          <span className="font-medium">{currentTime}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white rounded-full"></div>
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
            <div className="w-1 h-3 bg-white/30 rounded-full"></div>
          </div>
          <WifiIcon className="w-4 h-4" />
          <div className="flex items-center space-x-1">
            <BoltIcon className="w-5 h-5" />
            <span className="text-xs">87%</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20"
        >
          <UserCircleIcon className="w-6 h-6 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-xl font-bold text-white tracking-wider">
            LLM<span className="text-purple-400">PICO</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20"
        >
          <Bars3Icon className="w-6 h-6 text-white" />
        </motion.div>
      </header>

      {/* Chat Content */}
      <div className="flex-1 px-6 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Welcome Message */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white text-lg leading-relaxed"
                >
                  Welcome to <span className="text-purple-400 font-semibold">PICO setup lab</span>! 
                  I&apos;m here to help you navigate and discover amazing places around you. 
                  Let&apos;s get started with a quick setup to personalize your experience.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-end mt-6"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReady}
                    disabled={isReady}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50"
                  >
                    {isReady ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Ready!</span>
                      </div>
                    ) : (
                      "I&apos;m Ready!"
                    )}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}

          {currentStep === 'nickname' && (
            <motion.div
              key="nickname"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Question */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-white mb-4">
                  What should I call you?
                </h2>
                <p className="text-gray-300 text-sm">
                  Choose from suggestions below or type your preferred name
                </p>
              </motion.div>

              {/* Suggested Nicknames */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <p className="text-gray-400 text-sm font-medium">Suggested:</p>
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {suggestedNames.map((name, index) => (
                    <motion.button
                      key={name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleNicknameSelect(name)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full border transition-all duration-300 ${
                        selectedNickname === name
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/15 hover:border-white/30'
                      }`}
                    >
                      {name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Custom Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <p className="text-gray-400 text-sm font-medium">Or type custom name:</p>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <PlusIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={customNickname}
                    onChange={(e) => handleCustomNicknameChange(e.target.value)}
                    placeholder="Call me John"
                    className="w-full pl-12 pr-16 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSubmit}
                    disabled={!getActiveNickname()}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-400 hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowRightIcon className="w-6 h-6" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Preview */}
              <AnimatePresence>
                {getActiveNickname() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                  >
                    <p className="text-gray-300 text-center">
                      Preview: &quot;Hello, <span className="text-purple-400 font-semibold">{getActiveNickname()}</span>! 
                      How can I help you today?&quot;
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={!getActiveNickname()}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue with &quot;{getActiveNickname()}&quot;
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Safe Area */}
      <div className="h-8"></div>
    </div>
  );
};

export default ChatSetup;
