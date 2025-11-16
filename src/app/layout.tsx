'use client';

import BodyContent from '@/components/BodyContent/BodyContent';
import Header, { navItem } from '@/components/Header/Header';
import { ThemeProvider } from '@/contexts/ThemeContext';
import './globals.css';
import Footer from '@/components/Footer/Footer';
import { Provider } from 'react-redux';
import { store } from './store';
import { usePathname } from 'next/navigation';
import { IoIosArrowForward } from 'react-icons/io';
import Link from 'next/link';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BodyContent>
          <Header />
          <div className="container">
            {navItem.map((item) => {
              const isActive = pathName === item.href;
              return (
                <div
                  key={item.href}
                  style={{
                    marginTop: '20px',
                  }}>
                  {isActive ? (
                    item.name ? (
                      item.href === '/' ? null : (
                        <p className="flex items-center text-gray-500">
                          <Link href="/">Главная</Link> <IoIosArrowForward />
                          {item.name}
                        </p>
                      )
                    ) : null
                  ) : null}
                </div>
              );
            })}
          </div>
          {children}
          <Footer />
        </BodyContent>
      </ThemeProvider>
    </Provider>
  );
}
