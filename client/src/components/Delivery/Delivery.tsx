'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store';
import { clearCart, increaseQuantity, decreaseQuantity } from '../../features/cartSlice';
import Image from 'next/image';
import './Cart.css';
import Flowers from '../Flowers/Flowers';

export default function Cart() {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="cart-page">
      <div className="container">
        <h2 className="cart-title">Оформление заказа</h2>

        {items.length === 0 ? (
          <p className="cart-empty">Пусто:(</p>
        ) : (
          <div className="cartContainer">
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-left">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="cart-item-image"
                    />
                    <div>
                      <h3 className="cart-item-name">{item.name}</h3>
                    </div>
                  </div>

                  <div className="cart-item-right">
                    <p className="cart-item-price">{item.price * item.quantity} ₽</p>
                    <div className="cart-item-content">
                      <div className="cart-item-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => dispatch(decreaseQuantity(item.id))}>
                          −
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => dispatch(increaseQuantity(item.id))}>
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="cart-info">
              <p className="cartTitle">Ваш заказ :</p>
              <p className="cartCountTotal">Всего товаров: {totalCount}</p>
              <p className="cart-total">Итого: {total} ₽</p>
              <button className="cart-clear-btn" onClick={() => dispatch(clearCart())}>
                Очистить корзину
              </button>
            </div>
          </div>
        )}

        <div className="flowersMass">
          <h2 className="CartAddFlowers">Добавьте цветы не выходя из корзины:</h2>
          <Flowers />
        </div>
      </div>
    </div>
  );
}
