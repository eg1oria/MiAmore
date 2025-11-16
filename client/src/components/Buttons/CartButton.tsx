'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { IFlower } from '@/types/IFlower';
import { useState } from 'react';

interface Props {
  item: IFlower;
  className?: string;
}

export default function CartButton({ item, className }: Props) {
  const { add, remove, cart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);

  const serverItem = cart.find((c) => c.productId === String(item.id));
  const inCart = Boolean(serverItem);

  const handleAdd = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setLoadingAdd(true);
    await add({
      productId: String(item.id),
      name: item.name,
      price: item.price,
      count: 1,
    });
    setLoadingAdd(false);
  };

  const handleRemove = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setLoadingRemove(true);
    if (serverItem) await remove(serverItem.id);
    setLoadingRemove(false);
  };

  return (
    <div className="main__buttons">
      {inCart ? (
        <button className={className} onClick={handleRemove} disabled={loadingRemove}>
          {loadingRemove ? (
            <div
              className="loader"
              style={{
                width: '22.8px',
                borderWidth: '4px',
              }}></div>
          ) : (
            'Удалить'
          )}
        </button>
      ) : (
        <button className={className} onClick={handleAdd} disabled={loadingAdd}>
          {loadingAdd ? (
            <div
              className="loader"
              style={{
                width: '22.8px',
                borderWidth: '4px',
              }}></div>
          ) : (
            'В корзину'
          )}
        </button>
      )}
    </div>
  );
}
