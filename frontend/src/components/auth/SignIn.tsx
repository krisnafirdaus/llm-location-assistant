"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EnvelopeIcon, KeyIcon } from '@heroicons/react/24/outline';
import { FcGoogle } from 'react-icons/fc';
import { PhoneIcon } from '@heroicons/react/24/solid';

interface SignInProps {
  onSignIn: (email: string, otp: string) => void;
  onGoogleSignIn: () => void;
  onMobileSignIn: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, onGoogleSignIn, onMobileSignIn }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [retryTime, setRetryTime] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (retryTime > 0) {
      interval = setInterval(() => {
        setRetryTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [retryTime]);

  const handleSendOtp = async () => {
    if (!email) return;
    setIsLoading(true);
    // Simulate OTP sending
    setTimeout(() => {
      setOtpSent(true);
      setRetryTime(30);
      setIsLoading(false);
    }, 1500);
  };

  const handleSignIn = async () => {
    if (!email || !otp) return;
    setIsLoading(true);
    setTimeout(() => {
      onSignIn(email, otp);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-block p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <div className="text-3xl font-bold text-white tracking-wider">
              LLM<span className="text-purple-400">MAPS</span>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">
            Hey! LLMaps has been waiting to assist.
          </h1>
          <p className="text-gray-300 text-sm">
            Sign in to access intelligent location services
          </p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20"
        >
          <div className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* OTP Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder={otpSent ? "Enter OTP code" : "OTP will be sent"}
                disabled={!otpSent}
                className="w-full pl-12 pr-20 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
              />
              {!otpSent && email && (
                <button
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-400 hover:text-purple-300 text-sm font-medium disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </button>
              )}
            </div>

            {/* Retry Timer */}
            {retryTime > 0 && (
              <p className="text-red-400 text-sm text-center">
                Retry in {retryTime}s
              </p>
            )}

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignIn}
              disabled={!email || !otp || isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Login'
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Alternative Login Options */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onGoogleSignIn}
                className="w-full py-4 border border-white/20 text-white font-medium rounded-2xl hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <FcGoogle className="w-6 h-6" />
                <span>Sign in with Google</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onMobileSignIn}
                className="w-full py-4 border border-white/20 text-white font-medium rounded-2xl hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <PhoneIcon className="w-5 h-5" />
                <span>Login with Mobile</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-gray-400 text-xs">
            Copyright 2025 © LLMaps. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignIn;
