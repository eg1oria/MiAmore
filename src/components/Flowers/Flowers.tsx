'use client';
import { useMemo, useState } from 'react';
import { IFlower } from '@/types/IFlower';
import dataFile from '@/data/db.json';
import Image from 'next/image';
import './Flowers.css';
import { FaArrowUp } from 'react-icons/fa';
import Link from 'next/link';
import CartButton from '../Buttons/CartButton';
import FavsButton from '../Buttons/FavsButton';

export default function Flowers() {
  const data: IFlower[] = dataFile.flowers;
  const [filter, setFilter] = useState<string>('Все');
  const [visibleCount, setVisibleCount] = useState(8);

  const types = useMemo(() => ['Все', ...new Set(data.map((f) => f.type))], [data]);
  const filtered = useMemo(() => {
    return filter === 'Все' ? data : data.filter((f) => f.type === filter);
  }, [data, filter]);
  const visibleFlowers = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  return (
    <>
      <div className="filters">
        {types.map((t) => (
          <button
            key={t}
            className={`filter-btn ${filter === t ? 'active' : ''}`}
            onClick={() => setFilter(t)}>
            {t}
          </button>
        ))}
      </div>

      <ul className="flowers-list">
        {visibleFlowers.map((item) => {
          return item.count > 0 ? (
            <li key={item.id} className="main__right-item">
              <Link href={`/flowers/${item.id}`}>
                <div className="main__img-container">
                  <Image
                    width={100}
                    height={100}
                    className="main__img load"
                    src={item.image}
                    alt={item.description}
                    loading="lazy"
                  />
                </div>

                <div className="main__right-container">
                  <h3 className="main__item-title">{item.name}</h3>
                  <p className="main__item-subtitle">{item.type}</p>
                  <span className="main__item-price">{item.price} ₽</span>
                </div>
              </Link>

              <div className="main__buttons">
                <CartButton className="main__buy-button" item={item} />
                <FavsButton className="main__fav-button" item={item} />
              </div>
            </li>
          ) : (
            <li
              key={item.id}
              className="main__right-item"
              style={{
                filter: 'blur(1px)',
                opacity: '0.5',
                position: 'relative',
                pointerEvents: 'none',
              }}>
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0, 0, 0, 0.64)',
                  color: '#fff',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  zIndex: 2,
                }}>
                Нет в наличии
              </span>

              <div className="main__img-container">
                <Image
                  width={100}
                  height={100}
                  className="main__img load"
                  src={item.image}
                  alt={item.description}
                  loading="lazy"
                />
              </div>

              <div className="main__right-container">
                <h3 className="main__item-title">{item.name}</h3>
                <p className="main__item-subtitle">{item.type}</p>
                <span className="main__item-price">{item.price} ₽</span>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flowersContainer">
        {visibleCount < filtered.length ? (
          <button className="show-more-btn" onClick={() => setVisibleCount((prev) => prev + 4)}>
            Показать ещё
          </button>
        ) : visibleFlowers.length > 8 ? (
          <button className="show-more-btn-up" onClick={() => setVisibleCount(8)}>
            <FaArrowUp size={18} />
          </button>
        ) : null}
      </div>
    </>
  );
}
