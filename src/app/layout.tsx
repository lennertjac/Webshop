import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';
import { Providers } from '@/components/layout/Providers';
import { AnnouncementBar, Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { ToastHost } from '@/components/layout/ToastHost';
import { SITE_NAME, SITE_URL } from '@/lib/config';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-cormorant', display: 'swap' });
const sans = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} – Rare TCG cards, graded slabs & sealed product`, template: `%s | ${SITE_NAME}` },
  description: 'Explore rare singles, graded cards, sealed products and collector pieces from across the TCG world. Authenticity guaranteed, securely shipped.',
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'en_IE', url: SITE_URL },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = { themeColor: '#18263F', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col bg-ivory pb-16 md:pb-0">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-white">
          Skip to content
        </a>
        <Providers>
          <AnnouncementBar />
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <ToastHost />
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
