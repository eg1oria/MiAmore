'use client';

import Flowers from '@/components/Flowers/Flowers';
import { Provider } from 'react-redux';
import { store } from './store';
import IntroSlider from '@/components/IntroSlider/IntroSlider';
import AboutPage from '@/components/AboutPage/AboutPage';
import TypesPages from '@/components/TypesPages/TypesPages';
import MapPage from '@/components/MapPage.tsx/MapPage';
import ReviewPage from '@/components/ReviewPage/ReviewPage';
import ContactsPage from '@/components/ContactsPage/ContactsPage';

export default function App() {
  return (
    <Provider store={store}>
      <div className="main">
        <IntroSlider />
        <div className="container">
          <div className="flowCont">
            <Flowers
              slicedNum={8}
              titleText="Популярные букеты"
              showOutOfStock={false}
              useSlider={true}
            />
          </div>
          <AboutPage />
          <TypesPages />
          <MapPage />
        </div>
        <ReviewPage />
        <div className="container">
          <ContactsPage />
        </div>
      </div>
    </Provider>
  );
}
