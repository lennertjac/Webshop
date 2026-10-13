'use client';

import clsx from 'clsx';
import { Check, Lock } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { ProductImage } from '@/components/product/ProductImage';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/primitives';
import { useAuth } from '@/lib/auth-context';
import { INSURED_SHIPPING_EXTRA, PAYMENT_METHODS, formatPrice, shippingFor } from '@/lib/config';
import { cartSubtotal, useCart, useHydrated } from '@/store/cart';

const STEPS = ['Information', 'Shipping', 'Payment', 'Review'] as const;
const COUNTRIES = ['Belgium', 'Netherlands', 'Germany', 'France', 'Luxembourg', 'United Kingdom', 'United States', 'Other'];

interface Form {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  shippingMethod: 'standard' | 'insured';
  paymentMethod: string;
}

const input = 'h-11 w-full rounded-lg border border-stone bg-white px-3 font-sans text-sm text-ink focus:border-arcane';

function Field({ id, label, children, className }: { id: string; label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block font-sans text-sm font-semibold text-navy">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CheckoutPage() {
  const hydrated = useHydrated();
  const { user } = useAuth();
  const lines = useCart((s) => s.lines);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Form>({ email: '', firstName: '', lastName: '', address: '', city: '', postalCode: '', country: 'Belgium', phone: '', shippingMethod: 'standard', paymentMethod: PAYMENT_METHODS[0] });

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({ ...f, email: f.email || user.email, firstName: f.firstName || user.firstName, lastName: f.lastName || user.lastName, address: f.address || user.address, city: f.city || user.city, postalCode: f.postalCode || user.postalCode, country: f.country === 'Belgium' && user.country ? user.country : f.country, phone: f.phone || user.phone || '' }));
  }, [user]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));
  const subtotal = cartSubtotal(lines);
  const baseShipping = shippingFor(subtotal);
  const shipping = baseShipping + (form.shippingMethod === 'insured' ? INSURED_SHIPPING_EXTRA : 0);
  const total = subtotal + shipping;

  if (!hydrated) return <Container className="py-16 text-center font-sans text-muted">Loading…</Container>;
  if (!lines.length) {
    return (
      <Container className="flex flex-col items-center gap-4 py-20 text-center">
        <h1 className="font-serif text-4xl font-bold">Nothing to check out</h1>
        <ButtonLink href="/shop">Shop all products</ButtonLink>
      </Container>
    );
  }

  const next = (e: FormEvent) => {
    e.preventDefault();
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const placeOrder = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })), customer: form }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      setError(data.message ?? data.error ?? 'Something went wrong. Please try again.');
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory">
      <Container className="py-6 sm:py-10">
        <p className="mb-6 flex items-center gap-1.5 font-sans text-xs text-muted">
          <Lock className="size-4 text-emerald" aria-hidden /> Secure checkout
        </p>

        <ol className="mb-8 flex items-center gap-2 font-sans text-sm" aria-label="Checkout progress">
          {STEPS.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2" aria-current={i === step ? 'step' : undefined}>
              <span className={clsx('grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold', i < step ? 'bg-emerald text-white' : i === step ? 'bg-navy text-white' : 'bg-stone/60 text-muted')}>
                {i < step ? <Check className="size-4" aria-hidden /> : i + 1}
              </span>
              <span className={clsx('hidden font-semibold sm:inline', i === step ? 'text-navy' : 'text-muted')}>{s}</span>
              {i < STEPS.length - 1 && <span className="h-px flex-1 bg-stone" aria-hidden />}
            </li>
          ))}
        </ol>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="rounded-2xl border border-stone/70 bg-white p-5 shadow-card sm:p-7">
            {step === 0 && (
              <form onSubmit={next} className="space-y-4">
                <h1 className="font-sans text-xl font-bold text-navy">Information</h1>
                {!user && (
                  <p className="font-sans text-sm text-muted">
                    Have an account?{' '}
                    <Link href="/login" className="font-semibold text-arcane hover:underline">
                      Log in
                    </Link>
                  </p>
                )}
                <Field id="email" label="Email">
                  <input id="email" type="email" required autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={input} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="firstName" label="First name">
                    <input id="firstName" required autoComplete="given-name" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className={input} />
                  </Field>
                  <Field id="lastName" label="Last name">
                    <input id="lastName" required autoComplete="family-name" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className={input} />
                  </Field>
                </div>
                <Field id="address" label="Address">
                  <input id="address" required autoComplete="street-address" value={form.address} onChange={(e) => set('address', e.target.value)} className={input} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field id="postalCode" label="Postal code">
                    <input id="postalCode" required autoComplete="postal-code" value={form.postalCode} onChange={(e) => set('postalCode', e.target.value)} className={input} />
                  </Field>
                  <Field id="city" label="City" className="sm:col-span-2">
                    <input id="city" required autoComplete="address-level2" value={form.city} onChange={(e) => set('city', e.target.value)} className={input} />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="country" label="Country">
                    <select id="country" value={form.country} onChange={(e) => set('country', e.target.value)} className={input}>
                      {COUNTRIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field id="phone" label="Phone (optional)">
                    <input id="phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} className={input} />
                  </Field>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <Link href="/cart" className="font-sans text-sm font-semibold text-arcane hover:underline">
                    ← Return to cart
                  </Link>
                  <Button type="submit" size="lg">
                    Continue to shipping
                  </Button>
                </div>
              </form>
            )}

            {step === 1 && (
              <form onSubmit={next} className="space-y-4">
                <h1 className="font-sans text-xl font-bold text-navy">Shipping method</h1>
                <p className="font-sans text-sm text-muted">
                  Shipping to {form.address}, {form.postalCode} {form.city}, {form.country}
                </p>
                <fieldset className="space-y-3">
                  <legend className="sr-only">Shipping method</legend>
                  {([
                    ['standard', 'Tracked shipping', 'Delivery in 2–5 business days (EU)', baseShipping],
                    ['insured', 'Tracked & insured shipping', 'Recommended for higher-value orders', baseShipping + INSURED_SHIPPING_EXTRA],
                  ] as const).map(([value, label, hint, price]) => (
                    <label key={value} className={clsx('flex cursor-pointer items-center gap-3 rounded-xl border p-4 font-sans', form.shippingMethod === value ? 'border-arcane bg-arcane/5' : 'border-stone')}>
                      <input type="radio" name="shipping" value={value} checked={form.shippingMethod === value} onChange={() => set('shippingMethod', value)} className="size-4 accent-[#4778D0]" />
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-navy">{label}</span>
                        <span className="block text-xs text-muted">{hint}</span>
                      </span>
                      <span className="text-sm font-bold tabular-nums text-navy">{price === 0 ? 'Free' : formatPrice(price)}</span>
                    </label>
                  ))}
                </fieldset>
                <div className="flex items-center justify-between pt-2">
                  <button type="button" onClick={() => setStep(0)} className="font-sans text-sm font-semibold text-arcane hover:underline">
                    ← Back
                  </button>
                  <Button type="submit" size="lg">
                    Continue to payment
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={next} className="space-y-4">
                <h1 className="font-sans text-xl font-bold text-navy">Payment</h1>
                <p className="font-sans text-sm text-muted">You will be redirected to our secure payment provider to complete your payment. We never see or store your card details.</p>
                <fieldset className="space-y-3">
                  <legend className="sr-only">Payment method</legend>
                  {PAYMENT_METHODS.map((m) => (
                    <label key={m} className={clsx('flex cursor-pointer items-center gap-3 rounded-xl border p-4 font-sans text-sm font-semibold text-navy', form.paymentMethod === m ? 'border-arcane bg-arcane/5' : 'border-stone')}>
                      <input type="radio" name="payment" value={m} checked={form.paymentMethod === m} onChange={() => set('paymentMethod', m)} className="size-4 accent-[#4778D0]" />
                      {m}
                    </label>
                  ))}
                </fieldset>
                <div className="flex items-center justify-between pt-2">
                  <button type="button" onClick={() => setStep(1)} className="font-sans text-sm font-semibold text-arcane hover:underline">
                    ← Back
                  </button>
                  <Button type="submit" size="lg">
                    Review order
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h1 className="font-sans text-xl font-bold text-navy">Review your order</h1>
                <dl className="divide-y divide-stone/60 rounded-xl border border-stone/70 font-sans text-sm">
                  {([
                    ['Contact', form.email, 0],
                    ['Ship to', `${form.firstName} ${form.lastName}, ${form.address}, ${form.postalCode} ${form.city}, ${form.country}`, 0],
                    ['Shipping', form.shippingMethod === 'insured' ? 'Tracked & insured shipping' : 'Tracked shipping', 1],
                    ['Payment', form.paymentMethod, 2],
                  ] as const).map(([k, v, s]) => (
                    <div key={k} className="flex items-start justify-between gap-4 p-3.5">
                      <dt className="w-20 shrink-0 text-muted">{k}</dt>
                      <dd className="flex-1 text-ink">{v}</dd>
                      <button type="button" onClick={() => setStep(s)} className="text-xs font-semibold text-arcane hover:underline">
                        Change
                      </button>
                    </div>
                  ))}
                </dl>
                {error && (
                  <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-3 font-sans text-sm text-amber-900">
                    {error}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <button type="button" onClick={() => setStep(2)} className="font-sans text-sm font-semibold text-arcane hover:underline">
                    ← Back
                  </button>
                  <Button size="lg" onClick={placeOrder} disabled={submitting}>
                    {submitting ? 'Placing order…' : `Place order · ${formatPrice(total)}`}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <aside aria-label="Order summary" className="h-fit rounded-2xl border border-stone/70 bg-parchment/40 p-5 lg:sticky lg:top-24">
            <h2 className="font-sans text-base font-bold text-navy">Order summary</h2>
            <ul className="mt-4 space-y-3">
              {lines.map((l) => (
                <li key={l.productId} className="flex items-center gap-3 font-sans text-sm">
                  <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded border border-stone/60 bg-white">
                    <ProductImage src={l.image} alt="" sizes="48px" />
                    <span className="absolute -right-0 -top-0 grid size-5 place-items-center rounded-bl bg-navy text-[11px] font-bold text-white">{l.quantity}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="line-clamp-2 font-semibold text-ink">{l.name}</span>
                    <span className="text-xs text-muted">{l.grade ? [l.gradingCompany, l.grade].filter(Boolean).join(' ') : l.condition}</span>
                  </span>
                  <span className="font-semibold tabular-nums">{formatPrice(l.price * l.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-stone/60 pt-4 font-sans text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd className="tabular-nums">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-stone/60 pt-3 text-base">
                <dt className="font-bold text-navy">Total</dt>
                <dd className="text-xl font-bold tabular-nums text-navy">{formatPrice(total)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </Container>
    </div>
  );
}
