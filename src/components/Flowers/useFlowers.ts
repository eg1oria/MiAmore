'use client';

import { useState, useEffect, useMemo } from 'react';
import { IFlower } from '@/types/IFlower';

const API_URL = 'https://flower-shop-backend-6hsn.onrender.com';

interface UseFlowersOptions {
  filter?: string;
  searchQuery?: string;
  showOutOfStock?: boolean;
  sliceCount?: number;
}

export function useFlowers(options: UseFlowersOptions = {}) {
  const { filter = 'Все', searchQuery = '', showOutOfStock = true, sliceCount } = options;

  const [data, setData] = useState<IFlower[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlowers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/flowers`);
      if (!res.ok) throw new Error('Ошибка загрузки данных');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
      setError('Ошибка сервера');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlowers();
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];

    let result = filter === 'Все' ? data : data.filter((f) => f.type === filter);

    if (!showOutOfStock) {
      result = result.filter((f) => f.count > 0);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const numQuery = Number(searchQuery);

      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.type.toLowerCase().includes(query) ||
          f.searchQuery?.toLowerCase().includes(query) ||
          (!isNaN(numQuery) && f.price === numQuery),
      );
    }

    if (sliceCount) {
      result = result.slice(0, sliceCount);
    }

    return result;
  }, [data, filter, searchQuery, showOutOfStock, sliceCount]);

  return {
    flowers: filtered,
    loading,
    error,
    refetch: fetchFlowers,
  };
}
