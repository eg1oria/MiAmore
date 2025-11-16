import CartButton from '@/components/Buttons/CartButton';
import FavsButton from '@/components/Buttons/FavsButton';
import data from '@/data/db.json';
import Image from 'next/image';
import './FlowerPage.css';

export default async function FlowerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const flower = data.flowers.find((f) => f.id === Number(id));

  if (!flower) {
    return (
      <div className="not-found">
        <h2>Товар не найден</h2>
        <p>ID: {id}</p>
      </div>
    );
  }

  return (
    <div className="flower-page">
      <div className="flower-container">
        <div className="image-section">
          <div className="image-wrapper">
            <Image
              src={flower.image}
              width={500}
              height={400}
              alt={flower.description}
              className="flower-image"
              priority
            />
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
            <FavsButton item={flower} className="favs-button" />
          </div>
        </div>
      </div>
    </div>
  );
}
