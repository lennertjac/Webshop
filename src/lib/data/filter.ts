import type { Product, ProductFilters, SortKey } from '../types';
import { emptyFilters } from '../types';

export interface FacetOption {
  value: string;
  count: number;
}

export interface Facets {
  tcg: FacetOption[];
  set: FacetOption[];
  productType: FacetOption[];
  condition: FacetOption[];
  gradingCompany: FacetOption[];
  grade: FacetOption[];
  rarity: FacetOption[];
  language: FacetOption[];
  minPrice: number;
  maxPrice: number;
  hasSale: boolean;
  hasNew: boolean;
}

const count = (items: (string | null | undefined)[]): FacetOption[] => {
  const map = new Map<string, number>();
  items.forEach((v) => v && map.set(v, (map.get(v) ?? 0) + 1));
  return [...map.entries()].map(([value, c]) => ({ value, count: c })).sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
};

export function buildFacets(products: Product[]): Facets {
  const prices = products.map((p) => p.price);
  return {
    tcg: count(products.map((p) => p.tcgLabel)),
    set: count(products.map((p) => p.set)),
    productType: count(products.map((p) => p.productType)),
    condition: count(products.map((p) => p.condition)),
    gradingCompany: count(products.map((p) => p.gradingCompany)),
    grade: count(products.map((p) => p.grade)).sort((a, b) => parseFloat(b.value) - parseFloat(a.value)),
    rarity: count(products.map((p) => p.rarity)),
    language: count(products.map((p) => p.language)),
    minPrice: prices.length ? Math.floor(Math.min(...prices)) : 0,
    maxPrice: prices.length ? Math.ceil(Math.max(...prices)) : 0,
    hasSale: products.some((p) => p.compareAtPrice),
    hasNew: products.some((p) => p.isNew),
  };
}

const norm = (s: string) => s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

function haystack(p: Product): string {
  return norm(
    [p.name, p.set, p.tcgLabel, p.cardNumber, p.gradingCompany, p.grade && `grade ${p.grade}`, p.condition, p.productType, p.rarity]
      .filter(Boolean)
      .join(' '),
  );
}

export function searchProducts(products: Product[], query: string, limit = Infinity): Product[] {
  const tokens = norm(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const scored = products
    .map((p) => {
      const h = haystack(p);
      if (!tokens.every((t) => h.includes(t))) return null;
      const name = norm(p.name);
      const score = tokens.reduce((s, t) => s + (name.startsWith(t) ? 3 : name.includes(t) ? 2 : 1), 0);
      return { p, score };
    })
    .filter((x): x is { p: Product; score: number } => x !== null)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.p);
}

const has = (list: string[], v?: string | null) => !list.length || (!!v && list.includes(v));

export function applyFilters(products: Product[], f: ProductFilters): Product[] {
  const base = f.query ? searchProducts(products, f.query) : products;
  return base.filter(
    (p) =>
      has(f.tcg, p.tcgLabel) &&
      has(f.set, p.set) &&
      has(f.productType, p.productType) &&
      has(f.condition, p.condition) &&
      has(f.gradingCompany, p.gradingCompany) &&
      has(f.grade, p.grade) &&
      has(f.rarity, p.rarity) &&
      has(f.language, p.language) &&
      (f.minPrice === undefined || p.price >= f.minPrice) &&
      (f.maxPrice === undefined || p.price <= f.maxPrice) &&
      (!f.inStockOnly || p.stock > 0) &&
      (!f.newOnly || p.isNew) &&
      (!f.saleOnly || !!p.compareAtPrice),
  );
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  switch (sort) {
    case 'newest':
      return list.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''));
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price);
    case 'popular':
      return list.sort((a, b) => b.popularity - a.popularity);
    default:
      return list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || Number(a.stock === 0) - Number(b.stock === 0));
  }
}

export const newestFirst = (products: Product[]) => sortProducts(products, 'newest');

// ── URL <-> filter state ────────────────────────────────────────────────

const LIST_KEYS = {
  tcg: 'tcg',
  set: 'set',
  productType: 'type',
  condition: 'condition',
  gradingCompany: 'company',
  grade: 'grade',
  rarity: 'rarity',
  language: 'lang',
} as const;

export function filtersFromParams(params: URLSearchParams): { filters: ProductFilters; sort: SortKey } {
  const filters: ProductFilters = { ...emptyFilters };
  (Object.keys(LIST_KEYS) as (keyof typeof LIST_KEYS)[]).forEach((k) => {
    const raw = params.get(LIST_KEYS[k]);
    filters[k] = raw ? raw.split('~').filter(Boolean) : [];
  });
  const num = (key: string) => {
    const v = params.get(key);
    return v !== null && v !== '' && Number.isFinite(Number(v)) ? Number(v) : undefined;
  };
  filters.minPrice = num('min');
  filters.maxPrice = num('max');
  filters.inStockOnly = params.get('stock') === '1';
  filters.newOnly = params.get('new') === '1';
  filters.saleOnly = params.get('sale') === '1';
  filters.query = params.get('q') ?? undefined;
  const sort = (params.get('sort') as SortKey) || 'featured';
  return { filters, sort };
}

export function filtersToParams(filters: ProductFilters, sort: SortKey): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.query) p.set('q', filters.query);
  (Object.keys(LIST_KEYS) as (keyof typeof LIST_KEYS)[]).forEach((k) => {
    if (filters[k].length) p.set(LIST_KEYS[k], filters[k].join('~'));
  });
  if (filters.minPrice !== undefined) p.set('min', String(filters.minPrice));
  if (filters.maxPrice !== undefined) p.set('max', String(filters.maxPrice));
  if (filters.inStockOnly) p.set('stock', '1');
  if (filters.newOnly) p.set('new', '1');
  if (filters.saleOnly) p.set('sale', '1');
  if (sort !== 'featured') p.set('sort', sort);
  return p;
}

export function activeFilterCount(f: ProductFilters): number {
  return (
    Object.keys(LIST_KEYS).reduce((n, k) => n + f[k as keyof typeof LIST_KEYS].length, 0) +
    (f.minPrice !== undefined || f.maxPrice !== undefined ? 1 : 0) +
    Number(f.inStockOnly) +
    Number(f.newOnly) +
    Number(f.saleOnly)
  );
}
