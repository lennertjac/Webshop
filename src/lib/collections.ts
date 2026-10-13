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
    slug: 'rare-high-end',
    title: 'Rare & High-End',
    flavour: 'The Treasure Chamber',
    description: 'Premium singles, signed cards and top-grade slabs.',
    scene: 'treasure',
    match: (p) => p.isVault || p.tags.includes('rare'),
  },
  tcgCollection('pokemon', 'The Sunlit Meadows', 'Singles, graded cards and sealed product for Pokémon TCG.'),
  tcgCollection('riftbound', 'The Arcane Citadel', 'Signed showcases, alt-arts and sealed Riftbound product.'),
  tcgCollection('one-piece', 'The Open Seas', 'One Piece Card Game singles, boxes and graded cards.'),
  tcgCollection('magic', 'The Ancient Ruins', 'Magic singles, sealed product and graded collectibles.'),
  tcgCollection('other', 'Beyond the Map', 'Lorcana, Yu-Gi-Oh!, Digimon and more.'),
];

export const getCollection = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);

export const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections/cards', label: 'Cards' },
  { href: '/collections/sealed', label: 'Sealed' },
  { href: '/collections/graded', label: 'Graded' },
  { href: '/collections', label: 'Collections' },
  { href: '/collections/new-arrivals', label: 'New Arrivals' },
  { href: '/vault', label: 'The Vault' },
] as const;
