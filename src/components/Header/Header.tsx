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
import { useTheme } from '@/contexts/ThemeContext';
import { Moon } from 'lucide-react';
import { Provider, useSelector } from 'react-redux';
import { RootState, store } from '@/app/store';
import Image from 'next/image';

interface INav {
  name: string;
  href: string;
}

export const navItem: INav[] = [
  { name: 'Главная', href: '/' },
  { name: 'Каталог', href: '/flowers' },
  { name: 'О нас', href: '/about' },
  { name: 'Доставка', href: '/delivery' },
  { name: 'Контакты', href: '/contacts' },
];

export default function Header() {
  const linkPathname = usePathname();
  const { darkTheme, incTheme } = useTheme();
  const { items } = useSelector((state: RootState) => state.cart);

  return (
    <Provider store={store}>
      <header
        className="header"
        style={{ background: darkTheme ? '#fff' : '#222', color: darkTheme ? '#3d2d19' : '#ddd' }}>
        <div className="container">
          <div className="headerContent">
            <div className="headerLogo">
              <Link className="logoLink" href="/">
                <Image src="/img/logo-png.png" alt="Наша история" width={40} height={40} />
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
                      color:
                        isActive && !darkTheme
                          ? 'rgba(178, 255, 90, 1)'
                          : isActive
                          ? 'rgb(86, 153, 10)'
                          : darkTheme
                          ? '#222'
                          : '#ddd',
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
              <button className="themeButton" onClick={incTheme}>
                <MdOutlineWbSunny
                  className="themeButtonIcon"
                  size={24}
                  style={{
                    background: darkTheme ? '#ffe7e7ff' : '#210101d5',
                    opacity: darkTheme ? '1' : '0',
                    transform: darkTheme ? 'translateX(0)' : 'translateX(30px)',
                    color: 'black',
                  }}
                />
                <Moon
                  className="themeButtonIcon"
                  size={24}
                  style={{
                    background: darkTheme ? '#ffe7e7ff' : '#210101d5',
                    opacity: darkTheme ? '0' : '1',
                    transform: darkTheme ? 'translateX(0)' : 'translateX(30px)',
                  }}
                />
              </button>

              <Link className="cartIcon" href="/cart">
                <IoCart size={26} />
                {items.length > 0 && <span className="cartCount">{items.length}</span>}
              </Link>

              <Link className="cartIcon" href="/favorites">
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
    </Provider>
  );
}
