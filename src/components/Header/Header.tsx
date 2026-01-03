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

import { useRef, useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const navItem: INav[] = [
  { name: 'Каталог', href: '/flowers' },
  { name: 'Контакты', href: '/contacts' },
  { name: 'О нас', href: '/about' },
];

export default function Header() {
  const { isAuthenticated } = useAuth();
  const { cart } = useCart();
  const [searchShow, setSearchShow] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const totalItems = isAuthenticated ? cart.reduce((sum, item) => sum + item.count, 0) : 0;

  // Close mobile menu on route change or resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSearch = useCallback(() => {
    setSearchShow((prev) => !prev);
    setMobileMenuOpen(false);

    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  }, []);

  const handleMouseOut = useCallback(() => {
    const input = searchInputRef.current;
    if (!input) return;
    const hasValue = input.value.trim().length > 0;
    if (hasValue) return;

    setSearchShow(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
    setSearchShow(false);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <>
      <div className={h.hower}>
        <header className={h.header}>
          <div className={h.header_wrapper}>
            {/* LEFT SECTION */}
            <div className={h.header_wrapper_left}>
              <Link
                className={h.header_wrapper_left_logo}
                href="/"
                onClick={closeMobileMenu}
                aria-label="Главная страница">
                <Logo className={h.header_wrapper_left_logo_url} />
              </Link>

              {/* Desktop Navigation */}
              <nav className={h.header_wrapper_left_nav} aria-label="Основная навигация">
                {navItem.map((item) => (
                  <Link
                    className={h.header_wrapper_left_nav_item}
                    key={item.name}
                    href={item.href}
                    aria-label={item.name}>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* RIGHT SECTION */}
            <div className={h.header_wrapper_right}>
              {/* Search Input */}
              <AnimatePresence mode="wait">
                {searchShow && (
                  <HeaderSearchBtn
                    onMouseOut={handleMouseOut}
                    inputRef={searchInputRef}
                    isOpen={searchShow}
                  />
                )}
              </AnimatePresence>

              {/* Search Button */}
              <motion.button
                className={h.header_wrapper_right_searchBtn}
                onClick={handleSearch}
                animate={{ scale: searchShow ? 0.9 : 1 }}
                transition={{ duration: 0.2 }}
                aria-label={searchShow ? 'Закрыть поиск' : 'Открыть поиск'}
                aria-expanded={searchShow}>
                {!searchShow && <SearchIcon className={h.header_wrapper_right_icon_url} />}
              </motion.button>

              {/* Desktop Icons */}
              <AnimatePresence>
                {!searchShow && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <Link className={h.header_wrapper_right_icon} href="/" aria-label="Избранное">
                      <FavIcon className={h.header_wrapper_right_icon_url} />
                    </Link>

                    <Link
                      className={h.header_wrapper_right_icon}
                      href="/cart"
                      aria-label={`Корзина${totalItems > 0 ? `, ${totalItems} товаров` : ''}`}>
                      <CartIcon className={h.header_wrapper_right_icon_url} />
                      {totalItems > 0 && (
                        <span
                          className={h.header_wrapper_right_icon_count}
                          aria-label={`${totalItems} товаров в корзине`}>
                          {totalItems}
                        </span>
                      )}
                    </Link>

                    {isAuthenticated ? (
                      <Link
                        className={h.header_wrapper_right_icon}
                        href="/user"
                        aria-label="Профиль пользователя">
                        <UserIcon className={h.header_wrapper_right_icon_url} />
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        className={h.header_wrapper_right_logout}
                        aria-label="Войти в аккаунт">
                        Войти
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Burger Menu Button */}
              <button
                className={`${h.header_wrapper_right_burger} ${mobileMenuOpen ? h.active : ''}`}
                onClick={toggleMobileMenu}
                aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu">
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            className={h.mobileMenu}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            role="navigation"
            aria-label="Мобильное меню">
            {/* Mobile Navigation */}
            <nav className={h.mobileMenu_nav}>
              {navItem.map((item) => (
                <Link
                  className={h.mobileMenu_nav_item}
                  key={item.name}
                  href={item.href}
                  onClick={closeMobileMenu}>
                  {item.name}
                </Link>
              ))}

              <Link className={h.mobileMenu_nav_item} href="/cart" onClick={closeMobileMenu}>
                Корзина
                {totalItems > 0 && (
                  <span
                    style={{
                      background: 'var(--header-accent)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                    }}>
                    {totalItems}
                  </span>
                )}
              </Link>

              <Link className={h.mobileMenu_nav_item} href="/" onClick={closeMobileMenu}>
                Избранное
              </Link>
            </nav>

            {/* Mobile Actions */}
            <div className={h.mobileMenu_actions}>
              {isAuthenticated ? (
                <Link
                  href="/user"
                  className={h.mobileMenu_actions_profile}
                  onClick={closeMobileMenu}>
                  <UserIcon style={{ width: '20px', height: '20px' }} />
                  Мой профиль
                </Link>
              ) : (
                <Link
                  href="/login"
                  className={h.mobileMenu_actions_login}
                  onClick={closeMobileMenu}>
                  Войти
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 998,
            }}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </>
  );
}
