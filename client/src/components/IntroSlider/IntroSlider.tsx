'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './IntroSlider.css';
import Logo from '../../../public/logo-svg.svg';
import Link from 'next/link';

export default function IntroSlider() {
  return (
    <div className="slidewr" id="swipper">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        loop
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        navigation={{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}>
        <SwiperSlide>
          <div className="jvjv">
            <div className="sdfs">
              <Logo className="jjj" />
              <p className="edfdf">Flowers of your dream</p>
              <div className="btmns">
                <Link className="btmn" href={'/flowers'}>
                  Выбрать букет
                </Link>
                <Link className="btmn btmne" href={'/contacts'}>
                  Связаться с нами
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="jvjv">
            <div className="sdfs">
              <Logo className="jjj" />
              <p className="edfdf">Flowers of your dream</p>
              <div className="btmns">
                <Link className="btmn" href={'/flowers'}>
                  Выбрать букет
                </Link>
                <Link className="btmn btmne" href={'/contacts'}>
                  Связаться с нами
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="jvjv">
            <div className="sdfs">
              <Logo className="jjj" />
              <p className="edfdf">Flowers of your dream</p>
              <div className="btmns">
                <Link className="btmn" href={'/flowers'}>
                  Выбрать букет
                </Link>
                <Link className="btmn btmne" href={'/contacts'}>
                  Связаться с нами
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <button className="custom-prev">
          <ChevronLeft size={24} />
        </button>
        <button className="custom-next">
          <ChevronRight size={24} />
        </button>
      </Swiper>
    </div>
  );
}
