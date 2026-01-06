'use client';
import { useMemo, useState, useEffect } from 'react';
import { IFlower } from '@/types/IFlower';
import Image from 'next/image';
import './Flowers.css';
import Link from 'next/link';
import CartButton from '../Buttons/CartButton';
import { useSearch } from '@/contexts/SearchContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const port = 'https://flower-shop-backend-6hsn.onrender.com';

export default function Flowers({
  slicedNum,
  titleText,
  showOutOfStock = true,
}: {
  slicedNum: number;
  titleText?: string;
  showOutOfStock?: boolean;
}) {
  const [data, setData] = useState<IFlower[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Все');

  const { searchQuery } = useSearch();
  const [debouncedSearch, setDebouncedSearch] = useState('');

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

  const filtered = useMemo(() => {
    if (!data) return [];

    let result = filter === 'Все' ? data : data.filter((f) => f.type === filter);

    if (!showOutOfStock) {
      result = result.filter((f) => f.count > 0);
    }

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      const numQuery = Number(debouncedSearch);

      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(query) ||
          f.type.toLowerCase().includes(query) ||
          f.searchQuery?.toLowerCase().includes(query) ||
          (!isNaN(numQuery) && f.price === numQuery),
      );
    }

    return result;
  }, [data, filter, debouncedSearch, showOutOfStock]);

  const sliced = filtered.slice(0, slicedNum);

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

  return (
    <>
      <div className="flowers-head">
        <h2 className="flowers-popular">
          {debouncedSearch ? `Запрос: ${debouncedSearch}` : titleText ? titleText : 'Каталог'}
        </h2>
        <div className="filters">
          <button className="custom-prev1">
            <ChevronLeft size={24} />
          </button>
          <button className="custom-next1">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', margin: '50px auto' }}>
          <p>Ничего не найдено по запросу: {debouncedSearch}</p>
        </div>
      )}

      <ul className="flowers-list">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={4}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          navigation={{
            nextEl: '.custom-next1',
            prevEl: '.custom-prev1',
          }}>
          {sliced.map((item) => {
            const isOutOfStock = item.count === 0;

            return (
              <SwiperSlide key={item.id}>
                <li
                  className="main__right-item"
                  style={
                    isOutOfStock
                      ? {
                          filter: 'blur(1px)',
                          opacity: 0.5,
                          pointerEvents: 'none',
                          position: 'relative',
                        }
                      : {}
                  }>
                  {isOutOfStock && (
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
                      <span className="main__item-price-old">{item.price} ₽</span>
                      <span className="main__item-price">
                        {Math.round(item.price * (1 - item.discount))} ₽
                      </span>
                    </div>
                  </Link>

                  {!isOutOfStock && <CartButton className="main__buy-button" item={item} />}
                </li>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </ul>
    </>
  );
}
