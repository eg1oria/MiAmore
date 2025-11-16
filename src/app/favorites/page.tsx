'use client';

import { Provider } from 'react-redux';
import { store } from '../store';
import Favorites from '@/components/Favorites/Favorites';

export default function App() {
  return (
    <div className="">
      <Provider store={store}>
        <Favorites />
      </Provider>
    </div>
  );
}
