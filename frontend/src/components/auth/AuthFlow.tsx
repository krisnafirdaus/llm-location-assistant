"use client";

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SignIn from './SignIn';
import Dashboard from './Dashboard';

interface User {
  email: string;
  name?: string;
}

const AuthFlow: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleSignIn = async (email: string) => {
    // Simulate authentication
    setTimeout(() => {
      setUser({ email });
      setIsAuthenticated(true);
    }, 1500);
  };

  const handleGoogleSignIn = async () => {
    // Simulate Google OAuth
    setTimeout(() => {
      setUser({ 
        email: 'user@gmail.com',
        name: 'Google User'
      });
      setIsAuthenticated(true);
    }, 2000);
  };

  const handleMobileSignIn = async () => {
    // Simulate mobile authentication
    setTimeout(() => {
      setUser({ 
        email: '+1234567890',
        name: 'Mobile User'
      });
      setIsAuthenticated(true);
    }, 2000);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <SignIn
          key="signin"
          onSignIn={handleSignIn}
          onGoogleSignIn={handleGoogleSignIn}
          onMobileSignIn={handleMobileSignIn}
        />
      ) : (
        <Dashboard
          key="dashboard"
          userEmail={user?.email || ''}
          onSignOut={handleSignOut}
        />
      )}
    </AnimatePresence>
  );
};

export default AuthFlow;
