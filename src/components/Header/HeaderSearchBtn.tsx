'use client';

import Image from 'next/image';
import h from './Header.module.scss';
import { motion } from 'framer-motion';
import { MouseEventHandler, RefObject } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { useRouter, usePathname } from 'next/navigation';

interface Htmld {
  onMouseOut: MouseEventHandler;
  inputRef: RefObject<HTMLInputElement | null>;
  isOpen: boolean;
}

export default function HeaderSearchBtn({ onMouseOut, inputRef, isOpen }: Htmld) {
  const { searchQuery, setSearchQuery } = useSearch();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (pathname !== '/flowers' && value.trim()) {
      router.push('/flowers');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push('/flowers');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, width: 0 }}
      animate={{
        opacity: isOpen ? 1 : 0,
        width: isOpen ? 300 : 0,
      }}
      exit={{ opacity: 0, width: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      style={{
        pointerEvents: isOpen ? 'auto' : 'none',
        overflow: 'hidden',
      }}
      className={h.searchWrap}>
      <input
        type="text"
        className={h.search}
        placeholder="Поиск"
        value={searchQuery}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onMouseOut={onMouseOut}
        ref={inputRef}
      />

      <Image
        src={'/icons/icon-search.svg'}
        alt="найти"
        width={23}
        height={23}
        className={h.search_icon}
      />
    </motion.div>
  );
}
