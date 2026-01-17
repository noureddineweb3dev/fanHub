import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { locales } from '@/lib/i18n/config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'FanHub - Track Your Football Team',
  description: 'Follow any football team with live matches, news, player stats, and fan reactions',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
