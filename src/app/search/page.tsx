import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchPageForm } from '@/components/shop/SearchPageForm';
import { ShopBrowser } from '@/components/shop/ShopBrowser';
import { Container } from '@/components/ui/primitives';
import { getProducts } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
  alternates: { canonical: '/search' },
};

export default async function SearchPage() {
  const products = await getProducts();
  return (
    <Container className="py-8 sm:py-10">
      <h1 className="mb-4 font-serif text-4xl font-bold">Search</h1>
      <Suspense fallback={null}>
        <SearchPageForm />
        <ShopBrowser products={products} emptyMessage="No products found. Try a different card name, set or TCG." />
      </Suspense>
    </Container>
  );
}
