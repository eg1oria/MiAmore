'use client';
import { useMemo, useState, useEffect } from 'react';
import { IFlower } from '@/types/IFlower';
import Image from 'next/image';
import './Flowers.css';
import Link from 'next/link';
import CartButton from '../Buttons/CartButton';
import { useSearch } from '@/contexts/SearchContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const port = 'https://flower-shop-backend-6hsn.onrender.com';

export default function Flowers() {
  const [data, setData] = useState<IFlower[] | null>(null);
  const [loading, setLoading] = useState(true);
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
      <div className="filters">
        <button className={`custom-prev1`}>
          <ChevronLeft size={24} />
        </button>
        <button className={`custom-next1`}>
          <ChevronRight size={24} />
        </button>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', margin: '50px auto' }}>
          <p>Ничего не найдено по запросу: {debouncedSearch}</p>
        </div>
      )}

      <ul className="flowers-list">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={5}
          loop
          spaceBetween={30}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          navigation={{
            nextEl: '.custom-next1',
            prevEl: '.custom-prev1',
          }}>
          {filtered.map((item) => (
            <SwiperSlide key={item.id}>
              <li
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
                    <span className="main__item-price-old">{item.price} ₽</span>
                    <span className="main__item-price">
                      {Math.round(item.price * (1 - item.discount))} ₽
                    </span>
                  </div>
                </Link>

                {item.count > 0 && <CartButton className="main__buy-button" item={item} />}
              </li>
            </SwiperSlide>
          ))}
        </Swiper>
      </ul>
    </>
  );
}
