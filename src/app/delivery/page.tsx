'use client';

import Delivery from '@/components/Delivery/Delivery';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function App() {
  return (
    <div className="">
      <Provider store={store}>
        <Delivery />
      </Provider>
    </div>
  );
}
