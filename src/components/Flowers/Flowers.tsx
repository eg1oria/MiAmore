'use client';
import { useState, useEffect } from 'react';
import { useSearch } from '@/contexts/SearchContext';
import { useFlowers } from './useFlowers';
import FlowersList from './FlowersList';
import './Flowers.css';

interface FlowersProps {
  slicedNum: number;
  titleText?: string;
  showOutOfStock?: boolean;
  useSlider?: boolean;
}

export default function Flowers({
  slicedNum,
  titleText,
  showOutOfStock = true,
  useSlider = true,
}: FlowersProps) {
  const { searchQuery } = useSearch();
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const { flowers, loading, error, refetch } = useFlowers({
    filter: 'Все',
    searchQuery: debouncedSearch,
    showOutOfStock,
    sliceCount: slicedNum,
  });

  if (loading) {
    return <div className="loader" style={{ margin: '300px auto' }}></div>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', margin: '100px auto' }}>
        <p>{error}</p>
        <button
          onClick={refetch}
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

  return <FlowersList flowers={flowers} title={displayTitle} useSlider={useSlider} />;
}
