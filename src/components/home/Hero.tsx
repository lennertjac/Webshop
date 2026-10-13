import { ButtonLink } from '@/components/ui/Button';
import { Scene } from '@/components/art/Scene';
import type { Product } from '@/lib/types';
import { HeroCards } from './HeroCards';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Hero({ products }: { products: Product[] }) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-[#CFE6EA]">
      <div className="absolute inset-0 -z-10">
        <Scene variant="hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory/90 via-ivory/55 via-60% to-transparent lg:bg-gradient-to-r lg:from-ivory/90 lg:via-ivory/40 lg:via-45% lg:to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ivory to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-[1440px] items-center gap-6 px-4 pb-14 pt-10 sm:px-6 lg:min-h-[640px] lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-8 lg:pb-20 lg:pt-14">
        <div className="max-w-xl">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/60 bg-white/70 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-gold-dark backdrop-blur">
            Atlas Cards &amp; Collectibles
          </p>
          <h1 id="hero-title" className="font-serif text-[2.6rem] font-bold leading-[1.02] sm:text-6xl xl:text-7xl">
            Discover Your Next Legendary Card
          </h1>
          <p className="mt-4 max-w-md font-sans text-base leading-relaxed text-ink/85 sm:text-lg">
            Explore rare singles, graded cards, sealed products and collector pieces from across the TCG world.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ButtonLink href="/shop" size="lg">
              Shop Cards
            </ButtonLink>
            <ButtonLink href="/collections/new-arrivals" size="lg" variant="secondary">
              Explore New Arrivals
            </ButtonLink>
          </div>
          <Link href="/vault" className="mt-5 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-gold-dark hover:underline">
            Enter the Vault <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <HeroCards products={products} />
      </div>
    </section>
  );
}
