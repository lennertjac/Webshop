'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Sheet } from '@/components/ui/Sheet';
import { ButtonLink } from '@/components/ui/Button';
import { Price, ProductTags, StockStatus } from '@/components/ui/primitives';
import type { Product } from '@/lib/types';
import { ProductImage } from './ProductImage';
import { AddToCartButton, WishlistButton } from './ProductActions';
import { ProductSpecsLine } from './ProductSpecs';

export function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <Sheet open onClose={onClose} label={`Quick view: ${product.name}`} side="center">
      <div className="grid overflow-y-auto md:grid-cols-2">
        <div className="relative aspect-[4/5] bg-gradient-to-b from-parchment to-ivory p-6 md:aspect-auto md:min-h-[420px]">
          <div className="relative h-full min-h-[320px]">
            <ProductImage src={product.images[0]} alt={product.name} sizes="(min-width:768px) 400px, 90vw" />
          </div>
        </div>
        <div className="flex flex-col gap-4 p-6 pt-12 md:p-8">
          <ProductTags tags={product.tags} max={3} />
          <div>
            <p className="font-sans text-xs font-semibold uppercase tracking-wider text-muted">{[product.tcgLabel, product.set].filter(Boolean).join(' · ')}</p>
            <h2 className="mt-1 font-serif text-2xl font-bold leading-snug">{product.name}</h2>
          </div>
          <ProductSpecsLine product={product} />
          <Price product={product} size="lg" />
          <StockStatus product={product} detailed />
          <div className="mt-auto flex flex-col gap-3 pt-2">
            <div className="flex gap-2">
              <AddToCartButton product={product} size="lg" />
              <WishlistButton product={product} className="size-12 shrink-0" />
            </div>
            <ButtonLink href={`/products/${product.slug}`} variant="secondary" full onClick={onClose}>
              View full details
            </ButtonLink>
            <p className="flex items-center gap-2 font-sans text-xs text-muted">
              <ShieldCheck className="size-4 text-emerald" aria-hidden /> Authenticity guaranteed · Secure packaging
            </p>
            <Link href="/shipping-returns" className="font-sans text-xs text-arcane hover:underline" onClick={onClose}>
              Shipping &amp; returns
            </Link>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
