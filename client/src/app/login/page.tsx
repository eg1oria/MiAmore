'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import './auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

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

  // --- Валидация поля по имени ---
  const validateField = (name: string, value: string): string | undefined => {
    const safe = escapeHtml(value.trim());
    switch (name) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safe)) return 'Некорректный email';
        break;
      case 'password':
        if (safe.length < 6) return 'Пароль слишком короткий';
        if (/[<>]/.test(safe)) return 'Пароль содержит запрещённые символы';
        break;
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateField('email', value) }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: validateField('password', value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const safeEmail = escapeHtml(email.trim());
    const safePassword = escapeHtml(password);

    const newErrors: typeof errors = {};
    const emailError = validateField('email', safeEmail);
    const passwordError = validateField('password', safePassword);

    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      await login(safeEmail, safePassword);
    } catch (err) {
      newErrors.form =
        err instanceof Error
          ? err.message || 'Неверный email или пароль'
          : 'Неверный email или пароль';
      setErrors(newErrors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Вход</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="your@email.com"
              disabled={isLoading}
              maxLength={80}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <p className="error-text show">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              disabled={isLoading}
              minLength={6}
              maxLength={64}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <p className="error-text show">{errors.password}</p>}
          </div>

          {errors.form && <p className="error-text form-error show">{errors.form}</p>}

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
