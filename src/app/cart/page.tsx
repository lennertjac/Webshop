'use client';

import { ShieldCheck, ShoppingBag, Trash2, Truck, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { FreeShippingBar, QuantityStepper } from '@/components/layout/CartDrawer';
import { ProductImage } from '@/components/product/ProductImage';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/primitives';
import { formatPrice, shippingFor } from '@/lib/config';
import { cartSubtotal, useCart, useHydrated } from '@/store/cart';

export default function CartPage() {
  const hydrated = useHydrated();
  const { lines, setQuantity, remove } = useCart();
  const [code, setCode] = useState('');
  const [codeMessage, setCodeMessage] = useState<string | null>(null);
  const subtotal = cartSubtotal(lines);
  const shipping = shippingFor(subtotal);

  if (!hydrated) return <Container className="py-16 text-center font-sans text-muted">Loading cart…</Container>;

  if (!lines.length) {
    return (
      <Container className="flex flex-col items-center gap-4 py-20 text-center">
        <ShoppingBag className="size-14 text-stone" aria-hidden />
        <h1 className="font-serif text-4xl font-bold">Your cart is empty</h1>
        <p className="font-sans text-muted">Your satchel is empty. Add a card and it will appear here.</p>
        <ButtonLink href="/shop" size="lg">
          Shop all products
        </ButtonLink>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <h1 className="font-serif text-4xl font-bold">Shopping cart</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="mb-4 rounded-xl border border-stone/70 bg-white p-4">
            <FreeShippingBar subtotal={subtotal} />
          </div>
          <ul className="divide-y divide-stone/60 overflow-hidden rounded-2xl border border-stone/70 bg-white shadow-card">
            {lines.map((l) => (
              <li key={l.productId} className="flex gap-4 p-4">
                <Link href={`/products/${l.slug}`} className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg border border-stone/60 bg-parchment/50">
                  <ProductImage src={l.image} alt={l.name} sizes="80px" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col font-sans">
                  <Link href={`/products/${l.slug}`} className="line-clamp-2 font-semibold text-ink hover:text-arcane">
                    {l.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted">{l.grade ? [l.gradingCompany, l.grade].filter(Boolean).join(' ') : l.condition}</p>
                  <p className="mt-1 text-sm text-muted">{formatPrice(l.price)} each</p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <QuantityStepper value={l.quantity} max={l.maxQuantity} label={l.name} onChange={(n) => setQuantity(l.productId, n)} />
                    <div className="flex items-center gap-3">
                      <span className="font-bold tabular-nums text-navy">{formatPrice(l.price * l.quantity)}</span>
                      <button type="button" onClick={() => remove(l.productId)} aria-label={`Remove ${l.name}`} className="grid size-8 place-items-center rounded-full text-muted hover:bg-danger/10 hover:text-danger">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/shop" className="mt-4 inline-block font-sans text-sm font-semibold text-arcane hover:underline">
            ← Continue shopping
          </Link>
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border border-stone/70 bg-white p-5 shadow-card lg:sticky lg:top-24" aria-label="Order summary">
          <h2 className="font-sans text-lg font-bold text-navy">Order summary</h2>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              setCodeMessage(code.trim() ? 'Discount codes are applied and verified at checkout.' : null);
            }}
          >
            <label htmlFor="discount" className="sr-only">
              Discount code
            </label>
            <input id="discount" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Discount code" className="h-11 min-w-0 flex-1 rounded-lg border border-stone bg-ivory px-3 font-sans text-sm" />
            <Button type="submit" variant="secondary">
              Apply
            </Button>
          </form>
          {codeMessage && <p className="font-sans text-xs text-muted">{codeMessage}</p>}
          <dl className="space-y-2 border-t border-stone/60 pt-4 font-sans text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping estimate</dt>
              <dd className="font-semibold tabular-nums">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-stone/60 pt-3 text-base">
              <dt className="font-bold text-navy">Total</dt>
              <dd className="text-xl font-bold tabular-nums text-navy">{formatPrice(subtotal + shipping)}</dd>
            </div>
          </dl>
          <ButtonLink href="/checkout" size="lg" full>
            Checkout
          </ButtonLink>
          <ul className="space-y-2 font-sans text-xs text-muted">
            <li className="flex items-center gap-2"><Lock className="size-4 text-emerald" aria-hidden /> Secure checkout</li>
            <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-emerald" aria-hidden /> Authenticity guaranteed</li>
            <li className="flex items-center gap-2"><Truck className="size-4 text-emerald" aria-hidden /> Tracked shipping</li>
          </ul>
        </aside>
      </div>
    </Container>
  );
}
