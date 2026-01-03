'use client';
import Link from 'next/link';
import { FaInstagram, FaWhatsapp, FaTelegramPlane } from 'react-icons/fa';
import './footer.css';

export default function Footer() {
  return (
    <footer className="w-full bg-pink-900 border-t border-pink-700">
      <div className="container">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-pink-700">MiAmore</h3>
            <p className="text-sm">
              Цветы, которые говорят без слов 🌸 Мы создаём букеты с любовью и вниманием к деталям.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-pink-700">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/">Главная</Link>
              </li>
              <li>
                <Link href="/flowers">Каталог</Link>
              </li>
              <li>
                <Link href="/cart">Корзина</Link>
              </li>
              <li>
                <Link href="/about">О нас</Link>
              </li>
              <li>
                <Link href="/contact">Контакты</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-pink-700">Связаться с нами</h3>
            <p className="text-sm">📍 Алматы, ул. Цветочная 7</p>
            <p className="text-sm">📞 +7 (777) 123-45-67</p>
            <p className="text-sm">🕓 Ежедневно: 9:00 — 20:00</p>

            <div className="flex items-center gap-4 mt-3">
              <a href="#" className="hover:text-pink-500" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="hover:text-pink-500" aria-label="WhatsApp">
                <FaWhatsapp size={20} />
              </a>
              <a href="#" className="hover:text-pink-500" aria-label="Telegram">
                <FaTelegramPlane size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className=" text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} MiAmore. Все права защищены.
      </div>
    </footer>
  );
}
