'use client';

import { Eye, Heart, ShoppingCart } from 'lucide-react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { Product } from '@/lib/types';
import { useCart, useHydrated } from '@/store/cart';
import { useWishlist } from '@/store/preferences';
import { useToasts } from '@/store/toasts';

const QuickViewModal = dynamic(() => import('./QuickViewModal').then((m) => m.QuickViewModal), { ssr: false });

export function useAddToCart() {
  const add = useCart((s) => s.add);
  const push = useToasts((s) => s.push);
  return (product: Product, quantity = 1) => {
    const result = add(product, quantity);
    if (result === 'maxed') {
      push({ title: 'Maximum quantity in cart', description: `All available copies of ${product.name} are already in your cart.` });
      return;
    }
    push({ title: 'Added to cart', description: product.name, image: product.images[0], action: { label: 'View Cart', href: '/cart' } });
  };
}

export function WishlistButton({ product, className }: { product: Pick<Product, 'id' | 'name'>; className?: string }) {
  const hydrated = useHydrated();
  const active = useWishlist((s) => s.ids.includes(product.id)) && hydrated;
  const toggle = useWishlist((s) => s.toggle);
  const push = useToasts((s) => s.push);
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      onClick={() => {
        const on = toggle(product.id);
        push({ title: on ? 'Saved to wishlist' : 'Removed from wishlist', description: product.name, action: on ? { label: 'View Wishlist', href: '/wishlist' } : undefined });
      }}
      className={clsx(
        'grid size-9 place-items-center rounded-full border border-stone/70 bg-white/95 shadow-sm transition-colors hover:border-gold hover:text-danger',
        active ? 'text-danger' : 'text-navy/70',
        className,
      )}
    >
      <Heart className={clsx('size-[18px]', active && 'fill-current')} />
    </button>
  );
}

export function AddToCartButton({
  product,
  size = 'md',
  full = true,
  compact = false,
  variant = 'primary',
}: {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  full?: boolean;
  compact?: boolean;
  variant?: 'primary' | 'premium' | 'secondary';
}) {
  const addToCart = useAddToCart();
  const soldOut = product.availability === 'sold-out';
  return (
    <Button variant={soldOut ? 'secondary' : variant} size={size} full={full} disabled={soldOut} onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}>
      <ShoppingCart className="size-4" aria-hidden />
      {soldOut ? 'Sold out' : compact ? 'Add' : 'Add to Cart'}
    </Button>
  );
}

export function QuickViewButton({ product, className }: { product: Product; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Quick view ${product.name}`}
        className={clsx('grid size-9 place-items-center rounded-full border border-stone/70 bg-white/95 text-navy/70 shadow-sm hover:border-gold hover:text-navy', className)}
      >
        <Eye className="size-[18px]" />
      </button>
      {open && <QuickViewModal product={product} onClose={() => setOpen(false)} />}
    </>
  );
}
