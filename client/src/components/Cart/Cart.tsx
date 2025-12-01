'use client';

import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import './Cart.css';
import 'react-photo-view/dist/react-photo-view.css';
import Flowers from '../Flowers/Flowers';
import { useAuth } from '@/contexts/AuthContext';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import Image from 'next/image';

export default function CartPage() {
  const { cart, changeCount, remove, isLoading, clearCart } = useCart();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [adres, setAdres] = useState('');
  const [errors, setErrors] = useState<{ phone?: string; name?: string; adres?: string }>({});

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-xl font-semibold">
        Вы не авторизованы
      </div>
    );
  }

  const escapeHtml = (str: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '`': '&#x60;',
      '=': '&#x3D;',
    };
    return str.replace(/[&<>"'`=\/]/g, (char: string) => map[char] || char);
  };

  const validateField = (name: string, value: string): string | undefined => {
    const safe = escapeHtml(value.trim()); // escapeHtml можно добавить, если нужно
    switch (name) {
      case 'phone':
        if (!safe) return 'Номер телефона обязателен';
        if (!/^\d{10,15}$/.test(safe)) return 'Неверный номер телефона';
        break;
      case 'adres':
        if (!safe) return 'Адрес обязателен';
        if (safe.length < 5) return 'Адрес слишком короткий';
        break;
    }
    return undefined;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    setErrors((prev) => ({ ...prev, phone: validateField('phone', value) }));
  };

  const handleAdresChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAdres(value);
    setErrors((prev) => ({ ...prev, adres: validateField('adres', value) }));
  };

  const handleCheckout = async () => {
    if (isCheckingOut) return;

    const newErrors: typeof errors = {};

    if (!phone) {
      newErrors.phone = 'Номер обязателен';
    }
    if (!adres) {
      newErrors.adres = 'Адрес обязателен';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsCheckingOut(true);

    try {
      const res = await fetch('http://localhost:4000/cart/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          name,
          adres,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Ошибка при оформлении заказа');
        return;
      }

      clearCart();
      setPhone('');
      setName('');
      setAdres('');
      setErrors({});

      alert('Заказ успешно отправлен!');
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
              <PhotoProvider>
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <PhotoView src={item.image}>
                      <div className="cart-item-image">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={200}
                          height={200}
                          className="cart-img"
                        />
                      </div>
                    </PhotoView>

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
              </PhotoProvider>
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
                <div className="inputs">
                  <div className="inputWrap">
                    <input
                      type="text"
                      placeholder="Введите имя"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="checkout-phone"
                      disabled={isCheckingOut}
                    />
                  </div>
                  <div className="inputWrap">
                    <input
                      type="tel"
                      placeholder="Введите номер телефона"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="checkout-phone"
                      disabled={isCheckingOut}
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  <div className="inputWrap">
                    <input
                      type="text"
                      placeholder="Введите адрес доставки"
                      value={adres}
                      onChange={handleAdresChange}
                      className="checkout-phone"
                      disabled={isCheckingOut}
                    />
                    {errors.adres && <span className="error-text">{errors.adres}</span>}
                  </div>
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
