'use client';

import { RootState } from '@/app/store';
import { addToCart, removeFromCart } from '@/features/cartSlice';
import { IFlower } from '@/types/IFlower';
import { useDispatch, useSelector } from 'react-redux';

interface CartButtonProps {
  item: IFlower;
  className?: string;
}

export default function CartButton({ item, className }: CartButtonProps) {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);

  const handleAdd = (flower: IFlower) => {
    dispatch(addToCart(flower));
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const inCart = cart.some((f) => f.id === item.id);

  return (
    <div className="main__buttons">
      {inCart ? (
        <button className={className} onClick={() => handleRemove(item.id)}>
          Удалить
        </button>
      ) : (
        <button className={className} onClick={() => handleAdd(item)}>
          В корзину
        </button>
      )}
    </div>
  );
}
