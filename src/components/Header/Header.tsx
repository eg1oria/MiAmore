'use client';

import Link from 'next/link';
import h from './Header.module.scss';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import INav from '@/types/INav';
import HeaderSearchBtn from './HeaderSearchBtn';
import Logo from '../../../public/logo-svg.svg';
import SearchIcon from '../../../public/icons/icon-search.svg';
import FavIcon from '../../../public/icons/icon-fav.svg';
import CartIcon from '../../../public/icons/icon-cart.svg';
import UserIcon from '../../../public/icons/icon-profile.svg';

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
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    <>
      <div className={h.hower}>
        <header className={h.header}>
          <div className={h.header_wrapper}>
            <div className={h.header_wrapper_left}>
              <Link className={h.header_wrapper_left_logo} href="/">
                <Logo className={h.header_wrapper_left_logo_url} />
              </Link>
              <nav className={h.header_wrapper_left_nav}>
                {navItem.map((item) => {
                  return (
                    <Link
                      className={h.header_wrapper_left_nav_item}
                      key={item.name}
                      href={item.href}>
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
                {!searchShow ? <SearchIcon className={h.header_wrapper_right_icon_url} /> : null}
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
                      <FavIcon className={h.header_wrapper_right_icon_url} />
                    </Link>
                    <Link className={h.header_wrapper_right_icon} href="/cart">
                      <CartIcon className={h.header_wrapper_right_icon_url} />
                      {totalItems < 1 ? null : (
                        <span className={h.header_wrapper_right_icon_count}>{totalItems}</span>
                      )}
                    </Link>
                    {isAuthenticated ? (
                      <Link className={h.header_wrapper_right_icon} href="/user">
                        <UserIcon className={h.header_wrapper_right_icon_url} />
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
      </div>
    </>
  );
}
