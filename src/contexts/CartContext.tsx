'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CartItemApi } from '@/types/IFlower';
import * as CartApi from '@/app/api/CartApi';

interface CartContextType {
  cart: CartItemApi[];
  isLoading: boolean;
  add: (item: {
    productId: string;
    name: string;
    price: number;
    image: string;
    count: number;
  }) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  changeCount: (itemId: string, count: number) => Promise<void>;
  clearCart: () => void;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Функция для проверки токена напрямую
function hasAuthToken(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('auth_token');
  return !!token;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItemApi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const refresh = useCallback(async () => {
    // Проверяем токен напрямую
    if (!hasAuthToken()) {
      console.log('⚠️ No auth token, skipping cart refresh');
      setCart([]);
      return;
    }

    try {
      console.log('🔄 Refreshing cart...');
      const items = await CartApi.getCart();
      console.log('✅ Cart loaded:', items);
      setCart(items);
    } catch (error) {
      console.error('❌ Error refreshing cart:', error);
      // Если ошибка авторизации, очищаем корзину
      if (
        error instanceof Error &&
        (error.message.includes('401') ||
          error.message.includes('403') ||
          error.message.includes('Authentication required'))
      ) {
        setCart([]);
      }
    }
  }, []);

  // Загружаем корзину при монтировании
  useEffect(() => {
    // Даём небольшую задержку, чтобы AuthContext успел инициализироваться
    const timer = setTimeout(() => {
      setIsInitialized(true);
      refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [refresh]);

  // Обновляем корзину при изменении токена
  useEffect(() => {
    if (!isInitialized) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        console.log('🔑 Auth token changed, refreshing cart');
        refresh();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isInitialized, refresh]);

  const add = useCallback(
    async (item: {
      productId: string;
      name: string;
      price: number;
      image: string;
      count: number;
    }) => {
      if (!hasAuthToken()) {
        throw new Error('User not authenticated');
      }

      setIsLoading(true);
      try {
        console.log('➕ Adding to cart:', item);
        const newItem = await CartApi.addToCart(item);
        console.log('✅ Item added:', newItem);
        await refresh();
      } catch (error) {
        console.error('❌ Error adding to cart:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [refresh],
  );

  const remove = useCallback(
    async (itemId: string) => {
      if (!hasAuthToken()) {
        throw new Error('User not authenticated');
      }

      setIsLoading(true);
      try {
        console.log('🗑️ Removing from cart, itemId:', itemId);
        await CartApi.removeCartItem(itemId);
        console.log('✅ Item removed');
        await refresh();
      } catch (error) {
        console.error('❌ Error removing from cart:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [refresh],
  );

  const changeCount = useCallback(
    async (itemId: string, count: number) => {
      if (!hasAuthToken()) {
        throw new Error('User not authenticated');
      }

      if (count <= 0) {
        await remove(itemId);
        return;
      }

      setIsLoading(true);
      try {
        console.log('🔢 Changing count:', { itemId, count });
        await CartApi.updateCount(itemId, count);
        console.log('✅ Count updated');
        await refresh();
      } catch (error) {
        console.error('❌ Error changing count:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [refresh, remove],
  );

  const clearCart = useCallback(async () => {
    if (!hasAuthToken()) {
      setCart([]);
      return;
    }

    try {
      console.log('🧹 Clearing cart...');
      await CartApi.clearCart();
      console.log('✅ Cart cleared');
      setCart([]);
    } catch (error) {
      console.error('❌ Error clearing cart:', error);
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        add,
        remove,
        changeCount,
        clearCart,
        refresh,
      }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
