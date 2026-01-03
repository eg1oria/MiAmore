'use client';

import Flowers from '@/components/Flowers/Flowers';
import { Provider } from 'react-redux';
import { store } from './store';
import IntroSlider from '@/components/IntroSlider/IntroSlider';

export default function App() {
  return (
    <Provider store={store}>
      <div className="main">
        <IntroSlider />
        <div className="container">
          <h2 className="mainTitle">Каталог</h2>
          <Flowers />
        </div>
      </div>
    </Provider>
  );
}
