'use client';
import { useState, useEffect } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { useFlowers } from './useFlowers';
import FlowersList from './FlowersList';
import FlowerCard from './FlowerCard';
import './Flowers.scss';

interface FlowersProps {
  slicedNum: number;
  titleText?: string;
  showOutOfStock?: boolean;
  useSlider?: boolean;
}

export default function Flowers({ slicedNum, titleText, useSlider = true }: FlowersProps) {
  const { searchQuery } = useSearch();
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const { flowers, loading, error } = useFlowers({
    type: 'Все',
    searchQuery: debouncedSearch,
    limit: slicedNum,
  });

  if (error) {
    return (
      <div style={{ textAlign: 'center', margin: '100px auto' }}>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
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

  const displayTitle = debouncedSearch ? `Запрос: ${debouncedSearch}` : titleText || 'Каталог';

  // Если идет загрузка, показываем скелетоны
  if (loading) {
    const skeletonCount = Math.min(slicedNum, 4);

    return (
      <div className="flowers-section">
        {titleText && (
          <div className="flowers-head">
            <h2 className="flowers-popular">{displayTitle}</h2>
          </div>
        )}
        <div className="flowers-skeleton-container">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <FlowerCard key={`skeleton-${index}`} isLoading={true} />
          ))}
        </div>
      </div>
    );
  }

  return <FlowersList flowers={flowers} title={displayTitle} useSlider={useSlider} />;
}
