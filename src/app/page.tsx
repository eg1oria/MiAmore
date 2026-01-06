'use client';

import Flowers from '@/components/Flowers/Flowers';
import { Provider } from 'react-redux';
import { store } from './store';
import IntroSlider from '@/components/IntroSlider/IntroSlider';
import AboutPage from '@/components/AboutPage/AboutPage';
import TypesPages from '@/components/TypesPages/TypesPages';
import MapPage from '@/components/MapPage.tsx/MapPage';

export default function App() {
  return (
    <Provider store={store}>
      <div className="main">
        <IntroSlider />
        <div className="container">
          <Flowers slicedNum={8} titleText="Популярные букеты" showOutOfStock={false} />
          <AboutPage />
          <TypesPages />
          <MapPage />
        </div>
      </div>
    </Provider>
  );
}
