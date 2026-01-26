'use client';
import { IFlower } from '@/types/IFlower';
import FlowerCard from './FlowerCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface FlowersListProps {
  flowers: IFlower[];
  title?: string;
  useSlider?: boolean;
  className?: string;
}

export default function FlowersList({
  flowers,
  title,
  useSlider = true,
  className = '',
}: FlowersListProps) {
  if (flowers.length === 0) {
    return (
      <div style={{ textAlign: 'center', margin: '50px auto' }}>
        <p>Ничего не найдено</p>
      </div>
    );
  }

  if (useSlider) {
    return (
      <div>
        {title && (
          <div className="flowers-head">
            <h2 className="flowers-popular">{title}</h2>
            <div className="filters">
              <button className="custom-prev1">
                <ChevronLeft size={24} />
              </button>
              <button className="custom-next1">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}

        <ul className="flowers-list">
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={4}
            spaceBetween={30}
            pagination={{ clickable: true }}
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
            {flowers.map((item) => (
              <SwiperSlide key={item.id}>
                <FlowerCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </ul>
      </div>
    );
  }

  return (
    <div className={className}>
      {title && (
        <div className="flowers-head">
          <h2 className="flowers-popular">{title}</h2>
        </div>
      )}

      <ul className={`flowers-list ${className}`}>
        {flowers.map((item) => (
          <FlowerCard key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
