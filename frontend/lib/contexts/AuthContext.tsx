'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Usuario, LoginRequest, LoginResponse } from '@/lib/types/api';
import client from '@/lib/api/client';

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  setUser: (user: Usuario | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Failed to parse saved user:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    try {
      const response = await client.post<LoginResponse>('/auth/login', credentials);
      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
