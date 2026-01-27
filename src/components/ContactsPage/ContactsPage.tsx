'use client';

import { useAuth } from '@/contexts/AuthContext';
import './contacts.scss';
import { useEffect, useState } from 'react';
import { BsTiktok } from 'react-icons/bs';
import { FaInstagram } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';

const port = 'https://flower-shop-backend-6hsn.onrender.com';

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
      const res = await fetch(`${port}/contact`, {
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
        <h2 className="contacts_social-title">Мы на связи</h2>
        <p className="contacts_social-text">
          Instagram — работы и букеты TikTok — процесс WhatsApp — быстрый заказ
        </p>
        <div className="сontacts_social-container">
          <BsTiktok className="social-icon" />
<FaInstagram className="social-icon" />
<FaWhatsapp className="social-icon" />
        </div>
      </section>
    </div>
  );
}
