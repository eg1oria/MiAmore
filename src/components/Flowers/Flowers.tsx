'use client';
import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { IFlower } from '@/types/IFlower';
import Image from 'next/image';
import './Flowers.css';
import Link from 'next/link';
import CartButton from '../Buttons/CartButton';
import { useSearch } from '@/contexts/SearchContext';

const port = 'https://flower-shop-backend-6hsn.onrender.com';
const INITIAL_VISIBLE_COUNT = 8;
const ITEMS_PER_LOAD = 8;
const DEBOUNCE_DELAY = 300;

export default function Flowers() {
  const [data, setData] = useState<IFlower[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [filter, setFilter] = useState('Все');
  const [debouncedFilter, setDebouncedFilter] = useState('Все');

  const { searchQuery } = useSearch();
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounce filter
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedFilter(filter);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(id);
  }, [filter]);

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(id);
  }, [searchQuery]);

  // Fetch data with abort controller
  const fetchData = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${port}/flowers`, {
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }

      console.error('Ошибка при загрузке данных:', err);
      setError('Не удалось загрузить данные. Проверьте подключение к интернету.');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();

    return () => {
      // Cleanup: cancel request on unmount
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Memoized types
  const types = useMemo(
    () => (data ? ['Все', ...new Set(data.map((f) => f.type))] : ['Все']),
    [data],
  );

  // Memoized filtered flowers
  const filtered = useMemo(() => {
    if (!data) return [];

    let result = debouncedFilter === 'Все' ? data : data.filter((f) => f.type === debouncedFilter);

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase().trim();
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

  // Memoized visible flowers
  const visibleFlowers = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);

  // Handle filter change
  const handleFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, []);

  // Handle show more
  const handleShowMore = useCallback(() => {
    setVisibleCount((prev) => prev + ITEMS_PER_LOAD);
  }, []);

  // Handle collapse
  const handleCollapse = useCallback(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const canShowMore = visibleCount < filtered.length;
  const canShowUp = visibleCount > INITIAL_VISIBLE_COUNT;

  // Loading state
  if (loading) {
    return (
      <div className="flowers-loading" role="status" aria-live="polite">
        <div className="loader" aria-label="Загрузка цветов"></div>
        <p className="sr-only">Загружаем цветы...</p>
      </div>
    );
  }

  // Error state
  if (error || !data || data.length === 0) {
    return (
      <div className="flowers-error" role="alert">
        <div className="error-icon">⚠️</div>
        <h2 className="error-title">Упс! Что-то пошло не так</h2>
        <p className="error-message">
          {error || 'Не удалось загрузить цветы. Попробуйте обновить страницу.'}
        </p>
        <button className="error-retry-btn" onClick={fetchData} aria-label="Попробовать снова">
          🔄 Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="flowers-wrapper">
      {/* Filters */}
      <nav className="filters" aria-label="Фильтры категорий">
        <div className="filters-block" role="group" aria-label="Выбор категории">
          {types.map((t) => (
            <button
              key={t}
              className={`filter-btn ${filter === t ? 'active' : ''}`}
              onClick={() => handleFilterChange(t)}
              aria-pressed={filter === t}
              aria-label={`Фильтр: ${t}`}>
              {t}
            </button>
          ))}
        </div>
      </nav>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flowers-empty" role="status">
          <div className="empty-icon">🔍</div>
          <h3 className="empty-title">Ничего не найдено</h3>
          <p className="empty-message">
            По запросу <strong>{debouncedSearch}</strong> ничего не найдено.
          </p>
          <p className="empty-hint">Попробуйте изменить поисковый запрос или фильтр.</p>
        </div>
      )}

      {/* Flowers list */}
      {filtered.length > 0 && (
        <>
          <ul className="flowers-list" role="list">
            {visibleFlowers.map((item) => (
              <li
                key={item.id}
                className={`main__right-item ${item.count === 0 ? 'out-of-stock' : ''}`}
                role="listitem">
                {item.count === 0 && (
                  <div className="out-of-stock-badge" role="status" aria-label="Нет в наличии">
                    <span className="badge-text">Нет в наличии</span>
                  </div>
                )}

                <Link
                  href={`/flowers/${item.id}`}
                  className="flower-card-link"
                  aria-label={`Подробнее о ${item.name}`}
                  tabIndex={item.count === 0 ? -1 : 0}>
                  <div className="main__img-container">
                    <Image
                      width={280}
                      height={280}
                      className="main__img"
                      src={item.image}
                      alt={item.description || item.name}
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={85}
                    />
                  </div>
                  <div className="main__right-container">
                    <h3 className="main__item-title">{item.name}</h3>
                    <p className="main__item-subtitle">{item.type}</p>
                    <span className="main__item-price" aria-label={`Цена: ${item.price} рублей`}>
                      {item.price.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </Link>

                {item.count > 0 && (
                  <CartButton
                    className="main__buy-button"
                    item={item}
                    aria-label={`Добавить ${item.name} в корзину`}
                  />
                )}
              </li>
            ))}
          </ul>

          {/* Pagination controls */}
          <div className="flowers-controls" role="navigation" aria-label="Управление списком">
            {canShowMore && (
              <button
                className="show-more-btn"
                onClick={handleShowMore}
                aria-label={`Показать ещё ${ITEMS_PER_LOAD} товаров`}>
                Показать ещё
              </button>
            )}

            {canShowUp && (
              <button
                className="show-less-btn"
                onClick={handleCollapse}
                aria-label="Свернуть список">
                ↑ Свернуть
              </button>
            )}
          </div>

          {/* Results info */}
          <div className="flowers-results-info" role="status" aria-live="polite">
            Показано {visibleFlowers.length} из {filtered.length} товаров
          </div>
        </>
      )}
    </div>
  );
}
