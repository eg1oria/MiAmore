'use client';

import Flowers from '@/components/Flowers/Flowers';
import IntroSlider from '@/components/IntroSlider/IntroSlider';
import { Provider } from 'react-redux';
import { store } from './store';

export default function App() {
  return (
    <Provider store={store}>
      <div className="main">
        <IntroSlider />
        <h2 className="mainTitle">Каталог</h2>
        <Flowers />
      </div>
    </Provider>
  );
}
