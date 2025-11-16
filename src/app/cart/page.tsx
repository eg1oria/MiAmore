'use client';

import Cart from '@/components/Cart/Cart';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function App() {
  return (
    <div className="">
      <Provider store={store}>
        <Cart />
      </Provider>
    </div>
  );
}
