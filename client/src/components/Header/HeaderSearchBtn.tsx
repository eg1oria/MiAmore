import Image from 'next/image';
import h from './Header.module.scss';
import { motion } from 'framer-motion';

export default function HeaderSearchBtn({ onMouseOut, inputRef, isOpen }) {
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
