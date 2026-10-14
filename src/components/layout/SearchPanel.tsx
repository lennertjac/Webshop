'use client';

import { Clock, Search, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ProductImage } from '@/components/product/ProductImage';
import { GradeBadge } from '@/components/product/ProductSpecs';
import { Sheet } from '@/components/ui/Sheet';
import { StockStatus } from '@/components/ui/primitives';
import { COLLECTIONS } from '@/lib/collections';
import { formatPrice } from '@/lib/config';
import type { Product } from '@/lib/types';
import { useRecent } from '@/store/preferences';

const SUGGESTED = ['graded', 'sealed', 'bundles', 'new-arrivals', 'riftbound', 'pokemon'];

export function SearchPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { searches, addSearch, clearSearches } = useRecent();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    const q = query.trim();
    abort.current?.abort();
    if (q.length < 2) {
      setResults([]);
      setTotal(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    abort.current = controller;
    const t = setTimeout(() => {
      fetch(`/api/products?q=${encodeURIComponent(q)}&limit=6`, { signal: controller.signal })
        .then((r) => r.json())
        .then((d: { products: Product[]; total: number }) => {
          setResults(d.products);
          setTotal(d.total);
          setLoading(false);
        })
        .catch((e) => e.name !== 'AbortError' && setLoading(false));
    }, 200);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  const submit = (term: string) => {
    const q = term.trim();
    if (!q) return;
    addSearch(q);
    onClose();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const trimmed = query.trim();
  const suggested = SUGGESTED.map((s) => COLLECTIONS.find((c) => c.slug === s)!).filter(Boolean);

  return (
    <Sheet open={open} onClose={onClose} label="Search" side="top" hideClose className="bg-ivory">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
        className="border-b border-stone/70 bg-white px-4 py-4 sm:px-8"
      >
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <Search className="size-6 shrink-0 text-arcane" aria-hidden />
          <label htmlFor="site-search" className="sr-only">
            Search cards, sets, products
          </label>
          <input
            id="site-search"
            data-autofocus
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cards, sets, products..."
            className="h-12 w-full bg-transparent font-sans text-lg text-ink outline-none placeholder:text-muted"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="grid size-9 place-items-center rounded-full text-muted hover:bg-navy/5">
              <X className="size-5" />
            </button>
          )}
          <button type="button" onClick={onClose} className="rounded-lg px-3 py-2 font-sans text-sm font-semibold text-navy hover:bg-navy/5">
            Close
          </button>
        </div>
        <p className="mx-auto mt-1 max-w-3xl pl-9 font-sans text-xs text-muted">Search the Atlas archives.</p>
      </form>

      <div className="flex-1 overflow-y-auto bg-ivory px-4 py-6 sm:px-8">
        <div className="mx-auto max-w-3xl" aria-live="polite">
          {trimmed.length >= 2 ? (
            <>
              {loading && !results.length && <p className="py-8 text-center font-sans text-sm text-muted">Searching…</p>}
              {!loading && !results.length && (
                <div className="py-8 text-center">
                  <p className="font-sans font-semibold text-navy">No results for “{trimmed}”</p>
                  <p className="mt-1 font-sans text-sm text-muted">Try a card name, set or TCG – or browse a category below.</p>
                </div>
              )}
              {results.length > 0 && (
                <ul className="divide-y divide-stone/60 overflow-hidden rounded-xl border border-stone/70 bg-white">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/products/${p.slug}`}
                        onClick={() => {
                          addSearch(trimmed);
                          onClose();
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-parchment/50 focus-visible:bg-parchment/50"
                      >
                        <span className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-parchment/60">
                          <ProductImage src={p.images[0]} alt="" sizes="48px" />
                        </span>
                        <span className="min-w-0 flex-1 font-sans">
                          <span className="block truncate text-sm font-semibold text-ink">{p.name}</span>
                          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted">
                            <span>{[p.tcgLabel, p.set].filter(Boolean).join(' · ')}</span>
                            {p.isGraded ? <GradeBadge product={p} /> : <span>{p.condition}</span>}
                          </span>
                        </span>
                        <span className="shrink-0 text-right font-sans">
                          <span className="block text-sm font-bold text-navy">{formatPrice(p.price)}</span>
                          <StockStatus product={p} />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {total > 0 && (
                <button type="button" onClick={() => submit(trimmed)} className="mt-4 w-full rounded-lg border border-navy/25 bg-white py-3 font-sans text-sm font-semibold text-navy hover:border-navy/50">
                  View all {total} result{total === 1 ? '' : 's'} for “{trimmed}”
                </button>
              )}
            </>
          ) : (
            searches.length > 0 && (
              <section className="mb-8" aria-label="Recent searches">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted">Recent searches</h2>
                  <button type="button" onClick={clearSearches} className="font-sans text-xs text-arcane hover:underline">
                    Clear
                  </button>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {searches.map((s) => (
                    <li key={s}>
                      <button type="button" onClick={() => submit(s)} className="inline-flex items-center gap-1.5 rounded-full border border-stone bg-white px-3 py-1.5 font-sans text-sm text-ink hover:border-gold">
                        <Clock className="size-3.5 text-muted" aria-hidden /> {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )
          )}

          <section aria-label="Suggested categories" className={trimmed.length >= 2 ? 'mt-8' : ''}>
            <h2 className="mb-2 flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-muted">
              <Sparkles className="size-3.5 text-gold" aria-hidden /> Suggested categories
            </h2>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {suggested.map((c) => (
                <li key={c.slug}>
                  <Link href={`/collections/${c.slug}`} onClick={onClose} className="block rounded-lg border border-stone/70 bg-white px-3 py-2.5 hover:border-gold">
                    <span className="block font-sans text-sm font-semibold text-navy">{c.title}</span>
                    <span className="block font-sans text-xs text-muted">{c.flavour}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Sheet>
  );
}
