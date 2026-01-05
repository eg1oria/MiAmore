'use client';

import Image from 'next/image';
import './about.scss';
import Link from 'next/link';
import fj from '../../../public/img/about-img.png';
import { Playfair_Display_SC } from 'next/font/google';

const playfair = Playfair_Display_SC({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700', '900'], // Доступные: 400, 700, 900
  variable: '--font-playfair',
  display: 'swap',
});

export default function AboutPage() {
  return (
    <div className={`about ${playfair.variable}`}>
      <h1 className="about_title">О нас</h1>

      <div className="about_content">
        <div className="about_content-left">
          <h2 className="about_content-left_title">MiAmore — цветочная мастерская про чувства</h2>
          <p className="about_content-left_text">
            Мы создаём букеты вручную, вкладывая в них не только цветы, а смысл и настроение
            момента.
          </p>
          <p className="about_content-left_text about_content-left_text-second">
            Каждая композиция продумана до деталей — чтобы помочь сказать то, что словами сказать
            сложно.
          </p>

          <Link href="/flowers" className="about_content-left-link">
            Просмотреть работы
          </Link>
        </div>
        <div className="about_content-right">
          <div className="about_content-right-img-wrapper">
            <Image
              src={fj}
              alt="About Us"
              width={1000}
              height={1000}
              className="about_content-right-img"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
