'use client';

import { ImagePlus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';

const input = 'h-11 w-full rounded-lg border border-stone bg-white px-3 font-sans text-sm text-ink focus:border-arcane';
const TCGS = ['Pokémon', 'Riftbound', 'One Piece', 'Magic: The Gathering', 'Other'];

/** Shared by Contact and Sell to Us. Posts multipart form data to /api/inquiries. */
export function InquiryForm({ type }: { type: 'sell' | 'contact' }) {
  const [state, setState] = useState<{ kind: 'idle' | 'sending' | 'done' | 'error'; text?: string }>({ kind: 'idle' });
  const [files, setFiles] = useState<File[]>([]);
  const sell = type === 'sell';

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ kind: 'sending' });
    const data = new FormData(e.currentTarget);
    data.set('type', type);
    data.delete('images');
    files.forEach((f) => data.append('images', f));
    try {
      const res = await fetch('/api/inquiries', { method: 'POST', body: data });
      const json = (await res.json()) as { message?: string };
      setState({ kind: res.ok ? 'done' : 'error', text: json.message ?? (res.ok ? 'Thank you!' : 'Something went wrong.') });
    } catch {
      setState({ kind: 'error', text: 'Could not reach the server. Please try again.' });
    }
  };

  const label = 'mb-1 block font-sans text-sm font-semibold text-navy';

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-stone/70 bg-white p-6 shadow-card sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${type}-name`} className={label}>
            Name
          </label>
          <input id={`${type}-name`} name="name" required autoComplete="name" className={input} />
        </div>
        <div>
          <label htmlFor={`${type}-email`} className={label}>
            Email
          </label>
          <input id={`${type}-email`} name="email" type="email" required autoComplete="email" className={input} />
        </div>
      </div>

      {sell && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sell-tcg" className={label}>
              TCG
            </label>
            <select id="sell-tcg" name="tcg" className={input}>
              {TCGS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sell-value" className={label}>
              Estimated value (€)
            </label>
            <input id="sell-value" name="estimatedValue" inputMode="decimal" className={input} />
          </div>
        </div>
      )}

      <div>
        <label htmlFor={`${type}-message`} className={label}>
          {sell ? 'Card / collection description' : 'Message'}
        </label>
        <textarea id={`${type}-message`} name="message" required rows={5} className="w-full rounded-lg border border-stone bg-white p-3 font-sans text-sm text-ink focus:border-arcane" />
      </div>

      {sell && (
        <>
          <div>
            <span className={label}>Upload images (up to 6)</span>
            <label htmlFor="sell-images" className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-stone bg-ivory p-4 font-sans text-sm text-muted hover:border-gold">
              <ImagePlus className="size-5 text-arcane" aria-hidden />
              {files.length ? `${files.length} image${files.length === 1 ? '' : 's'} selected` : 'Choose photos of your cards or collection'}
            </label>
            <input id="sell-images" name="images" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 6))} />
          </div>
          <div>
            <label htmlFor="sell-notes" className={label}>
              Additional notes
            </label>
            <textarea id="sell-notes" name="notes" rows={3} className="w-full rounded-lg border border-stone bg-white p-3 font-sans text-sm text-ink focus:border-arcane" />
          </div>
        </>
      )}

      {state.kind === 'done' && (
        <p role="status" className="rounded-lg bg-emerald/10 p-3 font-sans text-sm text-emerald">
          {state.text}
        </p>
      )}
      {state.kind === 'error' && (
        <p role="alert" className="rounded-lg border border-amber-300 bg-amber-50 p-3 font-sans text-sm text-amber-900">
          {state.text}
        </p>
      )}

      <Button type="submit" size="lg" variant={sell ? 'premium' : 'primary'} disabled={state.kind === 'sending'}>
        {state.kind === 'sending' ? 'Sending…' : sell ? 'Submit Collection' : 'Send message'}
      </Button>
    </form>
  );
}
