import type { AtlasProduct } from './products';

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

const card = (
  n: number,
  name: string,
  category: string,
  price: number,
  extra: Partial<AtlasProduct> = {},
): AtlasProduct => ({
  id: `demo-${String(n).padStart(2, '0')}-0000-4000-8000-000000000000`,
  name,
  price,
  condition: 'Near Mint',
  grade: 'Ungraded',
  gradingCompany: null,
  quantity: 1,
  images: null,
  cardImage: null,
  category,
  productType: 'Single Card',
  isFeatured: false,
  isGraded: false,
  language: 'English',
  ...extra,
});

/** Only used when NEXT_PUBLIC_DEMO_DATA=true so layouts can be reviewed with a full catalog. */
export const DEMO_PRODUCTS: AtlasProduct[] = [
  card(1, 'Ahri, Nine-Tailed Fox (Signature Edition)', 'Riftbound', 1240, { grade: '10', gradingCompany: 'PSA', condition: 'Graded', isGraded: true, isFeatured: true, setName: 'Origins', cardNumber: '#299', rarity: 'Signature', createdAt: daysAgo(2) }),
  card(2, 'Jinx, Loose Cannon (Alt Art)', 'Riftbound', 310, { setName: 'Origins', cardNumber: '#241', rarity: 'Epic', createdAt: daysAgo(3), quantity: 2 }),
  card(3, 'Charizard ex (Special Illustration Rare)', 'Pokémon', 389, { grade: '9', gradingCompany: 'PSA', condition: 'Graded', isGraded: true, isFeatured: true, setName: 'Obsidian Flames', cardNumber: '#223/197', rarity: 'Special Illustration Rare', compareAtPrice: 429, createdAt: daysAgo(5) }),
  card(4, 'Pikachu with Grey Felt Hat', 'Pokémon', 145, { setName: 'Promo', cardNumber: 'SVP 085', rarity: 'Promo', createdAt: daysAgo(9) }),
  card(5, 'Umbreon VMAX (Alternate Art)', 'Pokémon', 520, { grade: '10', gradingCompany: 'CGC', condition: 'Graded', isGraded: true, isFeatured: true, setName: 'Evolving Skies', cardNumber: '#215/203', rarity: 'Secret Rare', createdAt: daysAgo(12) }),
  card(6, 'Monkey D. Luffy (Manga Rare)', 'One Piece', 275, { setName: 'Awakening of the New Era', cardNumber: 'OP05-119', rarity: 'Secret Rare', createdAt: daysAgo(4), quantity: 3 }),
  card(7, 'Shanks (Parallel)', 'One Piece', 68, { setName: 'Paramount War', cardNumber: 'OP02-120', rarity: 'Super Rare', createdAt: daysAgo(15), quantity: 5 }),
  card(8, 'Black Lotus (Unlimited)', 'Magic: The Gathering', 8900, { grade: '8', gradingCompany: 'BGS', condition: 'Graded', isGraded: true, isFeatured: true, setName: 'Unlimited Edition', rarity: 'Rare', createdAt: daysAgo(30) }),
  card(9, 'Sheoldred, the Apocalypse', 'Magic: The Gathering', 54, { setName: 'Dominaria United', cardNumber: '#107', rarity: 'Mythic Rare', createdAt: daysAgo(7), quantity: 4 }),
  card(10, 'Lorcana Elsa, Spirit of Winter (Enchanted)', 'Lorcana', 410, { setName: 'The First Chapter', cardNumber: '#207/204', rarity: 'Enchanted', createdAt: daysAgo(10) }),
  card(11, 'Surging Sparks Booster Box', 'Pokémon', 169, { productType: 'Sealed Box', condition: 'Sealed', quantity: 6, setName: 'Surging Sparks', createdAt: daysAgo(1) }),
  card(12, 'Origins Booster Display', 'Riftbound', 135, { productType: 'Sealed Box', condition: 'Sealed', quantity: 4, setName: 'Origins', createdAt: daysAgo(6), compareAtPrice: 159 }),
  card(13, 'Romance Dawn Booster Box', 'One Piece', 289, { productType: 'Sealed Box', condition: 'Sealed', quantity: 1, setName: 'Romance Dawn', createdAt: daysAgo(18) }),
  card(14, 'Commander Masters Collector Booster', 'Magic: The Gathering', 24, { productType: 'Booster Pack', condition: 'Sealed', quantity: 24, setName: 'Commander Masters', createdAt: daysAgo(25) }),
  card(15, 'Lux, Lady of Luminosity', 'Riftbound', 22, { setName: 'Origins', cardNumber: '#118', rarity: 'Rare', quantity: 8, createdAt: daysAgo(8) }),
  card(16, 'Blue-Eyes White Dragon (1st Edition)', 'Yu-Gi-Oh!', 640, { grade: '9', gradingCompany: 'PSA', condition: 'Graded', isGraded: true, setName: 'Legend of Blue Eyes', rarity: 'Ultra Rare', createdAt: daysAgo(20) }),
];
