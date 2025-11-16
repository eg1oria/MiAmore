'use client';

import Link from 'next/link';
import './Header.css';
import { IoCart } from 'react-icons/io5';
import { MdOutlineWbSunny } from 'react-icons/md';
import { PiLeafLight } from 'react-icons/pi';
import { usePathname } from 'next/navigation';
import { PiLeafFill } from 'react-icons/pi';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon } from 'lucide-react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';

interface INav {
  name: string;
  href: string;
}

export const navItem: INav[] = [
  { name: 'Главная', href: '/' },
  { name: 'Каталог', href: '/flowers' },
  { name: 'О нас', href: '/about' },
  { name: 'Контакты', href: '/contacts' },
];

export default function Header() {
  const linkPathname = usePathname();
  const { darkTheme, incTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.count, 0);

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
                {totalItems < 1 ? null : <span className="cartCount">{totalItems}</span>}
              </Link>
              {isAuthenticated ? (
                <div className="header__user">
                  <div className="user-info">
                    <FaUser size={16} />
                    <span>{user?.name || user?.email}</span>
                  </div>
                  <button onClick={logout} className="logout-btn" title="Выйти">
                    <FaSignOutAlt size={18} fill="red" />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="header__login">
                  Войти
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="headerSale">Скидка 15% на букеты ко Дню рождения!</div>
      </header>
    </Provider>
  );
}
