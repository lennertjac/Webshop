import type { MetadataRoute } from 'next';
import { COLLECTIONS } from '@/lib/collections';
import { SITE_URL } from '@/lib/config';
import { getProducts } from '@/lib/data/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const staticPaths = ['', '/shop', '/vault', '/collections', '/sell', '/about', '/contact', '/faq', '/shipping-returns'];
  return [
    ...staticPaths.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: 'weekly' as const })),
    ...COLLECTIONS.map((c) => ({ url: `${SITE_URL}/collections/${c.slug}`, changeFrequency: 'daily' as const })),
    ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}`, lastModified: p.createdAt, changeFrequency: 'daily' as const })),
  ];
}
