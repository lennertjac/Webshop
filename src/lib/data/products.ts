import { LOW_STOCK_AT, NEW_ARRIVAL_DAYS, VAULT_MIN_PRICE, slugify } from '../config';
import { TCG_META, detectTcg } from '../collections';
import type { Availability, Product, ProductKind, ProductTag } from '../types';
import { DEMO_PRODUCTS } from './demo';

/** Shape returned by the ATLAS Stock Manager `/api/public-products` endpoint. */
export interface AtlasProduct {
  id: string;
  name: string;
  price: number;
  condition?: string | null;
  grade?: string | null;
  gradingCompany?: string | null;
  quantity: number;
  images?: string[] | null;
  cardImage?: string | null;
  category?: string | null;
  productType?: string | null;
  isFeatured?: boolean | null;
  isGraded?: boolean | null;
  createdAt?: string | null;
  cardNumber?: string | null;
  setName?: string | null;
  rarity?: string | null;
  language?: string | null;
  compareAtPrice?: number | null;
  description?: string | null;
}

function kindOf(raw: AtlasProduct, isGraded: boolean): ProductKind {
  const t = (raw.productType ?? '').toLowerCase();
  if (isGraded || t.includes('graded')) return 'graded';
  if (/(sealed|booster|box|collection|deck|bundle|display|case)/.test(t)) return 'sealed';
  if (t.includes('single')) return 'single';
  return 'other';
}

function availabilityOf(qty: number, kind: ProductKind): Availability {
  if (qty <= 0) return 'sold-out';
  // One-of-a-kind singles and slabs are normal, so only flag genuinely thin stock.
  if (qty <= LOW_STOCK_AT && !(qty === 1 && (kind === 'single' || kind === 'graded'))) return 'low-stock';
  return 'in-stock';
}

export function adaptProduct(raw: AtlasProduct): Product {
  const grade = raw.grade && raw.grade !== 'Ungraded' ? raw.grade : null;
  const isGraded = Boolean(raw.isGraded ?? grade);
  const tcg = detectTcg(raw.category);
  const kind = kindOf(raw, isGraded);
  const stock = Math.max(0, raw.quantity ?? 0);
  const availability = availabilityOf(stock, kind);
  const created = raw.createdAt ? new Date(raw.createdAt) : null;
  const isNew = created ? Date.now() - created.getTime() < NEW_ARRIVAL_DAYS * 86_400_000 : false;
  const isVault = raw.price >= VAULT_MIN_PRICE;
  const compareAtPrice = raw.compareAtPrice && raw.compareAtPrice > raw.price ? raw.compareAtPrice : undefined;

  const tags: ProductTag[] = [];
  if (availability === 'sold-out') tags.push('sold-out');
  if (availability === 'low-stock') tags.push('low-stock');
  if (compareAtPrice) tags.push('sale');
  if (isNew) tags.push('new');
  if (isVault) tags.push('vault');
  if (raw.rarity && /(secret|ultra|legendary|special|signature|rare)/i.test(raw.rarity)) tags.push('rare');

  const images = [...(raw.images ?? []), ...(raw.cardImage ? [raw.cardImage] : [])].filter(Boolean);

  return {
    id: raw.id,
    slug: '',
    name: raw.name,
    set: raw.setName ?? undefined,
    cardNumber: raw.cardNumber ?? undefined,
    tcg,
    tcgLabel: raw.category?.trim() || TCG_META[tcg].label,
    kind,
    productType: raw.productType ?? 'Single Card',
    condition: raw.condition && raw.condition !== 'Unknown' ? raw.condition : 'Not specified',
    gradingCompany: raw.gradingCompany,
    grade,
    isGraded,
    language: raw.language ?? undefined,
    rarity: raw.rarity ?? undefined,
    price: raw.price,
    compareAtPrice,
    stock,
    availability,
    images: Array.from(new Set(images)),
    tags,
    isFeatured: Boolean(raw.isFeatured),
    isNew,
    isVault,
    createdAt: raw.createdAt ?? undefined,
    popularity: (raw.isFeatured ? 1000 : 0) + raw.price / 10,
    description: raw.description ?? undefined,
  };
}

function assignSlugs(products: Product[]): Product[] {
  const base = products.map((p) =>
    slugify([p.name, p.isGraded ? `${p.gradingCompany ?? ''} ${p.grade ?? ''}` : ''].join(' ')),
  );
  const counts = new Map<string, number>();
  base.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1));
  return products.map((p, i) => ({
    ...p,
    slug: counts.get(base[i])! > 1 || !base[i] ? `${base[i] || 'product'}-${p.id.slice(0, 6)}` : base[i],
  }));
}

const apiUrl = () => (process.env.ATLAS_API_URL ?? 'https://atlas-stock-manager.vercel.app').replace(/\/$/, '');

/** Single backend seam – swap this for Shopify / Medusa / Supabase later. */
export async function getProducts(): Promise<Product[]> {
  let raw: AtlasProduct[] = [];
  try {
    const res = await fetch(`${apiUrl()}/api/public-products`, { next: { revalidate: 300, tags: ['products'] } });
    if (res.ok) raw = ((await res.json()) as { products?: AtlasProduct[] }).products ?? [];
  } catch (err) {
    console.error('Failed to load products', err);
  }
  if (process.env.NEXT_PUBLIC_DEMO_DATA === 'true') raw = [...raw, ...DEMO_PRODUCTS];
  return assignSlugs(raw.map(adaptProduct));
}

export async function getProductBySlugOrId(key: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((p) => p.slug === key) ?? all.find((p) => p.id === key);
}
