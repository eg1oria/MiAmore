'use client';

import Link from 'next/link';
import h from './Header.module.scss';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useSearch } from '@/contexts/SearchContext';
import INav from '@/types/INav';
import HeaderSearchBtn from './HeaderSearchBtn';
import Logo from '../../../public/logo-svg.svg';
import SearchIcon from '../../../public/icons/icon-search.svg';
import FavIcon from '../../../public/icons/icon-fav.svg';
import CartIcon from '../../../public/icons/icon-cart.svg';
import UserIcon from '../../../public/icons/icon-profile.svg';

import { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { RxHamburgerMenu } from 'react-icons/rx';
import { IoMdClose } from 'react-icons/io';

export const navItem: INav[] = [
  { name: 'Каталог', href: '/flowers' },
  { name: 'Контакты', href: '/contacts' },
  { name: 'О нас', href: '/about' },
];

export default function Header() {
  const { isAuthenticated } = useAuth();
  const { cart } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();
  const router = useRouter();
  const [searchShow, SetSearchShow] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  const [burgerOpen, SetBurgerOpen] = useState(false);

  const totalItems = isAuthenticated ? cart.reduce((sum, item) => sum + item.count, 0) : 0;

  // Блокируем скролл когда открыто бургер-меню
  useEffect(() => {
    if (burgerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [burgerOpen]);

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

  const handleBurgerClick = () => {
    SetBurgerOpen((prev) => !prev);
  };

  const closeBurger = () => {
    SetBurgerOpen(false);
  };

  const handleMobileSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleMobileSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push('/flowers');
      closeBurger();
    }
  };

  const handleMobileSearchClick = () => {
    if (searchQuery.trim()) {
      router.push('/flowers');
      closeBurger();
    }
  };

  return (
    <>
      <div className={h.hower}>
        <AnimatePresence>
          {burgerOpen && (
            <motion.div
              className={h.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeBurger}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {burgerOpen && (
            <motion.div
              className={h.burger}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}>
              <div className={h.burger_close}>
                <IoMdClose size={30} onClick={handleBurgerClick} />
              </div>

              <nav className={h.burger_nav}>
                {navItem.map((item) => {
                  return (
                    <Link
                      className={h.burger_nav_item}
                      key={item.name}
                      href={item.href}
                      onClick={closeBurger}>
                      {item.name}
                    </Link>
                  );
                })}
              </nav>

              <div className={h.burger_actions}>
                <Link className={h.burger_actions_link} href="/cart" onClick={closeBurger}>
                  <CartIcon />
                  <span>Корзина {totalItems > 0 && `(${totalItems})`}</span>
                </Link>
                {isAuthenticated ? (
                  <Link className={h.burger_actions_link} href="/user" onClick={closeBurger}>
                    <UserIcon />
                    <span>Профиль</span>
                  </Link>
                ) : (
                  <Link href="/login" onClick={closeBurger}>
                    <button className={h.burger_actions_button}>Войти</button>
                  </Link>
                )}
              </div>
              <div className={h.burger_search}>
                <h3>Поиск</h3>
                <input
                  type="text"
                  className={h.burger_search_input}
                  placeholder="Введите"
                  value={searchQuery}
                  onChange={handleMobileSearchChange}
                  onKeyDown={handleMobileSearchKeyDown}
                  ref={mobileSearchInputRef}
                />
              </div>
              <button
                className={h.burger_search_button}
                onClick={handleMobileSearchClick}
                aria-label="Найти">
                Найти
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
              <RxHamburgerMenu className={h.hamburger} size={30} onClick={handleBurgerClick} />
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
                    style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
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
