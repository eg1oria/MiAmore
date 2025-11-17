'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import './auth.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

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

    return str.replace(/[&<>"'`=\/]/g, (match) => map[match] || match);
  };

  const sanitizeName = (name: string): string =>
    escapeHtml(name.trim().replace(/[^a-zA-Zа-яА-ЯёЁ\s\-]/g, ''));

  const sanitizeEmail = (email: string): string => escapeHtml(email.trim().toLowerCase());

  const sanitizePassword = (password: string): string => escapeHtml(password.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanName = sanitizeName(name);
    const cleanEmail = sanitizeEmail(email);
    const cleanPassword = sanitizePassword(password);
    const cleanConfirm = sanitizePassword(confirmPassword);

    if (cleanPassword !== cleanConfirm) {
      setError('Пароли не совпадают');
      return;
    }

    if (cleanPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);

    try {
      await register(cleanEmail, cleanPassword, cleanName);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Ошибка при регистрации');
      } else {
        setError('Ошибка при регистрации');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Регистрация</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Имя</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ваше имя"
              disabled={isLoading}
            />
          </div>

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
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="auth-link">
          Уже есть аккаунт? <Link href="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}
