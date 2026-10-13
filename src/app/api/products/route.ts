import { NextResponse } from 'next/server';
import { searchProducts } from '@/lib/data/filter';
import { getProducts } from '@/lib/data/products';

export const revalidate = 300;

/** Lightweight read API for client islands (predictive search, wishlist, recently viewed). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = await getProducts();

  const ids = searchParams.get('ids');
  if (ids) {
    const wanted = ids.split(',').slice(0, 50);
    const byId = new Map(all.map((p) => [p.id, p]));
    return NextResponse.json({ products: wanted.map((id) => byId.get(id)).filter(Boolean), total: wanted.length });
  }

  const q = (searchParams.get('q') ?? '').slice(0, 80);
  const limit = Math.min(Number(searchParams.get('limit')) || 6, 20);
  const matches = q ? searchProducts(all, q) : [];
  return NextResponse.json({ products: matches.slice(0, limit), total: matches.length });
}
