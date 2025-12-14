'use client';

import Link from 'next/link';
import h from './Header.module.scss';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import INav from '@/types/INav';
import HeaderSearchBtn from './HeaderSearchBtn';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const navItem: INav[] = [
  { name: 'Каталог', href: '/flowers' },
  { name: 'Контакты', href: '/contacts' },
  { name: 'О нас', href: '/about' },
];

export default function Header() {
  const { isAuthenticated } = useAuth();
  const { cart } = useCart();
  const [searchShow, SetSearchShow] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const totalItems = isAuthenticated ? cart.reduce((sum, item) => sum + item.count, 0) : 0;

  const handleSearch = () => {
    SetSearchShow((prev) => !prev);

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const handleMouseOut = () => {
    const input = searchInputRef.current;
    if (!input) return;
    const hasValue = input.value.trim().length > 0;

    if (hasValue) return;

    SetSearchShow(false);
  };

  return (
    <header className={h.header}>
      <div className={h.header_wrapper}>
        <div className={h.header_wrapper_left}>
          <Link className={h.header_wrapper_left_logo} href="/">
            <Image
              src="/logo-svg.svg"
              alt="Наша история"
              width={210}
              height={1}
              className={h.header_wrapper_left_logo_url}
            />
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
          <AnimatePresence mode="wait">
            {searchShow && (
              <HeaderSearchBtn
                onMouseOut={handleMouseOut}
                inputRef={searchInputRef}
                isOpen={searchShow}
              />
            )}
          </AnimatePresence>

          <motion.button
            className={h.header_wrapper_right_searchBtn}
            onClick={handleSearch}
            animate={{ scale: searchShow ? 0.9 : 1 }}
            transition={{ duration: 0.2 }}>
            {!searchShow ? (
              <Image src={'/icons/icon-search.svg'} alt="найти" width={27} height={27} />
            ) : null}
          </motion.button>

          <AnimatePresence>
            {!searchShow && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
