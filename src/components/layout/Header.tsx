'use client';

import clsx from 'clsx';
import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AtlasMark } from '@/components/product/ProductImage';
import { Sheet } from '@/components/ui/Sheet';
import { useAuth } from '@/lib/auth-context';
import { COLLECTIONS, NAV_LINKS } from '@/lib/collections';
import { cartCount, useCart, useHydrated } from '@/store/cart';
import { useWishlist } from '@/store/preferences';
import { SearchPanel } from './SearchPanel';

export function Logo({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  return (
    <Link href="/" aria-label="Atlas Cards – home" className={clsx('flex items-center gap-2.5', className)}>
      <AtlasMark className="size-9" />
      <span className="leading-none">
        <span className={clsx('block font-serif text-2xl font-bold tracking-[0.14em]', tone === 'dark' ? 'text-navy' : 'text-ivory')}>ATLAS</span>
        <span className={clsx('block font-sans text-[9px] font-semibold uppercase tracking-[0.28em]', tone === 'dark' ? 'text-gold-dark' : 'text-gold')}>Cards &amp; Collectibles</span>
      </span>
    </Link>
  );
}

function CountBadge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-arcane px-1 font-sans text-[11px] font-bold leading-5 text-white ring-2 ring-ivory" aria-hidden>
      {n > 99 ? '99+' : n}
    </span>
  );
}

const iconBtn = 'relative grid size-11 place-items-center rounded-full text-navy transition-colors hover:bg-navy/5';

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const { user } = useAuth();
  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.openDrawer);
  const wishlistCount = useWishlist((s) => s.ids.length);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable;
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const count = hydrated ? cartCount(lines) : 0;
  const wishes = hydrated ? wishlistCount : 0;

  return (
    <header className={clsx('sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-200', scrolled ? 'border-gold/40 bg-ivory/90 shadow-sm backdrop-blur-md' : 'border-stone/60 bg-ivory')}>
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-2 px-3 sm:px-6 lg:h-[72px] lg:gap-6 lg:px-8">
        <button type="button" className={clsx(iconBtn, 'lg:hidden')} onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <Menu className="size-6" />
        </button>

        <Logo className="max-lg:mx-auto lg:mr-2" />

        <nav aria-label="Main" className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-1 xl:gap-2">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href || (l.href !== '/shop' && pathname.startsWith(`${l.href}/`));
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={active ? 'page' : undefined}
                    className={clsx(
                      'relative rounded-md px-3 py-2 font-sans text-sm font-semibold text-navy/85 transition-colors hover:text-arcane',
                      l.label === 'The Vault' && 'text-gold-dark hover:text-gold-dark',
                      active && 'text-arcane after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded after:bg-gold',
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

          <div className="ml-auto flex items-center gap-0.5 lg:ml-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="mr-2 hidden h-11 w-56 items-center gap-2 rounded-full border border-stone bg-white/80 px-4 font-sans text-sm text-muted hover:border-gold xl:flex"
              aria-label="Search cards, sets, products"
            >
              <Search className="size-4 text-arcane" aria-hidden />
              <span className="flex-1 text-left">Search…</span>
              <kbd className="rounded border border-stone px-1.5 text-[11px]">/</kbd>
            </button>
            <button type="button" onClick={() => setSearchOpen(true)} className={clsx(iconBtn, 'xl:hidden')} aria-label="Search">
              <Search className="size-[22px]" />
            </button>
            <Link href="/wishlist" className={clsx(iconBtn, 'max-sm:hidden')} aria-label={`Wishlist${wishes ? `, ${wishes} items` : ''}`}>
              <Heart className="size-[22px]" />
              <CountBadge n={wishes} />
            </Link>
            <Link href={user ? '/account' : '/login'} className={clsx(iconBtn, 'max-sm:hidden')} aria-label={user ? 'My account' : 'Log in'}>
              <User className="size-[22px]" />
            </Link>
            <button type="button" onClick={openCart} className={iconBtn} aria-label={`Open cart${count ? `, ${count} items` : ''}`}>
              <ShoppingCart className="size-[22px]" />
              <CountBadge n={count} />
            </button>
          </div>
        </div>
        <div className="gold-hairline opacity-60" aria-hidden />

        <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />

        <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} label="Menu" side="left" hideClose>
          <div className="flex items-center justify-between border-b border-stone/70 p-4">
            <Logo />
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu" className={iconBtn}>
              <X className="size-6" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 font-sans text-base font-semibold text-navy hover:bg-navy/5">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mb-2 mt-6 px-3 font-sans text-xs font-semibold uppercase tracking-wider text-muted">Shop by TCG</p>
            <ul className="space-y-1">
              {COLLECTIONS.filter((c) => ['pokemon', 'riftbound', 'one-piece', 'magic-the-gathering', 'other-tcgs'].includes(c.slug)).map((c) => (
                <li key={c.slug}>
                  <Link href={`/collections/${c.slug}`} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2.5 font-sans text-sm text-ink hover:bg-navy/5">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-2 border-t border-stone/70 pt-4 font-sans text-sm">
              <Link href={user ? '/account' : '/login'} onClick={() => setMenuOpen(false)} className="rounded-lg border border-stone bg-white px-3 py-2.5 text-center font-semibold text-navy">
                {user ? 'My account' : 'Log in'}
              </Link>
              <Link href="/sell" onClick={() => setMenuOpen(false)} className="rounded-lg border border-gold bg-white px-3 py-2.5 text-center font-semibold text-navy">
                Sell to Us
              </Link>
            </div>
          </nav>
        </Sheet>
    </header>
  );
}
