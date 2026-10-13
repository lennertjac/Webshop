import Link from 'next/link';
import clsx from 'clsx';
import type { Product } from '@/lib/types';
import { Price, ProductTags, StockStatus } from '@/components/ui/primitives';
import { ProductImage } from './ProductImage';
import { ProductSpecsLine } from './ProductSpecs';
import { AddToCartButton, QuickViewButton, WishlistButton } from './ProductActions';

export function ProductCard({ product, priority = false, className }: { product: Product; priority?: boolean; className?: string }) {
  const soldOut = product.availability === 'sold-out';
  return (
    <article
      className={clsx(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone/70 bg-white shadow-card',
        'transition-[transform,box-shadow,border-color] duration-200 motion-safe:hover:-translate-y-1 hover:border-gold/70 hover:shadow-glow focus-within:border-gold/70 focus-within:shadow-glow',
        className,
      )}
    >
      <div className="relative aspect-[4/5] bg-gradient-to-b from-ivory to-parchment/70">
        <div className="absolute inset-0 p-5 transition-transform duration-300 motion-safe:group-hover:scale-[1.03]">
          <div className={clsx('relative h-full w-full drop-shadow-[0_10px_14px_rgba(24,38,63,0.25)]', soldOut && 'opacity-60 grayscale')}>
            <ProductImage src={product.images[0]} alt={product.name} priority={priority} sizes="(min-width:1536px) 20vw, (min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw" />
          </div>
        </div>
        <ProductTags tags={product.tags} className="absolute left-3 top-3 z-10" />
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
          <WishlistButton product={product} />
          <QuickViewButton product={product} className="opacity-0 transition-opacity max-md:hidden group-hover:opacity-100 focus-visible:opacity-100 group-focus-within:opacity-100" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5 sm:p-4">
        <p className="truncate font-sans text-[11px] font-semibold uppercase tracking-wider text-muted">
          {[product.tcgLabel, product.set].filter(Boolean).join(' · ')}
        </p>
        <h3 className="line-clamp-2 min-h-[2.6em] font-sans text-[15px] font-semibold leading-snug text-ink">
          <Link href={`/products/${product.slug}`} className="after:absolute after:inset-0 after:z-[1] focus-visible:outline-offset-[-2px]">
            {product.name}
          </Link>
        </h3>
        <ProductSpecsLine product={product} />
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <Price product={product} />
          <StockStatus product={product} />
        </div>
        <div className="relative z-10 pt-1">
          <AddToCartButton product={product} size="sm" />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products, className, priorityCount = 0 }: { products: Product[]; className?: string; priorityCount?: number }) {
  return (
    <ul className={clsx('grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 3xl:grid-cols-5', className)}>
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}
