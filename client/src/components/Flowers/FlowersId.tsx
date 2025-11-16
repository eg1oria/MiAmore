'use client';
import CartButton from '@/components/Buttons/CartButton';
import Image from 'next/image';
import './Flowers.css';
import { useEffect, useState } from 'react';
import { IFlower } from '@/types/IFlower';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import 'react-photo-view/dist/react-photo-view.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';

export default function FlowerId() {
  const [flower, setFlower] = useState<IFlower | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    fetch(`http://localhost:4000/flowers/${id}`)
      .then((res) => res.json())
      .then((data) => setFlower(data))
      .catch(() => setFlower(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loader"></div>;
  if (!flower)
    return (
      <div className="not-found">
        <h2>Товар не найден</h2>
        <p>ID: {id}</p>
      </div>
    );

  return (
    <PhotoProvider>
      <div className="flower-page">
        <div className="flower-container">
          <div className="image-section">
            <div className="image-wrapper">
              <PhotoView src={flower.image}>
                <Image
                  src={flower.image}
                  width={500}
                  height={400}
                  alt={flower.description}
                  className="flower-image"
                />
              </PhotoView>
            </div>
          </div>

          <div className="details-section">
            <h1 className="flower-title">{flower.name}</h1>

            <div className="flower-meta">
              <span className="flower-type">{flower.type}</span>
            </div>

            <div className="price-section">
              <span className="price-label">Цена:</span>
              <span className="price-value">{flower.price} ₽</span>
            </div>

            <div className="actions-section">
              <CartButton item={flower} className="cart-button" />
            </div>
            <Link href="/flowers" className="cart-button">
              Назад
            </Link>
          </div>
        </div>
      </div>
    </PhotoProvider>
  );
}
