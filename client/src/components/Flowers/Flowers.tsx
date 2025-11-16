'use client';
import { useMemo, useState, useEffect } from 'react';
import { IFlower } from '@/types/IFlower';
import Image from 'next/image';
import './Flowers.css';
import Link from 'next/link';
import CartButton from '../Buttons/CartButton';

export default function Flowers() {
  const [data, setData] = useState<IFlower[]>([]);
  const [filter, setFilter] = useState<string>('Все');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(() => {
    const saved = localStorage.getItem('visibleFlowers');
    return saved ? Number(saved) : 8;
  });

  useEffect(() => {
    localStorage.setItem('visibleFlowers', String(visibleCount));
  }, [visibleCount]);

  useEffect(() => {
    fetch('http://localhost:4000/flowers')
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const types = useMemo(() => ['Все', ...new Set(data.map((f) => f.type))], [data]);
  const filtered = useMemo(
    () => (filter === 'Все' ? data : data.filter((f) => f.type === filter)),
    [data, filter],
  );
  const visibleFlowers = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  if (loading)
    return (
      <div
        className="loader"
        style={{
          margin: '300px auto',
        }}></div>
    );
  const canShowMore = visibleCount < filtered.length;
  const canShowUp = visibleCount > 8;
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
        {visibleFlowers.map((item) => (
          <li
            key={item.id}
            className="main__right-item"
            style={
              item.count === 0
                ? { filter: 'blur(1px)', opacity: 0.5, pointerEvents: 'none', position: 'relative' }
                : {}
            }>
            {item.count === 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0,0,0,0.64)',
                  color: '#fff',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  zIndex: 2,
                }}>
                Нет в наличии
              </span>
            )}

            <Link href={`/flowers/${item.id}`}>
              <div className="main__img-container">
                <Image
                  width={170}
                  height={170}
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

            {item.count > 0 && <CartButton className="main__buy-button" item={item} />}
          </li>
        ))}
      </ul>

      <div className="flowersContainer">
        {canShowMore && (
          <button className="show-more-btn" onClick={() => setVisibleCount((prev) => prev + 8)}>
            Показать ещё
          </button>
        )}

        {canShowUp && (
          <button className="show-more-btn" onClick={() => setVisibleCount(8)}>
            Свернуть
          </button>
        )}
      </div>
    </>
  );
}
