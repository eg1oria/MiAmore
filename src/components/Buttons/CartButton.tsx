'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { IFlower, CartItemApi } from '@/types/IFlower';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

interface Props {
  item: IFlower | CartItemApi;
  className?: string;
}

export default function CartButton({ item, className }: Props) {
  const { add, remove, cart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const isCartItem = 'productId' in item && typeof item.productId === 'string';

  const productId = isCartItem ? (item as CartItemApi).productId : String((item as IFlower).id);

  const serverItem = cart.find((c) => c.productId === productId);
  const inCart = Boolean(serverItem);

  const handleAdd = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setLoadingAdd(true);
    try {
      await add({
        productId: productId,
        name: item.name,
        price: item.price,
        image: item.image || '',
        count: 1,
      });
      enqueueSnackbar(`${item.name} успешно добавлено в корзину`, { variant: 'success' });
    } catch (error: unknown) {
      let message = 'Ошибка при добавлении товара';
      if (error instanceof Error) {
        message = error.message;
      }
      console.error('Error adding to cart:', error);
      enqueueSnackbar(message, { variant: 'error' });
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleRemove = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!serverItem) {
      enqueueSnackbar('Товар не найден в корзине', { variant: 'warning' });
      return;
    }

    setLoadingRemove(true);
    try {
      const itemIdToRemove = serverItem.id || serverItem.productId;

      console.log('🗑️ Удаление товара:', {
        serverItemId: serverItem.id,
        productId: serverItem.productId,
        removing: itemIdToRemove,
      });

      await remove(itemIdToRemove);
      enqueueSnackbar(`${item.name} удалён из корзины`, { variant: 'success' });
    } catch (error: unknown) {
      let message = 'Ошибка при удалении товара';
      if (error instanceof Error) {
        message = error.message;
      }
      console.error('❌ Ошибка при удалении из корзины:', error);

      if (message.includes('Session expired') || message.includes('login again')) {
        enqueueSnackbar('Сессия истекла. Войдите заново', { variant: 'error' });
        setTimeout(() => {
          localStorage.removeItem('auth_token');
          router.push('/login');
        }, 1500);
      } else if (
        message.includes('403') ||
        message.includes('401') ||
        message.toLowerCase().includes('forbidden')
      ) {
        enqueueSnackbar('Доступ запрещён. Требуется повторный вход', { variant: 'error' });
        setTimeout(() => {
          localStorage.removeItem('auth_token');
          router.push('/login');
        }, 1500);
      } else {
        enqueueSnackbar(message, { variant: 'error' });
      }
    } finally {
      setLoadingRemove(false);
    }
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
