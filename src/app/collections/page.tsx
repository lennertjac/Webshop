import type { Metadata } from 'next';
import { DestinationTile } from '@/components/home/DestinationGrids';
import { PageHero } from '@/components/shop/PageHero';
import { Container } from '@/components/ui/primitives';
import { COLLECTIONS } from '@/lib/collections';
import { getProducts } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Browse Atlas by category or TCG.',
  alternates: { canonical: '/collections' },
};

export default async function CollectionsIndex() {
  const products = await getProducts();
  return (
    <>
      <PageHero title="Collections" flavour="Choose your destination" description="Browse by product type or by TCG." scene="gateway" crumbs={[{ name: 'Home', href: '/' }, { name: 'Collections' }]} />
      <Container className="py-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c) => (
            <li key={c.slug}>
              <DestinationTile tile={{ href: `/collections/${c.slug}`, title: c.title, flavour: c.flavour, description: c.description, scene: c.scene, count: products.filter(c.match).length }} />
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
