'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { IoClose } from 'react-icons/io5';

interface MapProps {
  onAddressSelect?: (address: string, lat: number, lng: number) => void;
  onClose?: () => void;
  className: string;
}

interface ClickHandlerProps {
  setPosition: (position: [number, number]) => void;
  setAddress: (address: string) => void;
  onAddressSelect?: (address: string, lat: number, lng: number) => void;
}

export const shopIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const pinIcon = new L.Icon({
  iconUrl:
    'data:image/svg+xml;base64,' +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 24 24" fill="#ef4444">
      <path d="M12 0C7.802 0 4.403 3.399 4.403 7.597c0 5.598 7.597 16.403 7.597 16.403s7.597-10.805 7.597-16.403C19.597 3.399 16.198 0 12 0zm0 11c-1.933 0-3.5-1.567-3.5-3.5S10.067 4 12 4s3.5 1.567 3.5 3.5S13.933 11 12 11z"/>
    </svg>
  `),
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

async function getAddress(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );
    const data = await res.json();
    return data.display_name || 'Адрес не найден';
  } catch (error) {
    console.error('Ошибка получения адреса:', error);
    return 'Ошибка загрузки адреса';
  }
}

function ClickHandler({ setPosition, setAddress, onAddressSelect }: ClickHandlerProps) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setAddress('Загружаем адрес...');

      const address = await getAddress(lat, lng);
      setAddress(address);

      if (onAddressSelect) {
        onAddressSelect(address, lat, lng);
      }

      console.log('Координаты:', lat, lng);
      console.log('Адрес:', address);
    },
  });
  return null;
}

export default function Map({ onAddressSelect, onClose, className }: MapProps) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>('');
  const shopPosition: [number, number] = [43.2389, 76.8897];

  const handleConfirm = () => {
    if (address && onClose) {
      onClose();
    }
  };

  return (
    <div className={className}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.css"
      />

      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Выберите адрес доставки</h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '32px',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
          }}>
          <IoClose />
        </button>
      </div>

      {address && (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#dbeafe',
            borderBottom: '1px solid #93c5fd',
          }}>
          <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
            Выбранный адрес:
          </h3>
          <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>{address}</p>
        </div>
      )}

      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer center={shopPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickHandler
            setPosition={setPosition}
            setAddress={setAddress}
            onAddressSelect={onAddressSelect}
          />

          <Marker position={shopPosition} icon={shopIcon}>
            <Popup>
              <strong>Наш магазин</strong>
              <br />
              Алматы, Казахстан
            </Popup>
          </Marker>

          {position && (
            <Marker position={position} icon={pinIcon}>
              <Popup>
                <strong>Адрес доставки</strong>
                <br />
                {address || 'Загружаем адрес...'}
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {!address && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '12px 24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              zIndex: 1000,
              fontSize: '14px',
              fontWeight: '500',
            }}>
            Кликните по карте, чтобы выбрать адрес
          </div>
        )}
      </div>

      {address && (
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid #e5e7eb',
            backgroundColor: '#fff',
          }}>
          <button
            onClick={handleConfirm}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}>
            Подтвердить адрес
          </button>
        </div>
      )}
    </div>
  );
}
