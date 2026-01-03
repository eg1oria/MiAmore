'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  name?: User;
}

interface ServerUser {
  id: string;
  email: string;
  name?: string;
  username?: string;
}

const port = 'https://flower-shop-backend-6hsn.onrender.com';

const AuthContext = createContext<AuthContextType | null>(null);

// Функция для получения токена
function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

// Функция для сохранения токена
function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

// Функция для удаления токена
function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  function normalizeUser(data: ServerUser): User {
    return {
      id: data.id,
      email: data.email,
      name: data.username || '',
    };
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();

        if (!token) {
          console.log('❌ No token found');
          setIsLoading(false);
          return;
        }

        console.log('🔍 Checking auth with token...');

        const response = await fetch(`${port}/auth/check`, {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('📡 Auth check response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Auth check data:', data);

          if (data.isAuthenticated && data.user) {
            setUser(normalizeUser(data.user));
          }
        } else {
          console.log('❌ Auth check failed, removing token');
          removeToken();
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);

      const response = await fetch(`${port}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Login response status:', response.status);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Ошибка авторизации' }));
        throw new Error(error.error || 'Ошибка авторизации');
      }

      const data = await response.json();
      console.log('✅ Login successful, user data:', data);

      // Сохраняем токен
      if (data.token) {
        setToken(data.token);
        console.log('🔑 Token saved to localStorage');
      }

      setUser(normalizeUser(data.user));
      router.push('/');
    } catch (error) {
      console.error('❌ Login error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Неизвестная ошибка');
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      console.log('📝 Attempting registration for:', email);

      const response = await fetch(`${port}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: name || email, email, password }),
      });

      console.log('📡 Register response status:', response.status);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Ошибка регистрации' }));
        throw new Error(error.error || 'Ошибка регистрации');
      }

      const data = await response.json();
      console.log('✅ Registration successful, user data:', data);

      // Сохраняем токен
      if (data.token) {
        setToken(data.token);
        console.log('🔑 Token saved to localStorage');
      }

      setUser(normalizeUser(data.user));
      router.push('/');
    } catch (error) {
      console.error('❌ Registration error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Неизвестная ошибка');
    }
  };

  const logout = () => {
    console.log('👋 Logging out...');

    const token = getToken();

    fetch(`${port}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    }).finally(() => {
      removeToken();
      setUser(null);
      router.push('/login');
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
