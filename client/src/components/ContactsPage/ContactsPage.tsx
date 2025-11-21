'use client';

import { useAuth } from '@/contexts/AuthContext';
import './contacts.css';
import { useEffect, useState } from 'react';

export default function ContactsPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [userName, setUserName] = useState(user?.name || '');

  useEffect(() => {
    if (user?.name) setUserName(user.name);
  }, [user]);

  // если user приходит позже (например, после fetch)
  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  function sanitizePhone(phone: string) {
    return phone.replace(/[^\d+]/g, '');
  }

  function validate(data: Record<string, string>) {
    const newErrors: Record<string, string> = {};
    if (!data.phone || data.phone.replace(/\D/g, '').length < 10)
      newErrors.phone = 'Введите корректный телефон';
    if (!data.message || data.message.trim().length < 5)
      newErrors.message = 'Сообщение слишком короткое';
    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const raw = Object.fromEntries(formData);

    const data: Record<string, string> = {};
    for (const key in raw) data[key] = raw[key] as string;

    if (data.phone) data.phone = sanitizePhone(data.phone);

    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSubmitted(true);
        form.reset();
      } else {
        const error = await res.json();
        setErrors({ form: error.error || 'Ошибка сервера' });
      }
    } catch {
      setErrors({ form: 'Ошибка сети. Попробуйте позже.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="contacts-page">
      <section className="contacts-hero">
        <h1 className="contacts-hero-title">Контакты</h1>
        <p className="contacts-hero-subtitle">
          Мы всегда на связи и готовы ответить на ваши вопросы
        </p>
      </section>

      <section className="contacts-info">
        <div className="info-grid">
          <div className="info-block">
            <h3>Телефон</h3>
            <a href="tel:+77054424389" className="info-link">
              +7 (705) 442-443-89
            </a>
            <p className="info-description">Ежедневно с 9:00 до 21:00</p>
          </div>
          <div className="info-block">
            <h3>Email</h3>
            <a href="mailto:info@miamore.kz" className="info-link">
              info@miamore.kz
            </a>
            <p className="info-description">Ответим в течение 24 часов</p>
          </div>
          <div className="info-block">
            <h3>Адрес</h3>
            <p className="info-link">г. Астана, ул. Кабанбай Батыра, 15</p>
            <p className="info-description">Пн-Вс: 10:00 - 20:00</p>
          </div>
        </div>
      </section>

      <section className="contacts-form-section">
        <div className="form-container">
          {!submitted ? (
            <>
              <h2 className="form-title">Напишите нам</h2>
              <p className="form-subtitle">
                Оставьте сообщение и мы свяжемся с вами в ближайшее время
              </p>

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Имя</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Ваше имя"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Телефон</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+7 (___) ___-__-__"
                    className={errors.phone ? 'input-error' : ''}
                  />
                  {errors.phone && <p className="error-text show">{errors.phone}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Сообщение</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Ваше сообщение..."
                    className={errors.message ? 'input-error' : ''}
                  />
                  {errors.message && <p className="error-text show">{errors.message}</p>}
                </div>
                {errors.form && <p className="error-text form-error show">{errors.form}</p>}

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'Отправка...' : 'Отправить сообщение'}
                </button>
              </form>
            </>
          ) : (
            <div className="thank-you-block">
              <p>
                Ваше сообщение успешно отправлено.
                <br />
                Мы свяжемся с вами в ближайшее время.
              </p>
              <button className="thank-you-back" onClick={() => setSubmitted(false)}>
                Отправить ещё одно
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="contacts-social">
        <h3>Мы в социальных сетях</h3>
        <div className="social-links">
          <a href="https://www.instagram.com/_le_o_ne_" className="social-link">
            Instagram
          </a>
          <a
            href="https://wa.me/77054424389?text=Здравствуйте+у+меня+один+вопрос"
            className="social-link">
            WhatsApp
          </a>
          <a href="https://t.me/eg1oria" className="social-link">
            Telegram
          </a>
        </div>
      </section>
    </div>
  );
}
