'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import './auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // --- Защита от XSS ---
  const escapeHtml = (str: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;',
    };

    return str.replace(/[&<>"'`=\/]/g, (char: string) => map[char] || char);
  };

  // --- Валидация email ---
  const validateEmail = (email: string) => {
    const safe = escapeHtml(email.trim());
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(safe);
  };

  // --- Валидация password ---
  const validatePassword = (password: string) => {
    if (password.length < 6) return false;
    return !/[<>]/.test(password); // нельзя вставлять теги
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const safeEmail = escapeHtml(email.trim());
    const safePassword = escapeHtml(password);

    if (!validateEmail(safeEmail)) {
      setError('Некорректный email');
      setIsLoading(false);
      return;
    }

    if (!validatePassword(safePassword)) {
      setError('Пароль содержит запрещённые символы');
      setIsLoading(false);
      return;
    }

    try {
      await login(safeEmail, safePassword);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Неверный email или пароль');
      } else {
        setError('Неверный email или пароль');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Вход</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              disabled={isLoading}
              maxLength={80}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={isLoading}
              minLength={6}
              maxLength={64}
            />
          </div>

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="auth-link">
          Нет аккаунта? <Link href="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
