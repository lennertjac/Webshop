'use client';

import clsx from 'clsx';
import { useState, type FormEvent } from 'react';
import { Avatar } from '@/components/team/ContactPersonCard';
import { Button } from '@/components/ui/Button';
import { REPLY_TIME, formatPrice } from '@/lib/config';
import { TEAM } from '@/lib/team';

const input = 'h-11 w-full rounded-lg border border-stone bg-white px-3 font-sans text-sm text-ink focus:border-arcane';
const label = 'mb-1 block font-sans text-sm font-semibold text-navy';

interface Props {
  product: { id: string; name: string; slug: string; price: number };
  initialMode: 'buy' | 'offer';
}

export function RequestForm({ product, initialMode }: Props) {
  const [mode, setMode] = useState(initialMode);
  const [contact, setContact] = useState(TEAM[0].id);
  const [state, setState] = useState<{ kind: 'idle' | 'sending' | 'done' | 'error'; text?: string }>({ kind: 'idle' });
  const person = TEAM.find((m) => m.id === contact) ?? TEAM[0];

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ kind: 'sending' });
    const data = new FormData(e.currentTarget);
    data.set('type', 'request');
    data.set('mode', mode);
    data.set('contact', contact);
    data.set('productId', product.id);
    data.set('productName', product.name);
    data.set('productPrice', String(product.price));
    data.set('productUrl', `${window.location.origin}/products/${product.slug}`);
    try {
      const res = await fetch('/api/inquiries', { method: 'POST', body: data });
      const json = (await res.json()) as { message?: string };
      setState({ kind: res.ok ? 'done' : 'error', text: json.message ?? (res.ok ? 'Thank you!' : 'Something went wrong.') });
    } catch {
      setState({ kind: 'error', text: 'Could not reach the server. Please try again.' });
    }
  };

  if (state.kind === 'done') {
    return (
      <div className="rounded-2xl border border-emerald/40 bg-white p-7 shadow-card" role="status">
        <Avatar member={person} size={64} />
        <h2 className="mt-4 font-serif text-3xl font-bold">Request sent</h2>
        <p className="mt-2 font-sans text-sm text-ink/85">
          {state.text} {person.name} will reply {REPLY_TIME}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-stone/70 bg-white p-6 shadow-card sm:p-8">
      <fieldset>
        <legend className="mb-2 font-sans text-sm font-bold text-navy">Who would you like to speak with?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {TEAM.map((m) => (
            <label
              key={m.id}
              className={clsx('flex cursor-pointer items-start gap-3 rounded-xl border p-3 font-sans transition-colors', contact === m.id ? 'border-arcane bg-arcane/5 ring-1 ring-arcane' : 'border-stone hover:border-gold')}
            >
              <input type="radio" name="contact-person" value={m.id} checked={contact === m.id} onChange={() => setContact(m.id)} className="sr-only" />
              <Avatar member={m} size={48} />
              <span>
                <span className="block text-sm font-bold text-navy">{m.name}</span>
                <span className="block text-xs text-gold-dark">{m.role}</span>
                <span className="mt-1 block text-xs leading-snug text-muted">{m.bio}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="inline-flex rounded-lg border border-stone p-1" role="group" aria-label="Type of request">
        {(['buy', 'offer'] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={clsx('rounded-md px-4 py-2 font-sans text-sm font-semibold', mode === m ? 'bg-navy text-white' : 'text-navy hover:bg-navy/5')}
          >
            {m === 'buy' ? `Buy at ${formatPrice(product.price)}` : 'Make an offer'}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rtb-name" className={label}>
            Your name
          </label>
          <input id="rtb-name" name="name" required autoComplete="name" className={input} />
        </div>
        <div>
          <label htmlFor="rtb-email" className={label}>
            Email
          </label>
          <input id="rtb-email" name="email" type="email" required autoComplete="email" className={input} />
        </div>
      </div>

      {mode === 'offer' && (
        <div>
          <label htmlFor="rtb-offer" className={label}>
            Your offer (€)
          </label>
          <input id="rtb-offer" name="offerAmount" inputMode="decimal" required className={input} placeholder={String(Math.round(product.price * 0.9))} />
        </div>
      )}

      <div>
        <label htmlFor="rtb-message" className={label}>
          Message {mode === 'buy' && <span className="font-normal text-muted">(optional)</span>}
        </label>
        <textarea
          id="rtb-message"
          name="message"
          required={mode === 'offer'}
          rows={4}
          className="w-full rounded-lg border border-stone bg-white p-3 font-sans text-sm text-ink focus:border-arcane"
          placeholder={mode === 'buy' ? 'Anything we should know – shipping country, payment preference, questions about the card…' : 'Tell us a little about your offer.'}
        />
      </div>

      <p className="font-sans text-xs text-muted">Nothing is charged now. {person.name} will confirm the price and send secure payment details.</p>

      {state.kind === 'error' && (
        <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-3 font-sans text-sm text-amber-900">
          {state.text}
        </p>
      )}

      <Button type="submit" size="lg" full disabled={state.kind === 'sending'}>
        {state.kind === 'sending' ? 'Sending…' : mode === 'offer' ? `Send offer to ${person.name}` : `Send request to ${person.name}`}
      </Button>
    </form>
  );
}
