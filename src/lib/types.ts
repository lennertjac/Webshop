// Domain types for the storefront. Backend adapters map their payloads onto these.

export type TcgId = 'pokemon' | 'riftbound' | 'one-piece' | 'magic' | 'other';
export type ProductKind = 'single' | 'graded' | 'sealed' | 'collection' | 'accessory' | 'other';
export type Availability = 'in-stock' | 'low-stock' | 'sold-out' | 'preorder';
export type ProductTag = 'new' | 'low-stock' | 'rare' | 'sold-out' | 'preorder' | 'vault' | 'sale';

export interface Product {
  id: string;
  slug: string;
  name: string;
  set?: string;
  cardNumber?: string;
  tcg: TcgId;
  tcgLabel: string;
  kind: ProductKind;
  productType: string;
  condition: string;
  gradingCompany?: string | null;
  grade?: string | null;
  isGraded: boolean;
  language?: string;
  rarity?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  availability: Availability;
  /** Front image first, then back / extra photos. */
  images: string[];
  tags: ProductTag[];
  isFeatured: boolean;
  isNew: boolean;
  isVault: boolean;
  createdAt?: string;
  /** Items bundled into a collection product. */
  contents?: { name: string; quantity: number; type: string }[];
  description?: string;
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  condition: string;
  grade?: string | null;
  gradingCompany?: string | null;
}

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc';

export interface ProductFilters {
  query?: string;
  tcg: string[];
  set: string[];
  productType: string[];
  condition: string[];
  gradingCompany: string[];
  grade: string[];
  rarity: string[];
  language: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  newOnly: boolean;
  saleOnly: boolean;
}

export const emptyFilters: ProductFilters = {
  tcg: [],
  set: [],
  productType: [],
  condition: [],
  gradingCompany: [],
  grade: [],
  rarity: [],
  language: [],
  inStockOnly: false,
  newOnly: false,
  saleOnly: false,
};
