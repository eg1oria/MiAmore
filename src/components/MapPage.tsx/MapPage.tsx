'use client';

import { useState } from 'react';
import './MapPage.scss';
import Image from 'next/image';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import dynamic from 'next/dynamic';
import { FaArrowRightLong } from 'react-icons/fa6';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '500px',
        background: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <p>Загрузка карты...</p>
    </div>
  ),
});

export default function MapPage() {
  const [openMap, setOpenMap] = useState(false);

  function handleOpenMap() {
    setOpenMap(!openMap);
  }

  return (
    <div className="map">
      {openMap && <MapComponent />}
      <div className="map_container">
        <Image src={'/img/map.png'} alt="Карта" width={1000} height={1000} className="img" />
      </div>

      <div className="map_info">
        <h2 className="map_title">Мы рядом с вами</h2>
        <p className="map_text-bold">
          MiAmore — цветочная мастерская с доставкой в Алматы и области.
        </p>
        <p className="map_text">
          Наши филиалы удобно расположены в разных районах города, а курьерская доставка работает
          ежедневно по всему Алматы.
        </p>
        <div className="map_adress">
          <HiOutlineLocationMarker size={21} />
          <p className="map_adress-street">Алматы, Сейфуллина 67а — центр города</p>
        </div>
        <div className="map_adress">
          <HiOutlineLocationMarker size={21} />
          <p className="map_adress-street">Алматы, Сейфуллина 67а — центр города</p>
        </div>
        <button onClick={handleOpenMap} className={`map_btn ${openMap ? 'map_btn-open' : ''}`}>
          {openMap ? 'Скрыть карту' : 'Наши филиалы'}{' '}
          <FaArrowRightLong size={16} className="arrow" />
        </button>
        <span className="map_subText">
          Доставляем букеты на дом, в офис и для особых событий — дни рождения, свидания, свадьбы и
          важные моменты.
        </span>
      </div>
    </div>
  );
}
