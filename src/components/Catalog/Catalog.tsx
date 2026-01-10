'use client';

import { useFlowers } from '../Flowers/useFlowers';
import FlowerCard from '@/components/Flowers/FlowerCard';
import './Catalog.scss';

export default function CustomLayout() {
  const { flowers, loading } = useFlowers({ sliceCount: 44 });

  const flowers1 = flowers.slice(0, 8);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="catalog">
      <div className="catalog-filters">
        <h2 className="catalog-filters_title">Фильтры</h2>
        <div className="catalog-filters_items">
          <p className="catalog-filters_item">Цена</p>
          <p className="catalog-filters_item">Тип</p>
          <p className="catalog-filters_item">Повод</p>
          <p className="catalog-filters_item">Топ Продаж</p>
        </div>
      </div>
      <ul className="catalog-flowers">
        {flowers.map((flower) => (
          <li key={flower.id}>
            <FlowerCard key={flower.id} item={flower} className="catalog-flowers_item" />
          </li>
        ))}
      </ul>
    </div>
  );
}
