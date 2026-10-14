'use client';

import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ProductGrid } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { Sheet } from '@/components/ui/Sheet';
import { formatPrice } from '@/lib/config';
import { activeFilterCount, applyFilters, buildFacets, filtersFromParams, filtersToParams, sortProducts, type FacetOption } from '@/lib/data/filter';
import type { Product, ProductFilters, SortKey } from '@/lib/types';
import { emptyFilters } from '@/lib/types';

type ListKey = 'tcg' | 'set' | 'productType' | 'condition' | 'gradingCompany' | 'grade' | 'rarity' | 'language';

const GROUPS: { key: ListKey; label: string; open?: boolean }[] = [
  { key: 'tcg', label: 'TCG', open: true },
  { key: 'productType', label: 'Product type', open: true },
  { key: 'set', label: 'Set' },
  { key: 'condition', label: 'Condition' },
  { key: 'gradingCompany', label: 'Grading company' },
  { key: 'grade', label: 'Grade' },
  { key: 'rarity', label: 'Rarity' },
  { key: 'language', label: 'Language' },
];

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const PAGE_SIZE = 24;

function FilterGroup({ title, defaultOpen, children, count }: { title: string; defaultOpen?: boolean; children: ReactNode; count?: number }) {
  return (
    <details open={defaultOpen || !!count} className="group border-b border-stone/60 py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between font-sans text-sm font-bold text-navy [&::-webkit-details-marker]:hidden">
        <span>
          {title}
          {!!count && <span className="ml-1.5 rounded-full bg-arcane px-1.5 text-[11px] font-semibold text-white">{count}</span>}
        </span>
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function CheckList({ options, selected, onToggle, name }: { options: FacetOption[]; selected: string[]; onToggle: (v: string) => void; name: string }) {
  return (
    <ul className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
      {options.map((o) => {
        const id = `${name}-${o.value}`;
        return (
          <li key={o.value}>
            <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5 rounded py-0.5 font-sans text-sm text-ink hover:text-arcane">
              <input id={id} type="checkbox" checked={selected.includes(o.value)} onChange={() => onToggle(o.value)} className="size-4 rounded border-stone accent-[#4778D0]" />
              <span className="flex-1">{o.value}</span>
              <span className="text-xs text-muted">{o.count}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 font-sans text-sm text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 rounded border-stone accent-[#4778D0]" />
      {label}
    </label>
  );
}

interface Props {
  products: Product[];
  /** Hide filters that the surrounding page already fixes (e.g. TCG on a TCG page). */
  hideGroups?: ListKey[];
  emptyMessage?: string;
}

export function ShopBrowser({ products, hideGroups = [], emptyMessage = 'No products match your filters.' }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { filters, sort } = useMemo(() => filtersFromParams(new URLSearchParams(params.toString())), [params]);
  const facets = useMemo(() => buildFacets(products), [products]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [priceDraft, setPriceDraft] = useState({ min: '', max: '' });

  const results = useMemo(() => sortProducts(applyFilters(products, filters), sort), [products, filters, sort]);
  const activeCount = activeFilterCount({ ...filters, query: undefined });

  useEffect(() => setVisible(PAGE_SIZE), [params]);
  useEffect(
    () => setPriceDraft({ min: filters.minPrice?.toString() ?? '', max: filters.maxPrice?.toString() ?? '' }),
    [filters.minPrice, filters.maxPrice],
  );

  const update = (next: ProductFilters, nextSort: SortKey = sort) => {
    const qs = filtersToParams(next, nextSort).toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const toggle = (key: ListKey, value: string) =>
    update({ ...filters, [key]: filters[key].includes(value) ? filters[key].filter((v) => v !== value) : [...filters[key], value] });
  const clearAll = () => update({ ...emptyFilters, query: filters.query });
  const applyPrice = () => {
    const min = priceDraft.min === '' ? undefined : Number(priceDraft.min);
    const max = priceDraft.max === '' ? undefined : Number(priceDraft.max);
    update({ ...filters, minPrice: Number.isFinite(min) ? min : undefined, maxPrice: Number.isFinite(max) ? max : undefined });
  };

  const chips: { label: string; remove: () => void }[] = [
    ...GROUPS.flatMap((g) => filters[g.key].map((v) => ({ label: g.key === 'grade' ? `Grade ${v}` : v, remove: () => toggle(g.key, v) }))),
    ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
      ? [{ label: `${filters.minPrice !== undefined ? formatPrice(filters.minPrice) : 'Any'} – ${filters.maxPrice !== undefined ? formatPrice(filters.maxPrice) : 'Any'}`, remove: () => update({ ...filters, minPrice: undefined, maxPrice: undefined }) }]
      : []),
    ...(filters.inStockOnly ? [{ label: 'In stock', remove: () => update({ ...filters, inStockOnly: false }) }] : []),
    ...(filters.newOnly ? [{ label: 'New arrivals', remove: () => update({ ...filters, newOnly: false }) }] : []),
    ...(filters.saleOnly ? [{ label: 'On sale', remove: () => update({ ...filters, saleOnly: false }) }] : []),
  ];

  const panel = (
    <div>
      {GROUPS.filter((g) => !hideGroups.includes(g.key) && (facets[g.key].length > 1 || filters[g.key].length > 0)).map((g) => (
        <FilterGroup key={g.key} title={g.label} defaultOpen={g.open} count={filters[g.key].length}>
          <CheckList name={g.key} options={facets[g.key]} selected={filters[g.key]} onToggle={(v) => toggle(g.key, v)} />
        </FilterGroup>
      ))}
      <FilterGroup title="Price range" defaultOpen count={filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0}>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="price-min">Minimum price</label>
          <input id="price-min" inputMode="decimal" placeholder={`€${facets.minPrice}`} value={priceDraft.min} onChange={(e) => setPriceDraft({ ...priceDraft, min: e.target.value })} onBlur={applyPrice} onKeyDown={(e) => e.key === 'Enter' && applyPrice()} className="h-10 w-full rounded-lg border border-stone bg-white px-3 font-sans text-sm" />
          <span className="text-muted">–</span>
          <label className="sr-only" htmlFor="price-max">Maximum price</label>
          <input id="price-max" inputMode="decimal" placeholder={`€${facets.maxPrice}`} value={priceDraft.max} onChange={(e) => setPriceDraft({ ...priceDraft, max: e.target.value })} onBlur={applyPrice} onKeyDown={(e) => e.key === 'Enter' && applyPrice()} className="h-10 w-full rounded-lg border border-stone bg-white px-3 font-sans text-sm" />
        </div>
      </FilterGroup>
      <FilterGroup title="Availability" defaultOpen>
        <Toggle label="In stock only" checked={filters.inStockOnly} onChange={(v) => update({ ...filters, inStockOnly: v })} />
        {facets.hasNew && <Toggle label="New arrivals" checked={filters.newOnly} onChange={(v) => update({ ...filters, newOnly: v })} />}
        {facets.hasSale && <Toggle label="Sale products" checked={filters.saleOnly} onChange={(v) => update({ ...filters, saleOnly: v })} />}
      </FilterGroup>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block" aria-label="Filters">
        <div className="sticky top-24 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-2xl border border-stone/70 bg-white p-5 shadow-card">
          <div className="mb-1 flex items-center justify-between">
            <h2 className="font-sans text-base font-bold text-navy">Filters</h2>
            {activeCount > 0 && (
              <button type="button" onClick={clearAll} className="font-sans text-xs font-semibold text-arcane hover:underline">
                Clear All
              </button>
            )}
          </div>
          {panel}
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-sans text-sm font-semibold text-navy" aria-live="polite">
            {results.length} {results.length === 1 ? 'product' : 'products'}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="lg:hidden" onClick={() => setSheetOpen(true)}>
              <SlidersHorizontal className="size-4" aria-hidden /> Filters{activeCount > 0 && ` (${activeCount})`}
            </Button>
            <label className="flex items-center gap-2 font-sans text-sm text-muted">
              <span className="max-sm:sr-only">Sort by</span>
              <select value={sort} onChange={(e) => update(filters, e.target.value as SortKey)} className="h-9 rounded-lg border border-stone bg-white px-3 font-sans text-sm font-medium text-ink">
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {chips.length > 0 && (
          <ul className="mb-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
            {chips.map((c) => (
              <li key={c.label}>
                <button type="button" onClick={c.remove} className="inline-flex items-center gap-1.5 rounded-full border border-arcane/30 bg-arcane/10 px-3 py-1 font-sans text-xs font-semibold text-navy hover:bg-arcane/20" aria-label={`Remove filter ${c.label}`}>
                  {c.label} <X className="size-3.5" aria-hidden />
                </button>
              </li>
            ))}
            <li>
              <button type="button" onClick={clearAll} className="px-2 font-sans text-xs font-semibold text-arcane hover:underline">
                Clear All
              </button>
            </li>
          </ul>
        )}

        {results.length ? (
          <>
            <ProductGrid products={results.slice(0, visible)} className="lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5" priorityCount={4} />
            {visible < results.length && (
              <div className="mt-8 text-center">
                <Button variant="secondary" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Show more ({results.length - visible} remaining)
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-stone bg-white/60 p-10 text-center">
            <p className="font-sans text-base font-semibold text-navy">{emptyMessage}</p>
            {activeCount > 0 && (
              <Button className="mt-4" onClick={clearAll}>
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} label="Filters" side="bottom" hideClose>
        <div className="flex items-center justify-between border-b border-stone/70 px-5 py-4">
          <h2 className="font-sans text-lg font-bold text-navy">Filters</h2>
          <button type="button" onClick={clearAll} className="font-sans text-sm font-semibold text-arcane">
            Clear All
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-4">{panel}</div>
        <div className="border-t border-stone/70 bg-ivory p-4">
          <Button full size="lg" onClick={() => setSheetOpen(false)}>
            Show {results.length} {results.length === 1 ? 'product' : 'products'}
          </Button>
        </div>
      </Sheet>
    </div>
  );
}

export type { ListKey };
