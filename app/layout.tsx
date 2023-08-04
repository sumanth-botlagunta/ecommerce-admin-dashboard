import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs';

import { ModalProvider } from '@/providers/modal-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ecommerce admin dashboard',
  description: 'ecommerce admin dashboard built with next.js and tailwindcss',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Toaster />
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
