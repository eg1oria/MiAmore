'use client';

import Flowers from '@/components/Flowers/Flowers';
import { Provider } from 'react-redux';
import { store } from './store';

export default function App() {
  return (
    <Provider store={store}>
      <div className="main">
        <div className="container">
          <h2 className="mainTitle">Каталог</h2>
          <Flowers />
        </div>
      </div>
    </Provider>
  );
}
