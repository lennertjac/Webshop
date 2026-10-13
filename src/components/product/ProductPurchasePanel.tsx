'use client';

import { BadgeCheck, CreditCard, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { QuantityStepper } from '@/components/layout/CartDrawer';
import { Button } from '@/components/ui/Button';
import { PAYMENT_METHODS } from '@/lib/config';
import type { Product } from '@/lib/types';
import { useCart } from '@/store/cart';
import { useAddToCart, WishlistButton } from './ProductActions';

export function ProductPurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const addToCart = useAddToCart();
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const soldOut = product.availability === 'sold-out';

  return (
    <div className="space-y-5">
      {!soldOut && (
        <div className="flex items-center gap-3">
          <span className="font-sans text-sm font-semibold text-navy">Quantity</span>
          <QuantityStepper value={qty} max={product.stock} onChange={(n) => setQty(Math.max(1, Math.min(n, product.stock)))} label={product.name} />
        </div>
      )}

      <div className="flex gap-2">
        <Button size="lg" full disabled={soldOut} onClick={() => addToCart(product, qty)}>
          {soldOut ? 'Sold out' : 'Add to Cart'}
        </Button>
        <Button
          size="lg"
          full
          variant="premium"
          disabled={soldOut}
          onClick={() => {
            add(product, qty);
            router.push('/checkout');
          }}
        >
          Buy Now
        </Button>
        <WishlistButton product={product} className="size-12 shrink-0" />
      </div>

      <ul className="grid gap-3 rounded-xl border border-stone/70 bg-white p-4 font-sans text-sm text-ink">
        <li className="flex items-start gap-3">
          <Truck className="mt-0.5 size-5 shrink-0 text-arcane" aria-hidden />
          <span>
            <strong className="block text-navy">Shipping estimate</strong>
            Ships within 1–2 business days. Delivery in 2–5 days across the EU, 5–10 days worldwide.
          </span>
        </li>
        <li className="flex items-start gap-3">
          <CreditCard className="mt-0.5 size-5 shrink-0 text-arcane" aria-hidden />
          <span>
            <strong className="block text-navy">Payment methods</strong>
            <span className="mt-1 flex flex-wrap gap-1.5">
              {PAYMENT_METHODS.map((m) => (
                <span key={m} className="rounded border border-stone bg-ivory px-2 py-0.5 text-xs font-semibold text-navy">
                  {m}
                </span>
              ))}
            </span>
          </span>
        </li>
      </ul>

      <ul className="grid gap-2 font-sans text-sm text-ink sm:grid-cols-3 sm:gap-3">
        {[
          [BadgeCheck, 'Authenticity Guaranteed'],
          [PackageCheck, 'Secure Packaging'],
          [ShieldCheck, 'Insured Shipping Available'],
        ].map(([Icon, label]) => {
          const I = Icon as typeof BadgeCheck;
          return (
            <li key={label as string} className="flex items-center gap-2 rounded-lg bg-emerald/10 px-3 py-2 text-xs font-semibold text-emerald sm:flex-col sm:text-center">
              <I className="size-5 shrink-0" aria-hidden />
              {label as string}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
