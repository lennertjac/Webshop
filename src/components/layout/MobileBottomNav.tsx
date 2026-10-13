'use client';

import clsx from 'clsx';
import { Heart, Home, Search, ShoppingCart, Store } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cartCount, useCart, useHydrated } from '@/store/cart';
import { useWishlist } from '@/store/preferences';

/** Mobile-only quick navigation. Search opens the dedicated search page for a reliable full-screen view. */
export function MobileBottomNav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const count = useCart((s) => cartCount(s.lines));
  const openCart = useCart((s) => s.openDrawer);
  const wishes = useWishlist((s) => s.ids.length);

  if (pathname.startsWith('/checkout')) return null;

  const items = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/shop', label: 'Shop', icon: Store },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/wishlist', label: 'Wishlist', icon: Heart, badge: hydrated ? wishes : 0 },
  ];

  const base = 'relative flex flex-1 flex-col items-center gap-0.5 py-2 font-sans text-[11px] font-semibold';
  return (
    <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gold/40 bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      {items.map(({ href, label, icon: Icon, badge }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={clsx(base, active ? 'text-arcane' : 'text-navy/70')}>
            <span className="relative">
              <Icon className="size-5" aria-hidden />
              {!!badge && <span className="absolute -right-2 -top-1.5 grid min-w-4 place-items-center rounded-full bg-arcane px-1 text-[10px] leading-4 text-white">{badge}</span>}
            </span>
            {label}
          </Link>
        );
      })}
      <button type="button" onClick={openCart} className={clsx(base, 'text-navy/70')}>
        <span className="relative">
          <ShoppingCart className="size-5" aria-hidden />
          {hydrated && count > 0 && <span className="absolute -right-2 -top-1.5 grid min-w-4 place-items-center rounded-full bg-arcane px-1 text-[10px] leading-4 text-white">{count}</span>}
        </span>
        Cart
      </button>
    </nav>
  );
}
