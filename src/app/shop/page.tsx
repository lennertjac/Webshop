import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageHero } from '@/components/shop/PageHero';
import { ShopBrowser } from '@/components/shop/ShopBrowser';
import { Container } from '@/components/ui/primitives';
import { getProducts } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Shop All',
  description: 'Browse every card, graded slab and sealed product in stock. Filter by TCG, set, condition, grade and price.',
  alternates: { canonical: '/shop' },
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <>
      <PageHero title="Shop All" flavour="The Whole Atlas" description="Every card, slab and sealed relic currently in the vault." scene="catalog" crumbs={[{ name: 'Home', href: '/' }, { name: 'Shop All' }]} />
      <Container className="py-8 sm:py-10">
        <Suspense fallback={<p className="py-20 text-center font-sans text-muted">Loading products…</p>}>
          <ShopBrowser products={products} />
        </Suspense>
      </Container>
    </>
  );
}
