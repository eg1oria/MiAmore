'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import '../login/auth.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const escapeHtml = (str: string) =>
    str.replace(/[&<>"'`=\/]/g, (char) => {
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
      return map[char] || char;
    });

  const validateField = (name: string, value: string) => {
    const safe = escapeHtml(value.trim());
    switch (name) {
      case 'name':
        if (!safe) return 'Введите имя';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safe)) return 'Некорректный email';
        break;
      case 'password':
        if (safe.length < 6) return 'Пароль слишком короткий';
        if (/[<>]/.test(safe)) return 'Пароль содержит запрещённые символы';
        break;
      case 'confirmPassword':
        if (safe !== formData.password) return 'Пароли не совпадают';
        break;
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const fieldErrors: typeof errors = {};
    Object.entries(formData).forEach(([key, val]) => {
      const error = validateField(key, val);
      if (error) fieldErrors[key as keyof typeof errors] = error;
    });

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      await register(
        escapeHtml(formData.email),
        escapeHtml(formData.password),
        escapeHtml(formData.name),
      );
    } catch (err) {
      fieldErrors.form =
        err instanceof Error ? err.message || 'Ошибка при регистрации' : 'Ошибка при регистрации';
      setErrors(fieldErrors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Регистрация</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Имя</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ваше имя"
              disabled={isLoading}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <p className="error-text show">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="your@email.com"
              disabled={isLoading}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <p className="error-text show">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <p className="error-text show">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              className={errors.confirmPassword ? 'input-error' : ''}
            />
            {errors.confirmPassword && <p className="error-text show">{errors.confirmPassword}</p>}
          </div>

          {errors.form && <p className="error-text form-error show">{errors.form}</p>}

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
