'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { addToCart, getCart, removeCartItem, updateCount } from '@/app/api/CartApi';
import { useAppDispatch } from '@/hooks/hooks';
import { loadCart } from '@/features/cartSlice';

interface CartItem {
  id: string; // ID элемента корзины
  productId: string; // ID товара
  name: string;
  price: number;
  count: number;
}

interface CartContextType {
  cart: CartItem[];
  refresh: () => void;
  add: (product: Omit<CartItem, 'id'>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  changeCount: (id: string, count: number) => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const refresh = async () => {
    try {
      setIsLoading(true);
      const items = await getCart();
      setCart(items);
      // Также обновляем Redux store
      dispatch(loadCart());
    } catch (error) {
      console.error('Error refreshing cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const add = async (product: Omit<CartItem, 'id'>) => {
    try {
      setIsLoading(true);
      await addToCart(product);
      await refresh();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const remove = async (id: string) => {
    try {
      setIsLoading(true);
      await removeCartItem(id);
      await refresh();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changeCount = async (id: string, count: number) => {
    try {
      setIsLoading(true);
      if (count <= 0) {
        await removeCartItem(id);
      } else {
        await updateCount(id, count);
      }
      await refresh();
    } catch (error) {
      console.error('Error updating count:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, refresh, add, remove, changeCount, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
