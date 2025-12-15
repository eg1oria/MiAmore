'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import i from './IntroSlider.module.scss';
import Logo from '../../../public/logo-svg.svg';
import Link from 'next/link';
import Image from 'next/image';

const slede2 = [
  {
    icon: '/icons/icon-clock.svg',
    title: 'Работаем 24/7',
    desc: 'Принимаем заказы круглосуточно без выходных',
    size: 50,
  },
  {
    icon: '/icons/icon-vase.svg',
    title: 'Свежие цветы',
    desc: 'Только свежие цветы от проверенных поставщиков',
    size: 30,
  },
  {
    icon: '/icons/icon-heart.svg',
    title: 'С любовью',
    desc: 'Каждый букет создаём с особой заботой',
    size: 50,
  },
  {
    icon: '/icons/icon-pay.svg',
    title: 'Удобная оплата',
    desc: 'Наличными или картой при получении',
    size: 50,
  },
];

export default function IntroSlider() {
  return (
    <div className={i.slider}>
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
          <div className={`${i.slider_slide} ${i.slider_slide1}`}>
            <div className={i.slider_slide_wrap}>
              <Logo className={i.slider_slide_wrap_logo} />
              <p className={i.slider_slide_wrap_slogan}>Flowers of your dream</p>
              <div className={i.slider_slide_wrap_buttons}>
                <Link className={i.slider_slide_wrap_buttons_button1} href={'/flowers'}>
                  Выбрать букет
                </Link>
                <Link className={i.slider_slide_wrap_buttons_button2} href={'/contacts'}>
                  Связаться с нами
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={i.slider_slide2}>
            <div className={i.slider_slide2_wrap}>
              {slede2.map((item, y) => (
                <div key={y} className={i.slider_slide2_item}>
                  <Image src={item.icon} alt={item.title} width={item.size} height={item.size} />
                  <h3 className={i.slider_slide2_item_title}>{item.title}</h3>
                  <p className={i.slider_slide2_item_desc}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={i.slider_slide3}>
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
        <button className={`custom-prev ${i.custom_prev}`}>
          <ChevronLeft size={24} />
        </button>
        <button className={`custom-next ${i.custom_next}`}>
          <ChevronRight size={24} />
        </button>
      </Swiper>
    </div>
  );
}
