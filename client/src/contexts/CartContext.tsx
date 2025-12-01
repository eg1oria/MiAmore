'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { addToCart, getCart, removeCartItem, updateCount } from '@/app/api/CartApi';
import { useAppDispatch } from '@/hooks/hooks';
import { loadCart } from '@/features/cartSlice';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string; // ✅ ДОБАВИЛИ
  count: number;
}

interface CartContextType {
  cart: CartItem[];
  refresh: () => Promise<void>;
  add: (product: Omit<CartItem, 'id'>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  changeCount: (id: string, count: number) => Promise<void>;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const items = await getCart();
      setCart(items);
      dispatch(loadCart());
    } catch (error) {
      console.error('Error refreshing cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (product: Omit<CartItem, 'id'>) => {
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
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
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
    },
    [refresh],
  );

  const changeCount = useCallback(
    async (id: string, count: number) => {
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
    },
    [refresh],
  );

  return (
    <CartContext.Provider value={{ cart, refresh, add, remove, changeCount, clearCart, isLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
