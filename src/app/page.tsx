'use client';

import Flowers from '@/components/Flowers/Flowers';
import IntroSlider from '@/components/IntroSlider/IntroSlider';
import { useTheme } from '@/contexts/ThemeContext';
import { Provider } from 'react-redux';
import { store } from './store';

export default function App() {
  const { darkTheme } = useTheme();
  return (
    <Provider store={store}>
      <div
        className="main"
        style={{
          color: darkTheme ? '#222' : '#ddd',
        }}>
        <div className="container">
          <IntroSlider />
          <h2 className="mainTitle">Каталог</h2>
          <Flowers />
        </div>
      </div>
    </Provider>
  );
}
