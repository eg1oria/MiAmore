'use client';

import Link from 'next/link';
import './Header.css';
import { GiFlowerTwirl } from 'react-icons/gi';
import { IoCart } from 'react-icons/io5';
import { MdFavorite } from 'react-icons/md';
import { MdOutlineWbSunny } from 'react-icons/md';
import { PiLeafLight } from 'react-icons/pi';
import { usePathname } from 'next/navigation';
import { PiLeafFill } from 'react-icons/pi';

interface INav {
  name: string;
  href: string;
}

const navItem: INav[] = [
  { name: 'Главная', href: '/' },
  { name: 'О нас', href: '/about' },
  { name: 'Доставка', href: '/delivery' },
  { name: 'Контакты', href: '/contacts' },
];

export default function Header() {
  const linkPathname = usePathname();

  return (
    <header className="header">
      <div className="container">
        <div className="headerContent">
          <div className="headerLogo">
            <Link className="logoLink" href="/">
              <GiFlowerTwirl size={30} />
              <p className="logoText">MiAmore</p>
            </Link>
          </div>
          <nav className="headerNav">
            {navItem.map((item) => {
              const isActive = linkPathname === item.href;
              return (
                <Link
                  className="navItem"
                  style={{
                    color: isActive ? 'rgb(86, 153, 10)' : '#3d2d19',
                    background: isActive ? '#b8c5b057' : 'transparent',
                  }}
                  key={item.name}
                  href={item.href}>
                  {isActive ? <PiLeafFill /> : <PiLeafLight />}
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="headerIcons">
            <button className="themeButton">
              <MdOutlineWbSunny size={26} />
            </button>
            <Link className="cartIcon" href="/cart">
              <IoCart size={26} />
            </Link>
            <Link className="cartIcon" href="favorites">
              <MdFavorite
                size={26}
                style={{
                  color: 'rgba(255, 122, 122, 1)',
                }}
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="headerSale">Скидка 15% на букеты ко Дню рождения!</div>
    </header>
  );
}
