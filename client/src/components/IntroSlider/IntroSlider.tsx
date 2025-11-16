'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import './IntroSlider.css';

export default function IntroSlider() {
  return (
    <div className="relative mt-10" id="swipper">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}>
        <SwiperSlide>
          <Image width={1500} height={500} src="/img/intro.jpg" alt="1" />
        </SwiperSlide>
        <SwiperSlide className="delivery">
          <div className="deliveryContent">
            <p className="textd one">ДОСТАВИМ</p>
            <p className="textd two">ЗА 1 ЧАС</p>
            <p className="textd three">БУКЕТ</p>
            <Link className="textd link" href="./delivery">
              Заказать
            </Link>
          </div>
          <Image width={1500} height={500} src="/img/intro2.jpg" alt="2" />
        </SwiperSlide>
      </Swiper>

      <button className="custom-prev">
        <ChevronLeft size={24} />
      </button>
      <button className="custom-next">
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
