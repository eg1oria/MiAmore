'use client';

import { useState, useEffect } from 'react';
import { useFlowers } from '../Flowers/useFlowers';
import FlowerCard from '@/components/Flowers/FlowerCard';
import { useSearch } from '@/contexts/SearchContext';
import './Catalog.scss';

export default function CustomLayout() {
  const { searchQuery, setSearchQuery } = useSearch();

  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showTopSales, setShowTopSales] = useState(false);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [allTypes, setAllTypes] = useState<string[]>([]);

  useEffect(() => {
    fetch('https://flower-shop-backend-6hsn.onrender.com/flowers/types')
      .then((res) => res.json())
      .then((data) => setAllTypes(data))
      .catch((err) => console.error('Ошибка типов:', err));
  }, []);

  const { flowers, loading, error, total } = useFlowers({
    searchQuery,
    type: selectedType,
    topSales: showTopSales,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    showOutOfStock: true,
  });

  const handleResetFilters = () => {
    setSelectedType(null);
    setShowTopSales(false);
    setSearchQuery('');
    setPriceRange({});
  };

  const getNoun = (number: number) => {
    const n = Math.abs(number) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return 'товаров';
    if (n1 > 1 && n1 < 5) return 'товара';
    if (n1 === 1) return 'товар';
    return 'товаров';
  };

  // Рендерим скелетоны при загрузке
  const renderSkeletons = () => {
    return Array.from({ length: 8 }).map((_, index) => (
      <FlowerCard key={`skeleton-${index}`} isLoading={true} />
    ));
  };

  return (
    <div className="catalog">
      <aside className="catalog-filters">
        <h2 className="catalog-filters_title">Фильтры</h2>

        <div className="filter-section">
          <h3 className="filter-section_title">Категория</h3>
          <div className="catalog-filters_items">
            <button
              className={`catalog-filters_item ${!selectedType ? 'active' : ''}`}
              onClick={() => setSelectedType(null)}>
              Все
            </button>
            {allTypes.map((type) => (
              <button
                key={type}
                className={`catalog-filters_item ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}>
                {type}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="catalog-content">
        <div className="catalog-header">
          <h1 className="catalog-title">
            {searchQuery.trim() ? `Поиск: ${searchQuery}` : 'Каталог цветов'}
          </h1>
          <span className="catalog-count">
            {loading ? (
              <span className="catalog-count-skeleton"></span>
            ) : (
              <>
                Найдено: {total} {getNoun(total)}
              </>
            )}
          </span>
        </div>

        {error ? (
          <div className="catalog-error">
            <p>Упс! {error}</p>
            <button onClick={handleResetFilters} className="reset-filters">
              Попробовать снова
            </button>
          </div>
        ) : (
          <ul className="catalog-flowers">
            {loading ? (
              renderSkeletons()
            ) : flowers.length > 0 ? (
              flowers.map((flower) => <FlowerCard key={flower.id} item={flower} />)
            ) : (
              <li className="no-results">
                <p>Ничего не нашлось по вашим параметрам</p>
                <button onClick={handleResetFilters} className="reset-filters">
                  Сбросить фильтры
                </button>
              </li>
            )}
          </ul>
        )}
      </main>
    </div>
  );
}
