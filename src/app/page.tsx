import type { Metadata } from 'next';
import { CategoryGrid, TcgGrid } from '@/components/home/DestinationGrids';
import { Hero } from '@/components/home/Hero';
import { PromoBanner } from '@/components/home/PromoBanner';
import { StorySection } from '@/components/home/StorySection';
import { TrustSection } from '@/components/home/TrustSection';
import { ProductSection } from '@/components/product/ProductSection';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { JsonLd } from '@/components/ui/JsonLd';
import { SITE_NAME, SITE_URL } from '@/lib/config';
import { newestFirst, sortProducts } from '@/lib/data/filter';
import { getProducts } from '@/lib/data/products';

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default async function HomePage() {
  const products = await getProducts();
  const inStock = products.filter((p) => p.stock > 0);
  const heroCards = sortProducts(inStock, 'featured').filter((p) => p.images.length).slice(0, 3);
  const newArrivals = newestFirst(inStock).slice(0, 10);
  const bundles = inStock.filter((p) => p.kind === 'collection').slice(0, 10);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
            { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL, potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
          ],
        }}
      />
      <Hero products={heroCards} />
      <CategoryGrid products={products} />
      <TcgGrid products={products} />
      <ProductSection id="new-arrivals" title="New Arrivals" eyebrow="Recently Discovered" products={newArrivals} href="/collections/new-arrivals" hrefLabel="View All New Arrivals" />
      <PromoBanner
        eyebrow="Riftbound"
        title="Riftbound New Arrivals"
        text="Signed showcases, alt-arts and fresh sealed relics from the arcane citadel – new finds added regularly."
        cta="Shop Now"
        href="/collections/riftbound"
        scene="riftbound"
      />
      <ProductSection id="collections" title="Collections" eyebrow="Sold together" products={bundles} href="/collections/bundles" hrefLabel="View all collections" tone="parchment" />
      <PromoBanner
        eyebrow="The Vault"
        title="Rare & High-End Pieces"
        text="Legendary slabs and premium singles, displayed like artefacts in a treasure hall."
        cta="Enter the Vault"
        href="/vault"
        scene="vault"
        premium
      />
      <TrustSection />
      <PromoBanner
        eyebrow="Sell to Atlas"
        title="Sell Your Pristine Cards"
        text="Bring your pristine legends to Atlas. Up to 100% of market value for cards worth €200 or more in perfect condition – no discount, no worries."
        cta="Sell Your Cards"
        href="/sell"
        scene="sell"
      />
      <StorySection />
      <RecentlyViewed />
    </>
  );
}
