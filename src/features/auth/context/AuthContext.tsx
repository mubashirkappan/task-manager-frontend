import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import type { User, AuthResponse } from '../types';
import { getAccessToken, setAccessToken, clearAccessToken } from '../utils/token';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await apiClient.get<User>('/me');
        setUser(data);
      } catch {
        clearAccessToken();
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const { data } = await apiClient.post<AuthResponse>('/login', credentials);
    // Drop any cached data from a previous session before switching users.
    queryClient.clear();
    setAccessToken(data.access_token);
    setUser(data.user);
  };

  const register = async (payload: { name: string; email: string; password: string }) => {
    const { data } = await apiClient.post<AuthResponse>('/register', payload);
    // Drop any cached data from a previous session before switching users.
    queryClient.clear();
    setAccessToken(data.access_token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await apiClient.post('/logout');
    } finally {
      clearAccessToken();
      queryClient.clear();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};