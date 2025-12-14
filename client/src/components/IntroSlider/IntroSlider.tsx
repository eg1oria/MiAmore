'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import './IntroSlider.css';

export default function IntroSlider() {
  return (
    <div className="slidewr" id="swipper">
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        loop
        pagination={{ clickable: true }}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}>
        <SwiperSlide>
          <div className="jvjv">
            <Image src={'/logo-white.svg'} alt="jh" width={500} height={6} className="jjj" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className=""></div>
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
