import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Innovatex Delulu Hunt',
  description: 'The Ultimate 6-Round Technology Challenge',
};

import { VT323 } from 'next/font/google';

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 ${vt323.variable}`}>
        {children}
      </body>
    </html>
  );
}
