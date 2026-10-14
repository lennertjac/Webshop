import type { Product, TcgId } from './types';

export type SceneVariant =
  | 'hero'
  | 'singles'
  | 'archive'
  | 'supply'
  | 'treasure'
  | 'gateway'
  | 'catalog'
  | 'pokemon'
  | 'riftbound'
  | 'one-piece'
  | 'magic'
  | 'other'
  | 'vault'
  | 'story'
  | 'sell'
  | 'plain';

export interface Collection {
  slug: string;
  /** Plain ecommerce name – always the primary label. */
  title: string;
  /** Optional fantasy flavour shown underneath. */
  flavour: string;
  description: string;
  scene: SceneVariant;
  match: (p: Product) => boolean;
}

export const TCG_META: Record<TcgId, { label: string; slug: string }> = {
  pokemon: { label: 'Pokémon', slug: 'pokemon' },
  riftbound: { label: 'Riftbound', slug: 'riftbound' },
  'one-piece': { label: 'One Piece', slug: 'one-piece' },
  magic: { label: 'Magic: The Gathering', slug: 'magic-the-gathering' },
  other: { label: 'Other TCGs', slug: 'other-tcgs' },
};

export function detectTcg(category: string | null | undefined): TcgId {
  const c = (category ?? '').toLowerCase();
  if (c.includes('pok')) return 'pokemon';
  if (c.includes('rift')) return 'riftbound';
  if (c.includes('one piece')) return 'one-piece';
  if (c.includes('magic')) return 'magic';
  return 'other';
}

const tcgCollection = (id: TcgId, flavour: string, description: string): Collection => ({
  slug: TCG_META[id].slug,
  title: TCG_META[id].label,
  flavour,
  description,
  scene: id === 'other' ? 'other' : id,
  match: (p) => p.tcg === id,
});

export const COLLECTIONS: Collection[] = [
  {
    slug: 'cards',
    title: 'Trading Cards',
    flavour: 'The Open Road',
    description: 'Singles and graded cards from every TCG we stock.',
    scene: 'catalog',
    match: (p) => p.kind === 'single' || p.kind === 'graded',
  },
  {
    slug: 'singles',
    title: 'Singles',
    flavour: 'The Wayfarer’s Shelf',
    description: 'Individual raw cards, condition-checked and carefully sleeved.',
    scene: 'singles',
    match: (p) => p.kind === 'single',
  },
  {
    slug: 'graded',
    title: 'Graded Cards',
    flavour: 'The Grand Archive',
    description: 'Slabbed cards graded by PSA, CGC, BGS and other trusted companies.',
    scene: 'archive',
    match: (p) => p.kind === 'graded',
  },
  {
    slug: 'sealed',
    title: 'Sealed Products',
    flavour: 'Expedition Supplies',
    description: 'Booster boxes, packs, decks and collections – factory sealed.',
    scene: 'supply',
    match: (p) => p.kind === 'sealed',
  },
  {
    slug: 'new-arrivals',
    title: 'New Arrivals',
    flavour: 'Recently Discovered',
    description: 'The latest cards and products added to the store.',
    scene: 'gateway',
    match: (p) => p.isNew,
  },
  {
    slug: 'bundles',
    title: 'Collections',
    flavour: 'Curated Sets',
    description: 'Sets of cards, sealed product and accessories that are sold together.',
    scene: 'story',
    match: (p) => p.kind === 'collection',
  },
  {
    slug: 'accessories',
    title: 'Accessories',
    flavour: 'The Gear Shop',
    description: 'Binders, sleeves, playmats and other collector gear.',
    scene: 'supply',
    match: (p) => p.kind === 'accessory',
  },
  tcgCollection('pokemon', 'The Sunlit Meadows', 'Singles, graded cards and sealed product for Pokémon TCG.'),
  tcgCollection('riftbound', 'The Arcane Citadel', 'Signed showcases, alt-arts and sealed Riftbound product.'),
  tcgCollection('one-piece', 'The Open Seas', 'One Piece Card Game singles, boxes and graded cards.'),
  tcgCollection('magic', 'The Ancient Ruins', 'Magic singles, sealed product and graded collectibles.'),
  tcgCollection('other', 'Beyond the Map', 'Lorcana, Yu-Gi-Oh!, Digimon and more.'),
];

export const getCollection = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);

export const TCG_SLUGS = ['pokemon', 'riftbound', 'one-piece', 'magic-the-gathering', 'other-tcgs'];

export interface NavLink {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

export const NAV_LINKS: NavLink[] = [
  {
    href: '/shop',
    label: 'Shop',
    children: [
      { href: '/shop', label: 'All products' },
      { href: '/collections/new-arrivals', label: 'New arrivals' },
      ...COLLECTIONS.filter((c) => TCG_SLUGS.includes(c.slug)).map((c) => ({ href: `/collections/${c.slug}`, label: c.title })),
    ],
  },
  { href: '/collections/singles', label: 'Singles' },
  { href: '/collections/graded', label: 'Graded' },
  { href: '/collections/sealed', label: 'Sealed' },
  { href: '/collections/bundles', label: 'Collections' },
  { href: '/vault', label: 'The Vault' },
];
