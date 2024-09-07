"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, getUserData, User } from '@/lib/userUtils';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  setAuthStatus: (status: boolean, user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = isAuthenticated();
      setIsLoggedIn(authStatus);
      if (authStatus) {
        const userData = getUserData();
        setUser(userData?.user || null);
      } else {
        setUser(null);
      }
    };

    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    return () => window.removeEventListener('storage', checkAuthStatus);
  }, []);

  const setAuthStatus = (status: boolean, user: User | null) => {
    setIsLoggedIn(status);
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};