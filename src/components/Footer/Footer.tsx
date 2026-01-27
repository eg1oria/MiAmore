'use client';
import Link from 'next/link';
import { FaInstagram, FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineClock } from 'react-icons/hi';
import './footer.scss';
import Logo from '../../../public/logo-svg.svg';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <Link className="logoLink" href="/">
              <Logo className="logoLink_url" />
            </Link>
            <p className="footer-description">
              Цветы, которые говорят без слов 🌸
              <br />
              Мы создаём букеты с любовью и вниманием к каждой детали.
            </p>
            <div className="footer-social">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Instagram">
                <FaInstagram className="social-icon" />
              </a>
              <a
                href="https://wa.me/77771234567"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="WhatsApp">
                <FaWhatsapp className="social-icon" />
              </a>
              <a
                href="https://t.me/miamoreflowers"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Telegram">
                <FaTelegramPlane className="social-icon" />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Навигация</h3>
            <ul className="footer-nav">
              <li>
                <Link href="/" className="footer-link">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/flowers" className="footer-link">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/cart" className="footer-link">
                  Корзина
                </Link>
              </li>
              <li>
                <Link href="/about" className="footer-link">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/contact" className="footer-link">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Связаться с нами</h3>
            <div className="footer-contacts">
              <div className="footer-contact-item">
                <HiOutlineLocationMarker className="contact-icon" />
                <span>Алматы, ул. Сейфуллина 67а</span>
              </div>
              <div className="footer-contact-item">
                <HiOutlinePhone className="contact-icon" />
                <a href="tel:+77771234567" className="footer-contact-link">
                  +7 (777) 123-45-67
                </a>
              </div>
              <div className="footer-contact-item">
                <HiOutlineClock className="contact-icon" />
                <span>Ежедневно: 9:00 — 20:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p className="footer-copyright">
            © {new Date().getFullYear()} MiAmore. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
