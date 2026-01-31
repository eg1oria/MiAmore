import { IFlower } from '@/types/IFlower';
import Image from 'next/image';
import Link from 'next/link';
import CartButton from '../Buttons/CartButton';
import './Flowers.scss';

interface FlowerCardProps {
  item?: IFlower;
  className?: string;
  isLoading?: boolean;
}

export default function FlowerCard({ item, className = '', isLoading = false }: FlowerCardProps) {
  if (isLoading || !item) {
    return (
      <li className={`main__right-item main__right-item--skeleton ${className}`}>
        <div className="main__img-container main__img-container--skeleton">
          <div className="skeleton-shimmer"></div>
        </div>
        <div className="main__right-container main__right-container--skeleton">
          <div className="skeleton-title skeleton-shimmer"></div>
          <div className="skeleton-subtitle skeleton-shimmer"></div>
          <div className="skeleton-price-old skeleton-shimmer"></div>
          <div className="skeleton-price skeleton-shimmer"></div>
        </div>
        <div className="main__buy-button main__buy-button--skeleton skeleton-shimmer"></div>
      </li>
    );
  }

  const isOutOfStock = item.count === 0;

  return (
    <li
      className={`main__right-item ${className}`}
      style={
        isOutOfStock
          ? {
              filter: 'blur(1px)',
              opacity: 0.5,
              pointerEvents: 'none',
              position: 'relative',
            }
          : {}
      }>
      {isOutOfStock && (
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.64)',
            color: '#fff',
            padding: '6px 10px',
            borderRadius: '8px',
            fontSize: '14px',
            zIndex: 2,
          }}>
          Нет в наличии
        </span>
      )}

      <Link href={`/flowers/${item.id}`}>
        <div className={`main__img-container`}>
          <Image
            width={170}
            height={170}
            className="main__img"
            src={item.image}
            alt={item.description}
            loading="lazy"
          />
        </div>
        <div className="main__right-container">
          <h3 className="main__item-title">{item.name}</h3>
          <p className="main__item-subtitle">{item.type}</p>
          <span className="main__item-price-old">{item.price * 5} ₸</span>
          <span className="main__item-price">
            {Math.round(item.price * 5 * (1 - item.discount))} ₸
          </span>
        </div>
      </Link>

      {!isOutOfStock && <CartButton className="main__buy-button" item={item} />}
    </li>
  );
}
