import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Scene } from '@/components/art/Scene';
import { Container, SectionHeading } from '@/components/ui/primitives';
import { COLLECTIONS, TCG_SLUGS, type Collection, type SceneVariant } from '@/lib/collections';
import type { Product } from '@/lib/types';

interface Tile {
  href: string;
  title: string;
  flavour?: string;
  description: string;
  scene: SceneVariant;
  count?: number;
}

function DestinationTile({ tile, tall = false }: { tile: Tile; tall?: boolean }) {
  return (
    <Link
      href={tile.href}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone/70 bg-white shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:border-gold/70 hover:shadow-glow motion-safe:hover:-translate-y-1"
    >
      <div className={`relative overflow-hidden ${tall ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
        <div className="absolute inset-0 transition-transform duration-500 motion-safe:group-hover:scale-105">
          <Scene variant={tile.scene} />
        </div>
        {tile.count !== undefined && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 font-sans text-xs font-semibold text-navy shadow-sm">
            {tile.count} {tile.count === 1 ? 'product' : 'products'}
          </span>
        )}
      </div>
      <div className="flex flex-1 items-start justify-between gap-3 p-4">
        <div>
          <h3 className="font-serif text-2xl font-bold leading-tight">{tile.title}</h3>
          {tile.flavour && <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-dark">{tile.flavour}</p>}
          <p className="mt-1.5 font-sans text-sm leading-snug text-muted">{tile.description}</p>
        </div>
        <ArrowUpRight className="mt-1 size-5 shrink-0 text-arcane transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
      </div>
    </Link>
  );
}

const countFor = (c: Collection, products: Product[]) => products.filter(c.match).length;

export function CategoryGrid({ products }: { products: Product[] }) {
  const pick = (slug: string) => COLLECTIONS.find((c) => c.slug === slug)!;
  const tiles: Tile[] = [
    ...['singles', 'graded', 'sealed', 'bundles', 'new-arrivals'].map((slug) => {
      const c = pick(slug);
      return { href: `/collections/${c.slug}`, title: c.title, flavour: c.flavour, description: c.description, scene: c.scene, count: countFor(c, products) };
    }),
    { href: '/vault', title: 'The Vault', flavour: 'The Treasure Chamber', description: 'Our most special pieces, on display.', scene: 'vault', count: products.filter((p) => p.isVault).length },
  ];
  return (
    <section aria-label="Shop by Category" className="py-12 sm:py-16">
      <Container>
        <SectionHeading title="Shop by Category" eyebrow="Start your expedition" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t) => (
            <li key={t.href}>
              <DestinationTile tile={t} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export function TcgGrid({ products }: { products: Product[] }) {
  const tcgs = TCG_SLUGS.map((s) => COLLECTIONS.find((c) => c.slug === s)!);
  return (
    <section className="bg-parchment-grain py-12 sm:py-16">
      <Container>
        <SectionHeading title="Shop by TCG" eyebrow="Choose your world" />
        <ul className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {tcgs.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/collections/${c.slug}`}
                className="group relative flex aspect-[16/10] h-full flex-col justify-end overflow-hidden rounded-2xl border border-stone/70 shadow-card transition-[transform,box-shadow,border-color] duration-200 hover:border-gold/70 hover:shadow-glow motion-safe:hover:-translate-y-1 sm:aspect-[4/5]"
              >
                <div className="absolute inset-0 transition-transform duration-500 motion-safe:group-hover:scale-105">
                  <Scene variant={c.scene} />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy/90 via-navy/55 to-transparent" />
                <div className="relative p-4">
                  <h3 className="font-serif text-2xl font-bold leading-tight text-white">{c.title}</h3>
                  <p className="mt-0.5 font-sans text-xs text-white/85">{countFor(c, products)} products</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export { DestinationTile };
