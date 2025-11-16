'use client';

import CartPage from '@/components/Cart/Cart';
import Flowers from '@/components/Flowers/Flowers';

export default function Cart() {
  return (
    <div className="container">
      <CartPage />
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
  );
}
