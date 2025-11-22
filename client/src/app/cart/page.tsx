'use client';
import dynamic from 'next/dynamic';

const CartPage = dynamic(() => import('@/components/Cart/Cart'), {
  loading: () => <div className="loader"></div>,
});

export default function Cart() {
  return (
    <div className="container">
      <CartPage />
    </div>
  );
}
