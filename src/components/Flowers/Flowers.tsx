'use client';
import { useMemo, useState, useEffect } from 'react';
import { IFlower } from '@/types/IFlower';
import Image from 'next/image';
import './Flowers.css';
import Link from 'next/link';
import CartButton from '../Buttons/CartButton';
import { useSearch } from '@/contexts/SearchContext';

const port = 'https://flower-shop-backend-6hsn.onrender.com';

export default function Flowers() {
  const [data, setData] = useState<IFlower[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [filter, setFilter] = useState('Все');
  const [debouncedFilter, setDebouncedFilter] = useState('Все');

  const { searchQuery } = useSearch();
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 300);

    return () => clearTimeout(id);
  }, [filter]);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(id);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${port}/flowers`);
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${port}/flowers`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const types = useMemo(
    () => (data ? ['Все', ...new Set(data.map((f) => f.type))] : ['Все']),
    [data],
  );

  const filtered = useMemo(() => {
    if (!data) return [];

    let result = debouncedFilter === 'Все' ? data : data.filter((f) => f.type === debouncedFilter);

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      const numQuery = Number(debouncedSearch);

      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.type.toLowerCase().includes(query) ||
          (!isNaN(numQuery) && f.price === numQuery),
      );
    }

    return result;
  }, [data, debouncedFilter, debouncedSearch]);

  const visibleFlowers = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  if (loading) {
    return <div className="loader" style={{ margin: '300px auto' }}></div>;
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', margin: '100px auto' }}>
        <p>Ошибка сервера или нет данных</p>
        <button
          onClick={reFetch}
          style={{
            padding: '10px 20px',
            marginTop: '20px',
            cursor: 'pointer',
            fontSize: '16px',
          }}>
          Обновить
        </button>
      </div>
    );
  }

  const canShowMore = visibleCount < filtered.length;
  const canShowUp = visibleCount > 8;

  return (
    <>
      <div className="filters">
        <div className="filters-block">
          {types.map((t, i) => (
            <button
              key={i}
              className={`filter-btn ${filter === t ? 'active' : ''}`}
              onClick={() => {
                setFilter(t);
                setVisibleCount(8);
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', margin: '50px auto' }}>
          <p>Ничего не найдено по запросу: {debouncedSearch}</p>
        </div>
      )}

      <ul className="flowers-list">
        {visibleFlowers.map((item) => (
          <li
            key={item.id}
            className="main__right-item"
            style={
              item.count === 0
                ? {
                    filter: 'blur(1px)',
                    opacity: 0.5,
                    pointerEvents: 'none',
                    position: 'relative',
                  }
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
