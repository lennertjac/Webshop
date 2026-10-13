'use client';

import { useEffect } from 'react';
import { Container, SectionHeading } from '@/components/ui/primitives';
import { useProductsByIds } from '@/lib/use-products';
import { useHydrated } from '@/store/cart';
import { useRecent } from '@/store/preferences';
import { Carousel } from './Carousel';
import { ProductCard } from './ProductCard';

export function ViewTracker({ productId }: { productId: string }) {
  const track = useRecent((s) => s.trackView);
  useEffect(() => track(productId), [productId, track]);
  return null;
}

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const hydrated = useHydrated();
  const viewed = useRecent((s) => s.viewed);
  const ids = viewed.filter((id) => id !== excludeId).slice(0, 10);
  const { products } = useProductsByIds(hydrated ? ids : []);
  if (!products.length) return null;
  return (
    <section aria-label="Recently viewed" className="py-12">
      <Container>
        <SectionHeading title="Recently Viewed" />
        <Carousel label="Recently viewed products">
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
