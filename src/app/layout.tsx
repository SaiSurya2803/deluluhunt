import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Innovatex Delulu Hunt',
  description: 'The Ultimate 6-Round Technology Challenge',
};

import { Space_Grotesk, Inter, DotGothic16 } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const dotGothic = DotGothic16({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dot',
});

import { DatabaseSyncProvider } from '@/components/DatabaseSyncProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-background text-foreground antialiased selection:bg-primary/30 ${spaceGrotesk.variable} ${inter.variable} ${dotGothic.variable}`}>
        <DatabaseSyncProvider>
          {children}
        </DatabaseSyncProvider>
      </body>
    </html>
  );
}
