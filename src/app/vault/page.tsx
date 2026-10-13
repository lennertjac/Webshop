import type { Metadata } from 'next';
import Link from 'next/link';
import { Gem } from 'lucide-react';
import { Scene } from '@/components/art/Scene';
import { AddToCartButton, WishlistButton } from '@/components/product/ProductActions';
import { ProductImage } from '@/components/product/ProductImage';
import { GradeBadge } from '@/components/product/ProductSpecs';
import { ButtonLink } from '@/components/ui/Button';
import { Breadcrumbs, Container, OrnamentDivider, Price, StockStatus } from '@/components/ui/primitives';
import { VAULT_MIN_PRICE } from '@/lib/config';
import { sortProducts } from '@/lib/data/filter';
import { getProducts } from '@/lib/data/products';
import type { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: 'The Vault – Rare & High-End Cards',
  description: 'Premium singles, signed cards and top-grade slabs, presented like museum artefacts.',
  alternates: { canonical: '/vault' },
};

function Artefact({ product, priority }: { product: Product; priority: boolean }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-gold/60 bg-white shadow-card transition-[transform,box-shadow] duration-200 hover:shadow-glow motion-safe:hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(ellipse_at_50%_30%,#fff,#E9E4F4_60%,#D8D0BF)]">
        <div className="absolute inset-x-6 bottom-0 h-3 rounded-t-md bg-gradient-to-b from-gold to-gold-dark" aria-hidden />
        <div className="absolute inset-x-10 bottom-3 h-4 bg-gradient-to-b from-stone to-white/60" aria-hidden />
        <div className="absolute inset-x-8 bottom-10 top-8 transition-transform duration-300 motion-safe:group-hover:scale-[1.03]">
          <div className="relative h-full w-full drop-shadow-[0_18px_18px_rgba(24,38,63,0.3)]">
            <ProductImage src={product.images[0]} alt={product.name} priority={priority} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
          </div>
        </div>
        <div className="absolute left-4 top-4 z-10">
          <GradeBadge product={product} />
        </div>
        <div className="absolute right-4 top-4 z-10">
          <WishlistButton product={product} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-dark">{[product.tcgLabel, product.set].filter(Boolean).join(' · ')}</p>
        <h3 className="font-serif text-2xl font-bold leading-snug">
          <Link href={`/products/${product.slug}`} className="hover:text-arcane">
            {product.name}
          </Link>
        </h3>
        {!product.isGraded && <p className="font-sans text-sm text-muted">{product.condition}</p>}
        <div className="mt-1 flex items-end justify-between">
          <Price product={product} size="lg" />
          <StockStatus product={product} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <ButtonLink href={`/products/${product.slug}`} variant="secondary" size="md">
            View Product
          </ButtonLink>
          <AddToCartButton product={product} variant="premium" />
        </div>
      </div>
    </article>
  );
}

export default async function VaultPage() {
  const all = await getProducts();
  const items = sortProducts(all.filter((p) => p.isVault), 'price-desc');

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-gold/60">
        <div className="absolute inset-0 -z-10">
          <Scene variant="vault" />
          <div className="absolute inset-0 bg-gradient-to-b from-ivory/55 via-ivory/15 to-ivory" />
        </div>
        <Container className="py-12 text-center sm:py-20">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'The Vault' }]} className="flex justify-center" />
          <span className="mx-auto mt-6 grid size-14 place-items-center rounded-full border border-gold bg-navy text-gold shadow-card">
            <Gem className="size-6" aria-hidden />
          </span>
          <h1 className="mt-4 font-serif text-5xl font-bold sm:text-7xl">The Vault</h1>
          <p className="mx-auto mt-3 max-w-xl font-sans text-base text-ink/85 sm:text-lg">
            Rare and high-end pieces – top-grade slabs, signed cards and premium singles from €{VAULT_MIN_PRICE}.
          </p>
          <OrnamentDivider className="mx-auto mt-6 max-w-xs" />
          {items.length > 0 && (
            <p className="mt-4 font-sans text-sm font-semibold text-navy">
              {items.length} {items.length === 1 ? 'piece' : 'pieces'} on display
            </p>
          )}
        </Container>
      </section>

      <Container className="py-10 sm:py-14">
        {items.length ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p, i) => (
              <li key={p.id}>
                <Artefact product={p} priority={i < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-16 text-center font-sans text-muted">The vault is being restocked. Explore the full catalog in the meantime.</p>
        )}
        <div className="mt-10 text-center">
          <ButtonLink href="/collections/rare-high-end" variant="premium" size="lg">
            Filter all rare &amp; high-end products
          </ButtonLink>
        </div>
      </Container>
    </>
  );
}
