'use client';

import Image from 'next/image';
import './about.css';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container about-page">
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">О нашем магазине</h1>
          <p className="hero-subtitle">Цветы, которые создают настроение с 2020 года</p>
        </div>
      </section>

      <section className="about-story">
        <div className="story-image">
          <Image src="/img/logo-png.png" alt="Наша история" width={400} height={300} />
        </div>
        <div className="story-text">
          <h2>Наша история</h2>
          <p>
            Всё началось с идеи сделать свежие цветы доступными каждому. Мы верим, что красота
            природы должна быть частью повседневной жизни.
          </p>
          <p>
            Мы сотрудничаем с лучшими поставщиками, чтобы вы получали самые свежие и качественные
            букеты.
          </p>
        </div>
      </section>

      <section className="about-values">
        <h2>Наши ценности</h2>
        <div className="values-grid">
          <div className="value-item">
            <h3>Качество</h3>
            <p>Только свежие цветы от проверенных поставщиков</p>
          </div>
          <div className="value-item">
            <h3>Простота</h3>
            <p>Легкий заказ и быстрая доставка</p>
          </div>
          <div className="value-item">
            <h3>Забота</h3>
            <p>Каждый букет упакован с любовью</p>
          </div>
          <div className="value-item">
            <h3>Прозрачность</h3>
            <p>Честные цены без скрытых комиссий</p>
          </div>
        </div>
      </section>

      <section className="about-stats">
        <div className="stat-item">
          <div className="stat-number">5000+</div>
          <div className="stat-label">Довольных клиентов</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">50+</div>
          <div className="stat-label">Видов цветов</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">100%</div>
          <div className="stat-label">Гарантия свежести</div>
        </div>
      </section>

      <section className="about-cta">
        <h2>Хотите связаться с нами?</h2>
        <p>Мы всегда рады помочь выбрать идеальный букет</p>
        <Link href="/contacts" className="cta-button">
          Связаться
        </Link>
      </section>
    </div>
  );
}
