// TypesPages.tsx
'use client';

import Image from 'next/image';
import './TypesPages.scss';
import { useSearch } from '@/contexts/SearchContext';
import { useRouter } from 'next/navigation';

const types = [
  {
    name: 'Романтические букеты',
    img: '/img/type1.png',
    id: 1,
    searchQuery: 'романтические',
  },
  {
    name: 'Авторские букеты',
    img: '/img/type2.png',
    id: 2,
    searchQuery: 'авторские',
  },
  {
    name: 'Букеты к дню рождения',
    img: '/img/type3.png',
    id: 3,
    searchQuery: 'день рождения',
  },
  {
    name: 'Свадебные букеты',
    img: '/img/type4.png',
    id: 4,
    searchQuery: 'свадебные',
  },
  {
    name: 'Мужские букеты',
    img: '/img/type5.png',
    id: 5,
    searchQuery: 'мужские',
  },
  {
    name: 'И другие категории',
    img: '/img/type6.png',
    id: 6,
    searchQuery: '',
  },
];

export default function TypesPages() {
  const { setSearchQuery } = useSearch();
  const router = useRouter();

  const handleTypeClick = (searchQuery: string) => {
    setSearchQuery(searchQuery);
    router.push('/flowers');
  };

  return (
    <div className="types">
      {types.map((type) => (
        <div
          className="types_item"
          key={type.id}
          onClick={() => handleTypeClick(type.searchQuery)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleTypeClick(type.searchQuery);
            }
          }}>
          <div className="types_item-image">
            <Image
              src={type.img}
              fill
              sizes="(max-width: 767px) 50vw, 25vw"
              alt={type.name}
              className="img"
              priority={type.id <= 2}
            />
          </div>
          <p className="types_text">{type.name}</p>
        </div>
      ))}
    </div>
  );
}
