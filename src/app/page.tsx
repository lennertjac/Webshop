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
  const featured = sortProducts(inStock, 'featured').slice(0, 10);

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
        text="Signed showcases, alt-arts and fresh sealed product – added regularly."
        cta="Shop Now"
        href="/collections/riftbound"
        scene="riftbound"
      />
      <ProductSection id="featured" title="Featured Collectibles" eyebrow="Hand-picked" products={featured} href="/shop" hrefLabel="Shop all products" variant="grid" tone="parchment" />
      <PromoBanner
        eyebrow="The Vault"
        title="Rare & High-End Pieces"
        text="Top-grade slabs and premium singles, presented like museum artefacts."
        cta="Enter the Vault"
        href="/vault"
        scene="vault"
        premium
      />
      <TrustSection />
      <StorySection />
      <RecentlyViewed />
    </>
  );
}
