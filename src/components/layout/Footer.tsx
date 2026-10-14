import Link from 'next/link';
import { BadgeCheck, Lock, PackageCheck, Truck } from 'lucide-react';
import { Logo } from './Header';
import { Container } from '@/components/ui/primitives';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/config';

export function AnnouncementBar() {
  return (
    <div className="bg-navy text-center font-sans text-xs font-medium text-ivory/90 sm:text-[13px]">
      <p className="mx-auto flex max-w-[1440px] items-center justify-center gap-x-3 gap-y-0 overflow-hidden px-4 py-2">
        <span>Free shipping above €{FREE_SHIPPING_THRESHOLD}</span>
        <span className="hidden text-gold sm:inline" aria-hidden>|</span>
        <span className="hidden sm:inline">Secure worldwide shipping</span>
        <span className="hidden text-gold md:inline" aria-hidden>|</span>
        <span className="hidden md:inline">Authentic collectibles</span>
      </p>
    </div>
  );
}

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      ['Shop All', '/shop'],
      ['Singles', '/collections/singles'],
      ['Graded Cards', '/collections/graded'],
      ['Sealed Products', '/collections/sealed'],
      ['Collections', '/collections/bundles'],
      ['New Arrivals', '/collections/new-arrivals'],
      ['The Vault', '/vault'],
    ],
  },
  {
    title: 'Shop by TCG',
    links: [
      ['Pokémon', '/collections/pokemon'],
      ['Riftbound', '/collections/riftbound'],
      ['One Piece', '/collections/one-piece'],
    ],
  },
  {
    title: 'Customer care',
    links: [
      ['My account', '/account'],
      ['Order history', '/account/orders'],
      ['Wishlist', '/wishlist'],
      ['Shipping & Returns', '/shipping-returns'],
      ['FAQ', '/faq'],
      ['Contact', '/contact'],
    ],
  },
  {
    title: 'Atlas',
    links: [
      ['About', '/about'],
      ['Sell to Us', '/sell'],
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto bg-navy text-ivory/85">
      <div className="gold-hairline" />
      <Container className="grid gap-10 py-12 md:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-ivory/70">
            Rare singles, graded relics and sealed treasures – hunted down, examined and shipped with care.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] !text-gold">{col.title}</h2>
            <ul className="mt-3 space-y-2 font-sans text-sm">
              {col.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-ivory/80 hover:text-white hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col items-start justify-between gap-4 py-5 font-sans text-xs text-ivory/65 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Atlas Cards. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li className="flex items-center gap-1.5"><Lock className="size-3.5" aria-hidden /> Secure payments</li>
            <li className="flex items-center gap-1.5"><PackageCheck className="size-3.5" aria-hidden /> Careful packaging</li>
            <li className="flex items-center gap-1.5"><Truck className="size-3.5" aria-hidden /> Tracked shipping</li>
            <li className="flex items-center gap-1.5"><BadgeCheck className="size-3.5" aria-hidden /> Authenticity guaranteed</li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
