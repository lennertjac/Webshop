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
  other: { label: 'Other', slug: 'shop' },
};

export function detectTcg(category: string | null | undefined): TcgId {
  const c = (category ?? '').toLowerCase();
  if (c.includes('pok')) return 'pokemon';
  if (c.includes('rift')) return 'riftbound';
  if (c.includes('one piece')) return 'one-piece';
  return 'other';
}

const tcgCollection = (id: Exclude<TcgId, 'other'>, flavour: string, description: string): Collection => ({
  slug: TCG_META[id].slug,
  title: TCG_META[id].label,
  flavour,
  description,
  scene: id,
  match: (p) => p.tcg === id,
});

export const COLLECTIONS: Collection[] = [
  {
    slug: 'singles',
    title: 'Singles',
    flavour: 'The Wayfarer’s Shelf',
    description: 'Hand-checked cards, each one sleeved and ready to join your collection.',
    scene: 'singles',
    match: (p) => p.kind === 'single',
  },
  {
    slug: 'graded',
    title: 'Graded Cards',
    flavour: 'The Grand Archive',
    description: 'Sealed in slabs by PSA, CGC, BGS and other trusted guardians – grades clearly shown.',
    scene: 'archive',
    match: (p) => p.kind === 'graded',
  },
  {
    slug: 'sealed',
    title: 'Sealed Products',
    flavour: 'Expedition Supplies',
    description: 'Sealed relics from the vault: packs, boxes, cases and decks, factory sealed.',
    scene: 'supply',
    match: (p) => p.kind === 'sealed',
  },
  {
    slug: 'new-arrivals',
    title: 'New Arrivals',
    flavour: 'Recently Discovered',
    description: 'Fresh discoveries from our latest expeditions.',
    scene: 'gateway',
    match: (p) => p.isNew,
  },
  {
    slug: 'bundles',
    title: 'Collections',
    flavour: 'Curated Sets',
    description: 'Curated collections of cards, sealed product and gear, gathered to be claimed together.',
    scene: 'story',
    match: (p) => p.kind === 'collection',
  },

  tcgCollection('pokemon', 'The Sunlit Meadows', 'Legends of the sunlit meadows: Pokémon singles, graded slabs and sealed product.'),
  tcgCollection('riftbound', 'The Arcane Citadel', 'Relics of the arcane citadel: signed showcases, alt-arts and sealed Riftbound product.'),
  tcgCollection('one-piece', 'The Open Seas', 'Treasures of the open seas: One Piece singles, boxes and graded cards.'),
];

export const getCollection = (slug: string) => COLLECTIONS.find((c) => c.slug === slug);

export const TCG_SLUGS = ['pokemon', 'riftbound', 'one-piece'];

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
