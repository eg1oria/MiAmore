'use client';

import BodyContent from '@/components/BodyContent/BodyContent';
import { AuthProvider } from '@/contexts/AuthContext'; // Добавляем AuthProvider
import './globals.scss';
import Footer from '@/components/Footer/Footer';
import { Provider } from 'react-redux';
import { store } from './store';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header/Header';
import { SearchProvider } from '@/contexts/SearchContext';
import { SnackbarProvider } from 'notistack';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <SearchProvider>
          <AuthProvider>
            <CartProvider>
              <BodyContent>
                <Header />
                {children}
                <Footer />
              </BodyContent>
            </CartProvider>
          </AuthProvider>
        </SearchProvider>
      </SnackbarProvider>
    </Provider>
  );
}
