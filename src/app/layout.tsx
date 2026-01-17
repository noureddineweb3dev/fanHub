import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'FanHub - Track Your Football Team',
  description: 'Follow any football team with live matches, news, player stats, and fan reactions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cairo.variable}`}>
        {children}
      </body>
    </html>
  );
}
