'use client';

import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ProductImage } from '@/components/product/ProductImage';
import { ButtonLink } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { FREE_SHIPPING_THRESHOLD, formatPrice } from '@/lib/config';
import { cartSubtotal, useCart, useHydrated } from '@/store/cart';

export function FreeShippingBar({ subtotal }: { subtotal: number }) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div>
      <p className="font-sans text-sm text-ink">
        {remaining > 0 ? (
          <>
            You’re <strong className="text-navy">{formatPrice(remaining)}</strong> away from free shipping.
          </>
        ) : (
          <strong className="text-emerald">You’ve unlocked free shipping.</strong>
        )}
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone/60" role="progressbar" aria-valuemin={0} aria-valuemax={FREE_SHIPPING_THRESHOLD} aria-valuenow={Math.min(subtotal, FREE_SHIPPING_THRESHOLD)} aria-label="Progress to free shipping">
        <div className="h-full rounded-full bg-gradient-to-r from-arcane to-cyan transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function QuantityStepper({ value, max, onChange, label }: { value: number; max: number; onChange: (n: number) => void; label: string }) {
  const btn = 'grid size-8 place-items-center text-navy hover:bg-navy/5 disabled:opacity-40';
  return (
    <div className="inline-flex items-center rounded-lg border border-stone bg-white" role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} aria-label="Decrease quantity">
        <Minus className="size-4" />
      </button>
      <span className="w-8 text-center font-sans text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Increase quantity">
        <Plus className="size-4" />
      </button>
    </div>
  );
}

export function CartDrawer() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const { lines, drawerOpen, closeDrawer, setQuantity, remove } = useCart();
  const subtotal = cartSubtotal(lines);

  useEffect(() => closeDrawer(), [pathname, closeDrawer]);

  return (
    <Sheet open={drawerOpen} onClose={closeDrawer} label="Shopping cart" side="right" hideClose>
      <div className="flex items-center justify-between border-b border-stone/70 px-5 py-4">
        <h2 className="font-sans text-lg font-bold text-navy">Your cart {hydrated && lines.length > 0 && <span className="font-normal text-muted">({lines.reduce((n, l) => n + l.quantity, 0)})</span>}</h2>
        <button type="button" onClick={closeDrawer} className="rounded-lg px-3 py-1.5 font-sans text-sm font-semibold text-navy hover:bg-navy/5">
          Close
        </button>
      </div>

      {!hydrated || lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <ShoppingBag className="size-12 text-stone" aria-hidden />
          <p className="font-sans text-base font-semibold text-navy">Your cart is empty</p>
          <ButtonLink href="/shop" onClick={closeDrawer}>
            Shop all products
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className="border-b border-stone/70 bg-white px-5 py-4">
            <FreeShippingBar subtotal={subtotal} />
          </div>
          <ul className="flex-1 divide-y divide-stone/60 overflow-y-auto bg-white px-5">
            {lines.map((l) => (
              <li key={l.productId} className="flex gap-3 py-4">
                <Link href={`/products/${l.slug}`} onClick={closeDrawer} className="relative h-24 w-[72px] shrink-0 overflow-hidden rounded-lg border border-stone/60 bg-parchment/50">
                  <ProductImage src={l.image} alt={l.name} sizes="72px" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col font-sans">
                  <Link href={`/products/${l.slug}`} onClick={closeDrawer} className="line-clamp-2 text-sm font-semibold text-ink hover:text-arcane">
                    {l.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted">{l.grade ? [l.gradingCompany, l.grade].filter(Boolean).join(' ') : l.condition}</p>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <QuantityStepper value={l.quantity} max={l.maxQuantity} label={l.name} onChange={(n) => setQuantity(l.productId, n)} />
                    <span className="text-sm font-bold tabular-nums text-navy">{formatPrice(l.price * l.quantity)}</span>
                  </div>
                </div>
                <button type="button" onClick={() => remove(l.productId)} aria-label={`Remove ${l.name}`} className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-danger/10 hover:text-danger">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          <div className="space-y-3 border-t border-stone/70 bg-ivory px-5 py-4">
            <div className="flex items-baseline justify-between font-sans">
              <span className="text-sm font-semibold text-ink">Subtotal</span>
              <span className="text-xl font-bold tabular-nums text-navy">{formatPrice(subtotal)}</span>
            </div>
            <p className="font-sans text-xs text-muted">Shipping and taxes calculated at checkout.</p>
            <ButtonLink href="/checkout" size="lg" full onClick={closeDrawer}>
              Checkout
            </ButtonLink>
            <ButtonLink href="/cart" variant="secondary" full onClick={closeDrawer}>
              View Cart
            </ButtonLink>
          </div>
        </>
      )}
    </Sheet>
  );
}
