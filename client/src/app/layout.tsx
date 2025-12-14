'use client';

import BodyContent from '@/components/BodyContent/BodyContent';
import { AuthProvider } from '@/contexts/AuthContext'; // Добавляем AuthProvider
import './globals.css';
import Footer from '@/components/Footer/Footer';
import { Provider } from 'react-redux';
import { store } from './store';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header/Header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <CartProvider>
        <AuthProvider>
          <BodyContent>
            <Header />
            {children}
            <Footer />
          </BodyContent>
        </AuthProvider>
      </CartProvider>
    </Provider>
  );
}
