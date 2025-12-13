'use client';

import Link from 'next/link';
import h from './Header.module.scss';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import INav from '@/types/INav';

export const navItem: INav[] = [
  { name: 'Каталог', href: '/flowers' },
  { name: 'Контакты', href: '/contacts' },
  { name: 'О нас', href: '/about' },
];

export default function Header() {
  const { isAuthenticated } = useAuth();
  const { cart } = useCart();

  const totalItems = isAuthenticated ? cart.reduce((sum, item) => sum + item.count, 0) : 0;

  return (
    <header className={h.header}>
      <div className={h.header_wrapper}>
        <div className={h.header_wrapper_left}>
          <Link className={h.header_wrapper_left_logo} href="/">
            <Image src="/logo-svg.svg" alt="Наша история" width={210} height={1} />
          </Link>
          <nav className={h.header_wrapper_left_nav}>
            {navItem.map((item) => {
              return (
                <Link className={h.header_wrapper_left_nav_item} key={item.name} href={item.href}>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className={h.header_wrapper_right}>
          <Image src={'/icons/icon-search.svg'} alt="найти" width={27} height={27} />
          <Link className={h.header_wrapper_right_icon} href="/">
            <Image src={'/icons/icon-fav.svg'} alt="найти" width={27} height={27} />
          </Link>
          <Link className={h.header_wrapper_right_icon} href="/cart">
            <Image src={'/icons/icon-cart.svg'} alt="найти" width={27} height={27} />
            {totalItems < 1 ? null : (
              <span className={h.header_wrapper_right_icon_count}>{totalItems}</span>
            )}
          </Link>
          {isAuthenticated ? (
            <Link className={h.header_wrapper_right_icon} href="/user">
              <Image src={'/icons/icon-profile.svg'} alt="найти" width={27} height={27} />
            </Link>
          ) : (
            <Link href="/login" className={h.header_wrapper_right_logout}>
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
