'use client';

import { useState, useEffect, useCallback } from 'react';
import { IFlower } from '@/types/IFlower';

const API_URL = 'https://flower-shop-backend-6hsn.onrender.com';

interface UseFlowersOptions {
  type?: string | null;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  topSales?: boolean;
  showOutOfStock?: boolean;
  limit?: number;
}

export function useFlowers(options: UseFlowersOptions = {}) {
  const {
    type,
    searchQuery = '',
    minPrice,
    maxPrice,
    topSales = false,
    showOutOfStock = true,
    limit,
  } = options;

  const [flowers, setFlowers] = useState<IFlower[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchFlowers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (searchQuery.trim()) params.append('q', searchQuery.trim());
      if (type && type !== 'Все') params.append('type', type);
      if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
      if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
      if (topSales) params.append('topSales', 'true');

      const hasParams = Array.from(params).length > 0;
      const endpoint = hasParams ? `/flowers/search?${params}` : '/flowers';

      const res = await fetch(`${API_URL}${endpoint}`);
      if (!res.ok) throw new Error('Ошибка при получении данных');

      const data = await res.json();

      let results: IFlower[] = hasParams ? data.results || [] : data || [];

      if (!showOutOfStock) {
        results = results.filter((f) => f.count > 0);
      }

      if (limit) {
        results = results.slice(0, limit);
      }

      setFlowers(results);
      setTotal(hasParams ? data.total : results.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      setFlowers([]);
    } finally {
      setLoading(false);
    }
  }, [type, searchQuery, minPrice, maxPrice, topSales, showOutOfStock, limit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFlowers();
    }, 300); // Небольшая задержка, чтобы не спамить при вводе текста

    return () => clearTimeout(timer);
  }, [fetchFlowers]);

  return { flowers, loading, error, total, refetch: fetchFlowers, showOutOfStock };
}
