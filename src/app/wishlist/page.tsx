'use client';

import { Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { AddToCartButton } from '@/components/product/ProductActions';
import { ProductImage } from '@/components/product/ProductImage';
import { GradeBadge } from '@/components/product/ProductSpecs';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Price, StockStatus } from '@/components/ui/primitives';
import { useProductsByIds } from '@/lib/use-products';
import { useHydrated } from '@/store/cart';
import { useWishlist } from '@/store/preferences';

export default function WishlistPage() {
  const hydrated = useHydrated();
  const ids = useWishlist((s) => s.ids);
  const toggle = useWishlist((s) => s.toggle);
  const { products, loading } = useProductsByIds(hydrated ? ids : []);

  return (
    <Container className="py-8 sm:py-12">
      <h1 className="font-serif text-4xl font-bold">Wishlist</h1>
      <p className="mt-1 font-sans text-sm text-muted">Saved on this device{hydrated && ids.length > 0 && ` · ${ids.length} item${ids.length === 1 ? '' : 's'}`}.</p>

      {!hydrated || loading ? (
        <p className="py-16 text-center font-sans text-muted">Loading…</p>
      ) : products.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-stone bg-white/60 p-12 text-center">
          <Heart className="size-10 text-stone" aria-hidden />
          <p className="font-sans font-semibold text-navy">Your wishlist is empty</p>
          <ButtonLink href="/shop">Browse products</ButtonLink>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-stone/60 overflow-hidden rounded-2xl border border-stone/70 bg-white shadow-card">
          {products.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
              <Link href={`/products/${p.slug}`} className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg border border-stone/60 bg-parchment/50">
                <ProductImage src={p.images[0]} alt={p.name} sizes="80px" />
              </Link>
              <div className="min-w-0 flex-1 font-sans">
                <Link href={`/products/${p.slug}`} className="line-clamp-2 text-base font-semibold text-ink hover:text-arcane">
                  {p.name}
                </Link>
                <p className="mt-0.5 text-xs text-muted">{[p.tcgLabel, p.set].filter(Boolean).join(' · ')}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  {p.isGraded ? <GradeBadge product={p} /> : <span className="text-xs text-ink/80">{p.condition}</span>}
                  <StockStatus product={p} />
                </div>
              </div>
              <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:flex-col sm:items-end">
                <Price product={p} />
                <div className="flex items-center gap-2">
                  <div className="w-36">
                    <AddToCartButton product={p} size="sm" />
                  </div>
                  <button type="button" onClick={() => toggle(p.id)} aria-label={`Remove ${p.name} from wishlist`} className="grid size-9 place-items-center rounded-lg border border-stone text-muted hover:border-danger hover:text-danger">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
