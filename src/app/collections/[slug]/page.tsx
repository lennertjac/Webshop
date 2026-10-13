import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PageHero } from '@/components/shop/PageHero';
import { ShopBrowser, type ListKey } from '@/components/shop/ShopBrowser';
import { Container } from '@/components/ui/primitives';
import { COLLECTIONS, getCollection } from '@/lib/collections';
import { newestFirst } from '@/lib/data/filter';
import { getProducts } from '@/lib/data/products';
import { JsonLd } from '@/components/ui/JsonLd';
import { SITE_URL } from '@/lib/config';

export const dynamicParams = false;

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCollection((await params).slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/collections/${c.slug}` },
    openGraph: { title: c.title, description: c.description, url: `/collections/${c.slug}` },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const collection = getCollection((await params).slug);
  if (!collection) notFound();

  const all = await getProducts();
  let products = all.filter(collection.match);
  // Until products carry a recent createdAt, still show the latest additions.
  if (collection.slug === 'new-arrivals' && !products.length) products = newestFirst(all).slice(0, 24);

  const isTcg = ['pokemon', 'riftbound', 'one-piece', 'magic-the-gathering', 'other-tcgs'].includes(collection.slug);
  const hide: ListKey[] = isTcg ? ['tcg'] : [];

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: collection.title,
          description: collection.description,
          url: `${SITE_URL}/collections/${collection.slug}`,
        }}
      />
      <PageHero
        title={collection.title}
        flavour={collection.flavour}
        description={collection.description}
        scene={collection.scene}
        dark={['archive', 'treasure', 'riftbound'].includes(collection.scene)}
        crumbs={[{ name: 'Home', href: '/' }, { name: 'Collections', href: '/collections' }, { name: collection.title }]}
      />
      <Container className="py-8 sm:py-10">
        <Suspense fallback={<p className="py-20 text-center font-sans text-muted">Loading products…</p>}>
          <ShopBrowser products={products} hideGroups={hide} emptyMessage="Nothing in this collection right now – check back soon." />
        </Suspense>
      </Container>
    </>
  );
}
