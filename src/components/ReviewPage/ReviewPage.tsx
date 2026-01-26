'use client';

import './ReviewPage.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

const reviews = [
  {
    id: 2,
    url: '/img/review2.png',
  },
  {
    id: 3,
    url: '/img/review3.png',
  },
  {
    id: 4,
    url: '/img/review4.png',
  },
];

export default function ReviewPage() {
  return (
    <div className="reviewCont">
      <div className="reviewCont_left">
        <h2 className="reviewCont_left-title">Отзывы клиентов</h2>
        <p className="reviewCont_left-text">
          Нам доверяют самые важные моменты — признания, праздники и тёплые слова, которые сложно
          сказать вслух.
        </p>
      </div>
      <div className="reviewCont_right">
        <Swiper
          modules={[Pagination, Autoplay]}
          slidesPerView={1}
          loop
          spaceBetween={20}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          className="reviewCont_right-swiper">
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="reviewCont_right-swiper-slide">
              <Image
                src={review.url}
                alt="review"
                width={400}
                height={400}
                className="reviewCont_right-swiper-slide-img"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
