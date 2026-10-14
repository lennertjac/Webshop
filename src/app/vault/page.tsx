import type { Metadata } from 'next';
import Link from 'next/link';
import { Gem } from 'lucide-react';
import { Scene } from '@/components/art/Scene';
import { AddToCartButton, WishlistButton } from '@/components/product/ProductActions';
import { ProductImage } from '@/components/product/ProductImage';
import { GradeBadge } from '@/components/product/ProductSpecs';
import { ButtonLink } from '@/components/ui/Button';
import { Breadcrumbs, Container, OrnamentDivider, StockStatus } from '@/components/ui/primitives';
import { formatPrice } from '@/lib/config';
import { sortProducts } from '@/lib/data/filter';
import { getProducts } from '@/lib/data/products';
import type { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: 'The Vault – Our Most Special Cards',
  description: 'Hand-picked rare cards, signed pieces and top-grade slabs, presented like museum artefacts.',
  alternates: { canonical: '/vault' },
};

const meta = (p: Product) => [p.tcgLabel, p.set].filter(Boolean).join(' · ');

function Centerpiece({ product }: { product: Product }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <div className="relative mx-auto w-full max-w-sm">
        <div className="absolute -inset-10 rounded-full bg-cyan/25 blur-3xl" aria-hidden />
        <div className="absolute -inset-4 rounded-full bg-gold/20 blur-2xl" aria-hidden />
        <div className="relative aspect-[4/5] rounded-3xl border-2 border-gold/70 bg-gradient-to-b from-white/15 to-white/5 p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] [box-shadow:inset_0_0_0_6px_rgb(24_38_63),inset_0_0_0_7px_rgb(201_162_82/0.5),0_30px_80px_-20px_rgba(0,0,0,0.6)]">
          <div className="relative h-full w-full drop-shadow-[0_24px_24px_rgba(0,0,0,0.5)]">
            <ProductImage src={product.images[0]} alt={product.name} priority sizes="(min-width:1024px) 400px, 90vw" />
          </div>
        </div>
        <div className="mx-auto mt-3 h-3 w-4/5 rounded-[50%] bg-black/40 blur-md" aria-hidden />
      </div>

      <div>
        <p className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.22em] text-gold">
          <Gem className="size-4" aria-hidden /> The centerpiece
        </p>
        <h2 className="mt-3 font-serif text-4xl font-bold leading-[1.05] text-white sm:text-6xl">
          <Link href={`/products/${product.slug}`} className="hover:text-gold">
            {product.name}
          </Link>
        </h2>
        <p className="mt-3 font-sans text-sm text-ivory/75">{meta(product)}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <GradeBadge product={product} />
          {!product.isGraded && <span className="font-sans text-sm font-semibold text-ivory">{product.condition}</span>}
          <StockStatus product={product} detailed />
        </div>
        <p className="mt-6 font-sans text-5xl font-bold tabular-nums text-gold">{formatPrice(product.price)}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <div className="min-w-44 flex-1 sm:flex-none">
            <AddToCartButton product={product} size="lg" />
          </div>
          <ButtonLink href={`/products/${product.slug}`} variant="onDark" size="lg">
            View Product
          </ButtonLink>
          <WishlistButton product={product} className="size-12 border-white/30 bg-white/10 text-white hover:text-gold" />
        </div>
      </div>
    </div>
  );
}

function Artefact({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold/40 bg-white/[0.06] shadow-[0_20px_40px_-24px_rgba(0,0,0,0.7)] transition-[transform,border-color,background-color] duration-200 hover:border-gold hover:bg-white/10 motion-safe:hover:-translate-y-1">
      <div className="relative aspect-[4/5] bg-[radial-gradient(ellipse_at_50%_35%,rgb(255_255_255/0.22),rgb(255_255_255/0.02)_70%)]">
        <div className="absolute inset-x-8 bottom-6 top-8 transition-transform duration-300 motion-safe:group-hover:scale-[1.03]">
          <div className="relative h-full w-full drop-shadow-[0_18px_18px_rgba(0,0,0,0.55)]">
            <ProductImage src={product.images[0]} alt={product.name} sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw" />
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
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">{meta(product)}</p>
        <h3 className="font-serif text-2xl font-bold leading-snug text-white">
          <Link href={`/products/${product.slug}`} className="hover:text-gold">
            {product.name}
          </Link>
        </h3>
        {!product.isGraded && <p className="font-sans text-sm text-ivory/70">{product.condition}</p>}
        <div className="mt-1 flex items-end justify-between gap-3">
          <p className="font-sans text-2xl font-bold tabular-nums text-gold">{formatPrice(product.price)}</p>
          <StockStatus product={product} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <ButtonLink href={`/products/${product.slug}`} variant="onDark">
            View
          </ButtonLink>
          <AddToCartButton product={product} size="md" />
        </div>
      </div>
    </article>
  );
}

export default async function VaultPage() {
  const all = await getProducts();
  const items = sortProducts(all.filter((p) => p.isVault && p.stock > 0), 'price-desc');
  const [centerpiece, ...rest] = items;

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-gold/60">
        <div className="absolute inset-0 -z-10">
          <Scene variant="vault" />
          <div className="absolute inset-0 bg-gradient-to-b from-ivory/55 via-ivory/15 to-navy" />
        </div>
        <Container className="pb-24 pt-10 text-center sm:pb-32 sm:pt-16">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'The Vault' }]} className="flex justify-center" />
          <span className="mx-auto mt-6 grid size-14 place-items-center rounded-full border border-gold bg-navy text-gold shadow-card">
            <Gem className="size-6" aria-hidden />
          </span>
          <h1 className="mt-4 font-serif text-5xl font-bold sm:text-7xl">The Vault</h1>
          <p className="mx-auto mt-3 max-w-xl font-sans text-base text-ink/85 sm:text-lg">
            The treasure hall of Atlas: legendary cards, signed showcases and flawless slabs, each one hand-picked and guarded.
          </p>
          <OrnamentDivider className="mx-auto mt-6 max-w-xs" />
          {items.length > 0 && (
            <p className="mt-4 font-sans text-sm font-semibold text-navy">
              {items.length} {items.length === 1 ? 'piece' : 'pieces'} on display
            </p>
          )}
        </Container>
      </section>

      <section className="relative isolate -mt-px overflow-hidden bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,#3b4f86_0%,#18263F_55%,#101a2e_100%)] pb-20 pt-4 text-ivory">
        <div className="gold-hairline absolute inset-x-0 top-0" aria-hidden />
        <Container className="py-12 sm:py-16">
          {centerpiece ? (
            <>
              <Centerpiece product={centerpiece} />
              {rest.length > 0 && (
                <div className="mt-20">
                  <div className="mb-8 text-center">
                    <h2 className="font-serif text-4xl font-bold text-white">The Collection</h2>
                    <OrnamentDivider className="mx-auto mt-4 max-w-xs" />
                  </div>
                  <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((p) => (
                      <li key={p.id}>
                        <Artefact product={p} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="py-16 text-center font-sans text-ivory/80">The vault is being restocked. Explore the full shop in the meantime.</p>
          )}
          <div className="mt-14 text-center">
            <ButtonLink href="/shop" variant="onDark" size="lg">
              Browse the full shop
            </ButtonLink>
            <p className="mt-3 font-sans text-xs text-ivory/60">Vault pieces are also listed in the shop and their collections.</p>
          </div>
        </Container>
      </section>
    </>
  );
}
