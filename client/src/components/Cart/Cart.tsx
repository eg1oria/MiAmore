'use client';

import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import './Cart.css';
import Flowers from '../Flowers/Flowers';
import { useAuth } from '@/contexts/AuthContext';

export default function CartPage() {
  const { cart, changeCount, remove, isLoading, clearCart } = useCart();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-xl font-semibold">
        Вы не авторизованы
      </div>
    );
  }

  const handleCheckout = async () => {
    if (isCheckingOut) return;

    setIsCheckingOut(true);

    try {
      const res = await fetch('http://localhost:4000/cart/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Ошибка при оформлении заказа');
        return;
      }

      clearCart();

      alert('✅ Заказ успешно отправлен!');

      // Опционально: перенаправляем на страницу успеха
      // router.push('/order-success');
    } catch (e) {
      console.error('Checkout error:', e);
      alert('Ошибка сети. Попробуйте ещё раз.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.count, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.count, 0);

  return (
    <>
      <div className="cart-container">
        <h1 className="cart-title">Корзина</h1>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <p>Ваша корзина пуста</p>
            <button onClick={() => router.push('/flowers')}>Перейти к покупкам</button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">🌸</div>

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="price">{item.price} ₽</p>
                  </div>

                  <div className="cart-item-count">
                    <button
                      onClick={() => changeCount(item.id, item.count - 1)}
                      disabled={isLoading || isCheckingOut}>
                      <FaMinus />
                    </button>
                    <span>{item.count}</span>
                    <button
                      onClick={() => changeCount(item.id, item.count + 1)}
                      disabled={isLoading || isCheckingOut}>
                      <FaPlus />
                    </button>
                  </div>

                  <div className="cart-item-total">{item.price * item.count} ₽</div>

                  <button
                    onClick={() => remove(item.id)}
                    disabled={isLoading || isCheckingOut}
                    className="cart-item-remove">
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-info">
                <div className="summary-row">
                  <span>Товаров:</span>
                  <span>{totalItems} шт</span>
                </div>
                <div className="summary-row total">
                  <span>Итого:</span>
                  <span>{total} ₽</span>
                </div>
              </div>
              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={isCheckingOut || isLoading}>
                {isCheckingOut ? 'Отправка...' : 'Оформить заказ'}
              </button>
            </div>
          </div>
        )}
        <h1
          style={{
            fontSize: '30px',
            fontWeight: 'bold',
            margin: '150px 0 30px 0',
          }}>
          Можете добавить букеты прямо из корзины
        </h1>
        <Flowers />
      </div>
    </>
  );
}
