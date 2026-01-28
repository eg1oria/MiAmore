'use client';

import { useCart } from '@/contexts/CartContext';
import { useRouter } from 'next/navigation';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useState } from 'react';
import './Cart.scss';
import 'react-photo-view/dist/react-photo-view.css';
import Flowers from '../Flowers/Flowers';
import { useAuth } from '@/contexts/AuthContext';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import Image from 'next/image';
import { FiUser } from 'react-icons/fi';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { FaPhoneAlt } from 'react-icons/fa';
import Map from '../Map/Map';
import { checkout } from '@/app/api/CartApi';
import CartButton from '../Buttons/CartButton';

export default function CartPage() {
  const { cart, changeCount, isLoading, clearCart } = useCart();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [adres, setAdres] = useState('');
  const [postCard, setPostCard] = useState(false);
  const [postCardText, setPostCardText] = useState('');
  const [errors, setErrors] = useState<{ phone?: string; name?: string; adres?: string }>({});
  const [openMap, setOpenMap] = useState(false);

  function handleOpenMap() {
    if (openMap) {
      setOpenMap(false);
    } else {
      setOpenMap(true);
    }
  }

  const handlePostCard = () => {
    if (postCard) {
      setPostCard(false);
    } else {
      setPostCard(true);
    }
  };

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
    const safe = escapeHtml(value.trim());
    const cleaned = safe.replace(/\s/g, '');
    switch (name) {
      case 'phone':
        if (!safe) return 'Номер телефона обязателен';
        if (!/^\+?\d{10,15}$/.test(cleaned)) return 'Неверный номер телефона';
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
      const data = await checkout({
        phone,
        name,
        adres,
        postCard,
        postCardText,
      });

      console.log('✅ Заказ отправлен:', data);

      clearCart();
      setPhone('');
      setName('');
      setAdres('');
      setErrors({});
      setPostCardText('');
      setPostCard(false);

      alert('Заказ успешно отправлен!');
    } catch (error) {
      console.error('❌ Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Ошибка при оформлении заказа');
    } finally {
      setIsCheckingOut(false);
    }
  };

  let total;

  if (postCard) {
    total = cart.reduce((sum, item) => sum + item.price * item.count, 0);
  } else {
    total = cart.reduce((sum, item) => sum + item.price + 100 * item.count, 0);
  }
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

                    <CartButton className="cart-item-remove" item={item} />
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
                    <div className="iconWrap">
                      <FiUser
                        className="inputIcon"
                        style={{ color: name.length > 0 ? '#4caf50' : '#ccc' }}
                      />
                      <input
                        type="text"
                        name="name"
                        placeholder="Введите имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="checkout-phone"
                        disabled={isCheckingOut}
                        style={{
                          borderColor: name.length > 0 ? '#4caf50' : '#ccc',
                        }}
                      />
                    </div>
                  </div>
                  <div className="inputWrap">
                    <div className="iconWrap">
                      <FaPhoneAlt
                        className="inputIcon"
                        style={{
                          color: errors.phone ? '#ff0000a5' : phone.length > 0 ? '#4caf50' : '#ccc',
                        }}
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Введите номер телефона"
                        value={phone}
                        onChange={handlePhoneChange}
                        className="checkout-phone"
                        disabled={isCheckingOut}
                        style={{
                          borderColor: errors.phone
                            ? '#ff0000a5'
                            : phone.length > 0
                              ? '#4caf50'
                              : '#ccc',
                        }}
                      />
                    </div>
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>

                  <div className="inputWrap">
                    <div className="iconWrap">
                      <FaMapMarkerAlt
                        className="inputIcon"
                        style={{
                          color: errors.adres ? '#ff0000a5' : adres.length > 0 ? '#4caf50' : '#ccc',
                        }}
                      />
                      <input
                        type="text"
                        name="adres"
                        placeholder="Введите адрес доставки"
                        value={adres}
                        onChange={handleAdresChange}
                        className="checkout-phone"
                        disabled={isCheckingOut}
                        style={{
                          borderColor: errors.adres
                            ? '#ff0000a5'
                            : adres.length > 0
                              ? '#4caf50'
                              : '#ccc',
                        }}
                      />
                    </div>

                    {errors.adres && <span className="error-text">{errors.adres}</span>}
                    <button onClick={handleOpenMap} className="openMapBtn">
                      Выбрать на карте
                    </button>
                  </div>
                  <div className="inputWrap">
                    <label className="customCheckbox">
                      <input
                        id="postCard"
                        type="checkbox"
                        checked={postCard}
                        onChange={handlePostCard}
                      />
                      <span className="checkmark"></span>
                      Добавить открытку
                    </label>
                  </div>

                  {postCard && (
                    <div className="inputWrap">
                      <textarea
                        placeholder="Введите текст для открытки"
                        value={postCardText}
                        onChange={(e) => setPostCardText(e.target.value)}
                        className="checkout-textarea"
                        disabled={isCheckingOut}
                        style={{
                          borderColor: postCardText.length > 0 ? '#4caf50' : '#ccc',
                        }}
                      />
                    </div>
                  )}
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
        <Flowers slicedNum={44} titleText="Можете добавить букеты прямо из корзины" />
      </div>
      {openMap && (
        <Map
          onAddressSelect={(address) => {
            setAdres(address);
            setErrors((prev) => ({ ...prev, adres: undefined }));
          }}
          onClose={() => setOpenMap(false)}
          className="mapCart"
        />
      )}
    </>
  );
}
