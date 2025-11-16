'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Проверка токена при загрузке
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:4000/auth/check', {
        credentials: 'include', // Важно для cookies
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isAuthenticated && data.user) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Важно для cookies
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Ошибка авторизации' }));
        throw new Error(error.error || 'Ошибка авторизации');
      }

      const data = await response.json();

      setUser(data.user);
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Неизвестная ошибка');
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Важно для cookies
        body: JSON.stringify({ username: name || email, email, password }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Ошибка регистрации' }));
        throw new Error(error.error || 'Ошибка регистрации');
      }

      const data = await response.json();

      setUser(data.user);
      router.push('/');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Неизвестная ошибка');
    }
  };

  const logout = () => {
    fetch('http://localhost:4000/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
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
