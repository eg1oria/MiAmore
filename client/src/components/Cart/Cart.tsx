'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useEffect } from 'react';
import './Cart.css';

export default function CartPage() {
  const { cart, changeCount, remove, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      router.push('/cart');
    }
  }, [isAuthenticated, router]);

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
                      disabled={isLoading}>
                      <FaMinus />
                    </button>
                    <span>{item.count}</span>
                    <button
                      onClick={() => changeCount(item.id, item.count + 1)}
                      disabled={isLoading}>
                      <FaPlus />
                    </button>
                  </div>

                  <div className="cart-item-total">{item.price * item.count} ₽</div>

                  <button
                    onClick={() => remove(item.id)}
                    disabled={isLoading}
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
              <button className="checkout-btn">Оформить заказ</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
