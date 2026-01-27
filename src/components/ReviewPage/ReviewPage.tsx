'use client';

import './ReviewPage.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const reviews = [
  {
    id: 2,
    name: 'sul ta',
    date: '12 января 2026',
    text: 'Очень доволен покупкой! Букет был свежим и красивым, доставка вовремя. Рекомендую этот магазин всем!',
  },
  {
    id: 3,
    name: 'Аружан',
    date: '5 января 2026',
    text: 'Заказывала букет на день рождения мамы. Она была в восторге! Цветы великолепны, а оформление просто шикарное. Спасибо!',
  },
  {
    id: 4,
    name: 'Игорь',
    date: '28 декабря 2025',
    text: 'Отличный сервис и качественные цветы. Заказал букет для жены, и она была очень довольна. Буду заказывать здесь снова!',
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
              <div className="review-card">
                <div className="review-header">
                  <div className="review-avatar">{review.name.charAt(0).toUpperCase()}</div>
                  <div className="review-info">
                    <h4 className="review-name">{review.name}</h4>
                    <p className="review-date">{review.date}</p>
                  </div>
                </div>

                <div className="review-rating">
                  {[...Array(5)].map((_, index) => (
                    <svg key={index} className="star-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="review-text">{review.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
