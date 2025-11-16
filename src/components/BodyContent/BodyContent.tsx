'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import { useTheme } from '@/contexts/ThemeContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function BodyContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { darkTheme } = useTheme();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          background: darkTheme ? 'white' : '#333333dd',
          display: 'flex',
          flexDirection: 'column',
        }}>
        {children}
      </body>
    </html>
  );
}
